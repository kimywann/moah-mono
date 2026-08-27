import {
  jobPostingExtractionResponseSchema,
  type TJobPostingForm,
} from "@moah/contracts/schema/job-posting";
import {
  BadGatewayException,
  ConflictException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { z } from "zod";
import { type JobPostingPlatform, Prisma } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const GEMINI_RESPONSE_SCHEMA = z.object({
  candidates: z.array(
    z.object({
      content: z.object({
        parts: z.array(
          z.object({
            text: z.string(),
          }),
        ),
      }),
    }),
  ),
});

const EXTRACTION_PROMPT = `주어진 채용 공고 URL의 페이지 내용을 확인하고 정보를 추출하세요.

규칙:
- 공고에 없는 단일 값은 null로 반환하고, 목록은 빈 배열로 반환합니다.
- deadline은 YYYY-MM-DD 형식으로 반환합니다.
- 날짜를 확실히 알 수 없다면 null로 반환합니다.
- hiringProcess는 실제 진행 순서대로 반환합니다.
- techStacks에는 공고에 명시된 기술만 포함합니다.
- 원문에 없는 내용을 추측하지 마세요.`;

@Injectable()
export class JobPostingService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async extract(url: string) {
    const apiKey = this.configService.getOrThrow<string>("GEMINI_API_KEY");
    const apiURL = this.configService.getOrThrow<string>("GEMINI_API_URL");

    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${EXTRACTION_PROMPT}\n\n채용 공고 URL:\n${url}`,
              },
            ],
          },
        ],
        // Gemini가 전달된 URL의 페이지 내용을 직접 조회하도록 설정
        tools: [
          {
            url_context: {},
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseJsonSchema: z.toJSONSchema(
            jobPostingExtractionResponseSchema,
          ),
        },
      }),
    });

    if (!response.ok) {
      throw new BadGatewayException("채용 공고 추출 요청에 실패했습니다.");
    }

    const responseBody: unknown = await response.json();
    const parsedResponse = GEMINI_RESPONSE_SCHEMA.safeParse(responseBody);
    const responseText = parsedResponse.success
      ? parsedResponse.data.candidates.at(0)?.content.parts.at(0)?.text
      : undefined;

    if (!responseText) {
      throw new BadGatewayException(
        "채용 공고 추출 결과를 확인할 수 없습니다.",
      );
    }

    let extractedJobPosting: unknown;

    try {
      extractedJobPosting = JSON.parse(responseText);
    } catch {
      throw new BadGatewayException("채용 공고 추출 결과가 올바르지 않습니다.");
    }

    const parsedJobPosting =
      jobPostingExtractionResponseSchema.safeParse(extractedJobPosting);

    if (!parsedJobPosting.success) {
      throw new BadGatewayException("채용 공고 추출 결과가 올바르지 않습니다.");
    }

    return parsedJobPosting.data;
  }

  async save(userId: string, jobPosting: TJobPostingForm) {
    const platform = this.getPlatform(jobPosting.url);
    const deadline = jobPosting.deadline
      ? new Date(`${jobPosting.deadline}T00:00:00.000Z`)
      : null;
    const savedJobPosting = await this.prismaService.jobPosting.upsert({
      where: { url: jobPosting.url },
      create: {
        url: jobPosting.url,
        platform,
        companyName: jobPosting.companyName,
        position: jobPosting.position,
        career: jobPosting.career,
        location: jobPosting.location,
        deadline,
        hiringProcess: jobPosting.hiringProcess,
        techStacks: jobPosting.techStacks,
        extractedAt: new Date(),
      },
      update: {},
    });

    try {
      return await this.prismaService.application.create({
        data: {
          userId,
          jobPostingId: savedJobPosting.id,
          stage: "READY",
        },
        select: {
          id: true,
          jobPostingId: true,
          stage: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("이미 지원 목록에 저장된 채용 공고입니다.");
      }

      throw error;
    }
  }

  private getPlatform(url: string): JobPostingPlatform {
    const hostname = new URL(url).hostname.toLowerCase();

    if (this.isPlatformHostname(hostname, "saramin.co.kr")) {
      return "SARAMIN";
    }

    if (this.isPlatformHostname(hostname, "jobkorea.co.kr")) {
      return "JOB_KOREA";
    }

    if (this.isPlatformHostname(hostname, "jobplanet.co.kr")) {
      return "JOB_PLANET";
    }

    if (this.isPlatformHostname(hostname, "zighang.com")) {
      return "ZIGHANG";
    }

    if (this.isPlatformHostname(hostname, "rocketpunch.com")) {
      return "ROCKET_PUNCH";
    }

    if (this.isPlatformHostname(hostname, "work24.go.kr")) {
      return "WORK24";
    }

    return "OTHER";
  }

  private isPlatformHostname(hostname: string, platformHostname: string) {
    return (
      hostname === platformHostname || hostname.endsWith(`.${platformHostname}`)
    );
  }
}
