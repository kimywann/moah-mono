import {
  jobPostingExtractionResponseSchema,
  type TJobPostingExtraction,
  type TJobPostingForm,
} from "@moah/contracts/schema/job-posting";
import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { z } from "zod";
import { ApplicationsService } from "../applications/applications.service";
import { getJobPostingPlatform } from "../common/utils/utils";
import { PrismaService } from "../prisma/prisma.service";
import { EXTRACTION_PROMPT } from "./constants/prompt";

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

interface IGeminiErrorResponse {
  error?: {
    code?: string;
  };
}

const DAILY_EXTRACTION_LIMIT = 5;
const KOREAN_TIME_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class JobPostingService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(ApplicationsService)
    private readonly applicationsService: ApplicationsService,
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async findAll() {
    const jobPostings = await this.prismaService.jobPosting.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        url: true,
        platform: true,
        companyName: true,
        title: true,
        position: true,
        minYears: true,
        maxYears: true,
        location: true,
        deadline: true,
        deadlineType: true,
      },
    });

    return jobPostings.map((jobPosting) => ({
      ...jobPosting,
      deadline: jobPosting.deadline?.toISOString().slice(0, 10) ?? null,
    }));
  }

  async extract(userId: string, url: string) {
    const dailyUsageCount = await this.prismaService.jobPostingExtraction.count(
      {
        where: {
          userId,
          createdAt: {
            gte: this.getDailyUsageStart(),
          },
        },
      },
    );

    if (dailyUsageCount >= DAILY_EXTRACTION_LIMIT) {
      throw new HttpException(
        "일일 URL 분석 횟수를 초과했습니다.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const apiKey = this.configService.getOrThrow<string>("GEMINI_API_KEY");
    const apiURL = this.configService.getOrThrow<string>("GEMINI_API_URL");
    const fallbackApiURL = this.configService.getOrThrow<string>(
      "GEMINI_FALLBACK_API_URL",
    );

    const primaryResponse = await this.requestExtraction(apiURL, apiKey, url);
    const response = (await this.isQuotaExceeded(primaryResponse))
      ? await this.requestExtraction(fallbackApiURL, apiKey, url)
      : primaryResponse;

    if (await this.isQuotaExceeded(response)) {
      throw new ServiceUnavailableException(
        "오늘 AI 분석 요청 한도를 모두 사용했습니다.",
      );
    }

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

    if (this.isRequiredJobPostingInfoMissing(parsedJobPosting.data)) {
      throw new UnprocessableEntityException({
        code: "JOB_POSTING_REQUIRED_INFO_MISSING",
      });
    }

    await this.prismaService.jobPostingExtraction.create({
      data: { userId },
    });

    return parsedJobPosting.data;
  }

  async getExtractionUsage(userId: string) {
    const usedCount = await this.prismaService.jobPostingExtraction.count({
      where: {
        userId,
        createdAt: {
          gte: this.getDailyUsageStart(),
        },
      },
    });

    return {
      limit: DAILY_EXTRACTION_LIMIT,
      remainingCount: Math.max(DAILY_EXTRACTION_LIMIT - usedCount, 0),
    };
  }

  private async requestExtraction(apiURL: string, apiKey: string, url: string) {
    return fetch(apiURL, {
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
  }

  private async isQuotaExceeded(response: Response) {
    if (response.status !== 429) {
      return false;
    }

    const responseBody = (await response
      .clone()
      .json()) as IGeminiErrorResponse;

    return responseBody.error?.code === "quota_exceeded";
  }

  private getDailyUsageStart() {
    const now = Date.now();

    return new Date(
      Math.floor((now + KOREAN_TIME_OFFSET_MS) / DAY_MS) * DAY_MS -
        KOREAN_TIME_OFFSET_MS,
    );
  }

  async save(userId: string, jobPosting: TJobPostingForm) {
    const platform = getJobPostingPlatform(jobPosting.url);
    const deadline = jobPosting.deadline
      ? new Date(`${jobPosting.deadline}T00:00:00.000Z`)
      : null;
    await this.prismaService.jobPosting.upsert({
      where: { url: jobPosting.url },
      create: {
        url: jobPosting.url,
        platform,
        companyName: jobPosting.companyName,
        title: jobPosting.title,
        position: jobPosting.position,
        minYears: jobPosting.minYears,
        maxYears: jobPosting.maxYears,
        location: jobPosting.location,
        deadline,
        deadlineType: jobPosting.deadlineType,
        extractedAt: new Date(),
      },
      update: {
        platform,
        title: jobPosting.title,
        deadlineType: jobPosting.deadlineType,
      },
    });

    return this.applicationsService.create(userId, jobPosting, platform);
  }

  private isRequiredJobPostingInfoMissing(jobPosting: TJobPostingExtraction) {
    return !(
      jobPosting.companyName?.trim() &&
      jobPosting.title?.trim() &&
      jobPosting.position
    );
  }
}
