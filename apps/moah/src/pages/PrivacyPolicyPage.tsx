import { Link } from "react-router";
import logo from "@/shared/assets/logo.svg";

interface IPolicyRow {
  category: string;
  information: string;
  purpose: string;
}

const PERSONAL_INFORMATION_ROWS: IPolicyRow[] = [
  {
    category: "Google 로그인",
    information: "Google 계정 식별자, 이메일 주소, 이름, 프로필 이미지",
    purpose: "회원 식별 및 로그인",
  },
  {
    category: "서비스 이용",
    information:
      "지원 정보(채용 공고 URL, 회사명, 지원 직무·단계, 경력, 근무지, 일정, 기술 스택 등), 이력서/포트폴리오 파일 및 파일명/형식/용량",
    purpose: "지원 활동 관리 및 파일 보관",
  },
  {
    category: "서비스 운영",
    information:
      "세션 토큰의 해시값, 로그인/탈퇴/URL 분석 시각, 오류 정보 및 기기/브라우저 관련 기술 정보",
    purpose: "인증 유지, 이용 한도 관리 및 장애 대응",
  },
];

interface IExternalProcessorRow {
  provider: string;
  purpose: string;
}

const EXTERNAL_PROCESSOR_ROWS: IExternalProcessorRow[] = [
  {
    provider: "Google LLC",
    purpose: "Google 계정 로그인 및 채용 공고 URL 분석",
  },
  {
    provider: "Amazon Web Services, Inc. (Amazon RDS, 대한민국 서울 리전)",
    purpose: "회원 정보, 지원 정보, 세션 및 이용 기록 저장",
  },
  {
    provider: "Amazon Web Services, Inc. (Amazon S3)",
    purpose: "이력서·포트폴리오 파일 저장 및 제공",
  },
  {
    provider: "Functional Software, Inc. (Sentry)",
    purpose: "오류 분석 및 서비스 안정성 개선을 위한 기술 정보 처리",
  },
];

const PrivacyPolicyPage = () => {
  return (
    <main className="min-h-screen bg-background px-6 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          aria-label="홈으로 이동"
          className="inline-flex size-11 items-center justify-center rounded-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          to="/"
        >
          <img alt="Logo" className="size-10 object-contain" src={logo} />
        </Link>

        <article className="mt-8 rounded-medium border border-border-subtle bg-background p-6 sm:p-10">
          <h1 className="bold display28 mt-2">개인정보 처리방침</h1>
          <p className="display14 regular mt-4 text-muted-foreground leading-6">
            모아(이하 “서비스”)는 이용자의 개인정보를 중요하게 생각하며 관련
            법령을 준수합니다. 이 방침은 서비스가 처리하는 개인정보와 그 처리
            방법을 안내합니다.
          </p>

          <div className="display14 regular mt-10 space-y-10 text-foreground leading-7">
            <section>
              <h2 className="bold display18">1. 처리하는 개인정보와 목적</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-150 border-collapse text-left">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="border border-border-subtle px-3 py-2 font-medium">
                        구분
                      </th>
                      <th className="border border-border-subtle px-3 py-2 font-medium">
                        처리 항목
                      </th>
                      <th className="border border-border-subtle px-3 py-2 font-medium">
                        처리 목적
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PERSONAL_INFORMATION_ROWS.map((row) => (
                      <tr key={row.category}>
                        <td className="border border-border-subtle px-3 py-2">
                          {row.category}
                        </td>
                        <td className="border border-border-subtle px-3 py-2">
                          {row.information}
                        </td>
                        <td className="border border-border-subtle px-3 py-2">
                          {row.purpose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-muted-foreground">
                서비스는 Google의 Gmail, Drive, Calendar 등 Google 서비스의
                내용이나 비밀번호를 수집하지 않습니다. Google 로그인에는{" "}
                <code className="rounded bg-muted px-1 py-0.5">openid</code>,{" "}
                <code className="rounded bg-muted px-1 py-0.5">email</code>,{" "}
                <code className="rounded bg-muted px-1 py-0.5">profile</code>{" "}
                권한만 요청합니다.
              </p>
            </section>

            <section>
              <h2 className="bold display18">2. 보유 및 이용 기간</h2>
              <p className="mt-3">
                회원 정보, 지원 정보 및 업로드 파일은 회원 탈퇴 시 지체 없이
                삭제합니다. 세션은 발급일로부터 7일 동안 유지되며, 만료되면
                인증에 사용할 수 없습니다. 다만 법령에 따라 보관이 필요한 정보가
                있는 경우 해당 기간 동안 보관합니다.
              </p>
            </section>

            <section>
              <h2 className="bold display18">3. 개인정보의 외부 처리</h2>
              <p className="mt-3">
                서비스 제공을 위해 아래 사업자를 이용합니다. 각 사업자는 서비스
                운영에 필요한 범위에서 정보를 처리할 수 있습니다.
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-125 border-collapse text-left">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="border border-border-subtle px-3 py-2 font-medium">
                        사업자
                      </th>
                      <th className="border border-border-subtle px-3 py-2 font-medium">
                        이용 목적 및 처리 정보
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXTERNAL_PROCESSOR_ROWS.map((row) => (
                      <tr key={row.provider}>
                        <td className="border border-border-subtle px-3 py-2">
                          {row.provider}
                        </td>
                        <td className="border border-border-subtle px-3 py-2">
                          {row.purpose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-muted-foreground">
                채용 공고 URL 분석에는 Google Gemini API를 사용하며, URL과 그
                분석 결과가 처리될 수 있습니다. 서비스는 이력서·포트폴리오
                파일을 Gemini API로 전송하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="bold display18">4. 파기 절차 및 방법</h2>
              <p className="mt-3">
                탈퇴 요청이 완료되면 회원 정보와 연결된 지원 정보, 이력서 및
                포트폴리오 파일을 삭제합니다. 전자적 파일은 복구할 수 없는
                방법으로 삭제하며, 법령상 보관 의무가 있는 정보는 별도 저장한 뒤
                보관 기간이 끝나면 삭제합니다.
              </p>
            </section>
            <section>
              <h2 className="bold display18">5. 쿠키와 세션</h2>
              <p className="mt-3">
                서비스는 로그인 상태 유지와 보안 검증을 위해 세션 쿠키 및 Google
                로그인 진행 상태 확인용 쿠키를 사용합니다. 해당 쿠키는 인증 및
                보안 목적 외에는 사용하지 않습니다. 브라우저 설정에서 쿠키
                저장을 거부할 수 있으나, 이 경우 로그인 기능 이용이 제한될 수
                있습니다.
              </p>
            </section>
            <section>
              <h2 className="bold display18">6. 이용자의 권리와 행사 방법</h2>
              <p className="mt-3">
                이용자는 자신의 개인정보에 대해 열람, 정정, 삭제 및 처리정지를
                요청할 수 있습니다. 서비스 내 프로필 메뉴의 “탈퇴하기”를 통해
                계정과 저장 정보를 삭제할 수 있으며, 그 밖의 요청은 아래
                문의처로 연락해 주세요.
              </p>
            </section>
            <section>
              <h2 className="bold display18">7. 개인정보 보호책임 및 문의</h2>
              <p className="mt-3">
                개인정보 처리 관련 문의와 불만 처리는 아래로 연락해 주세요.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>서비스명: 모아</li>
                <li>
                  이메일:{" "}
                  <a className="underline" href="mailto:moah.kim24@gmail.com">
                    moah.kim24@gmail.com
                  </a>
                </li>
              </ul>
            </section>
            <section>
              <h2 className="bold display18">8. 방침의 변경</h2>
              <p className="mt-3">
                이 방침은 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경
                사항은 이 페이지에 게시합니다.
              </p>
              <p className="mt-3 text-muted-foreground">
                시행일: 2026년 9월 8일
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
