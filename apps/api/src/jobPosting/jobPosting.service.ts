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

  - 원문에 없는 정보를 추측하지 마세요.
  - deadline은 YYYY-MM-DD 형식으로 반환합니다. 날짜가 없으면 null로 반환합니다.
  - deadlineType은 DATE, ROLLING, UNTIL_FILLED, UNKNOWN 중 하나로 반환합니다.
  - 날짜가 명시되면 deadlineType은 DATE로 반환합니다.
  - 상시 채용이면 deadlineType은 ROLLING, 채용 시 마감이면 UNTIL_FILLED로 반환합니다.
  - 마감 방식과 날짜를 확인할 수 없으면 deadlineType은 UNKNOWN으로 반환합니다.

  [원문 제목]
  - title은 공고에 표시된 원문 제목을 수정하거나 요약하지 않고 그대로 반환합니다.

  [포지션 정규화]
  - position은 공고 제목을 그대로 복사하지 말고, 핵심 직무를 상위 카테고리로 정규화합니다.
  - position은 반드시 다음 허용 목록 중 하나로 반환합니다:
    프론트엔드, 백엔드, 풀스택, 모바일, 데이터, AI, DevOps, QA, 보안, 게임, 임베디드, 영업, 디자인,
    마케팅, PM/PO, 기획, 기타.
  - FE, frontend, Frontend, 프론트엔드 개발자 → "프론트엔드"
  - Python, Java, Kotlin, 서버 개발자, Backend, 백엔드 개발자 → "백엔드"
  - Full Stack, 풀스택 개발자 → "풀스택"
  - iOS, Android, React Native, Flutter 개발자 → "모바일"
  - 데이터 엔지니어, 데이터 분석가, 데이터 사이언티스트 → "데이터"
  - 머신러닝, 딥러닝, AI 엔지니어 → "AI"
  - 인프라, 클라우드, SRE → "DevOps"
  - QA, 테스트 엔지니어 → "QA"
  - 보안 엔지니어, 정보보안 → "보안"
  - 게임 클라이언트, 게임 서버, 게임 개발자 → "게임"
  - 임베디드, 펌웨어 → "임베디드"
  - Sales, Account Executive, 영업 담당자 → "영업"
  - UI/UX, 프로덕트, 그래픽, 브랜드 디자이너 → "디자인"
  - 퍼포먼스, 콘텐츠, 디지털, 브랜드 마케터 → "마케팅"
  - Product Manager, Product Owner, PM, PO → "PM/PO"
  - 서비스 기획자, 사업 기획자, 운영 기획자 → "기획"
  - 허용 목록에 해당하는 직무가 없으면 "기타"를 반환합니다.

  [경력 연차]
  - minCareerYears와 maxCareerYears에는 지원 가능한 경력 연차 범위를 정수로 반환합니다.
  - 신입, 신입 가능 → minCareerYears: 0, maxCareerYears: 0
  - 경력무관, 신입·경력, 경력 제한 없음 → minCareerYears: 0, maxCareerYears: null
  - "N년" → minCareerYears: N, maxCareerYears: N
  - "N~M년" → minCareerYears: N, maxCareerYears: M
  - "N년 이상" → minCareerYears: N, maxCareerYears: null
  - "N년 이하" → minCareerYears: 0, maxCareerYears: N
  - 경력 조건을 확인할 수 없거나 해석이 모호하면 두 값 모두 null로 반환합니다.
  - 연차가 아닌 경력 표현은 추측하지 마세요.`;

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
        title: jobPosting.title,
        position: jobPosting.position,
        career: jobPosting.career,
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

    if (this.isPlatformHostname(hostname, "wanted.co.kr")) {
      return "WANTED";
    }

    return "OTHER";
  }

  private isPlatformHostname(hostname: string, platformHostname: string) {
    return (
      hostname === platformHostname || hostname.endsWith(`.${platformHostname}`)
    );
  }
}
