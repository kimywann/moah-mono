import { Link } from "react-router";
import logo from "@/shared/assets/logo.svg";

const TermsPage = () => {
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
          <h1 className="bold display28 mt-2">이용약관</h1>
          <p className="display14 regular mt-4 text-muted-foreground leading-6">
            본 약관은 모아(이하 “서비스”)의 이용 조건, 서비스와 이용자의
            권리·의무 및 책임 사항을 정합니다.
          </p>

          <div className="display14 regular mt-10 space-y-10 text-foreground leading-7">
            <section>
              <h2 className="bold display18">제1조 (목적)</h2>
              <p className="mt-3">
                본 약관은 서비스가 제공하는 채용 공고 관리, 지원 활동 관리,
                이력서·포트폴리오 보관 및 채용 공고 URL 분석 기능의 이용 조건과
                절차를 정하는 것을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="bold display18">제2조 (약관의 효력 및 변경)</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>
                  이용자는 Google 로그인을 통해 서비스 이용을 시작함으로써 본
                  약관에 동의한 것으로 봅니다.
                </li>
                <li>
                  서비스는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수
                  있으며, 변경 시 시행일과 변경 내용을 서비스 내 또는 본
                  페이지에 게시합니다.
                </li>
                <li>
                  이용자에게 불리하거나 중요한 변경은 합리적인 기간을 두고
                  안내합니다. 이용자가 변경된 약관에 동의하지 않으면 서비스
                  이용을 중단하고 탈퇴할 수 있습니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="bold display18">제3조 (회원 가입 및 계정)</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>서비스는 Google 계정 인증을 통해 이용자를 식별합니다.</li>
                <li>
                  이용자는 자신의 계정을 직접 사용해야 하며, 계정 접근 정보의
                  관리 책임은 이용자에게 있습니다.
                </li>
                <li>
                  이용자는 서비스 내 프로필 메뉴의 “탈퇴하기”를 통해 언제든 회원
                  탈퇴를 요청할 수 있습니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="bold display18">제4조 (서비스의 내용)</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>
                  서비스는 채용 공고 URL에서 공고 정보를 분석하고, 이용자가 지원
                  정보를 기록·관리할 수 있도록 돕습니다.
                </li>
                <li>
                  이용자는 이력서 및 포트폴리오 파일을 업로드하여 보관할 수
                  있습니다.
                </li>
                <li>
                  URL 분석 결과는 원문이나 외부 사이트의 변경, 기술적 제한 등에
                  따라 부정확하거나 제공되지 않을 수 있습니다. 이용자는 중요한
                  정보와 지원 조건을 원문에서 직접 확인해야 합니다.
                </li>
                <li>
                  서비스는 기능 개선 또는 운영상 필요에 따라 서비스 전부 또는
                  일부를 변경하거나 중단할 수 있으며, 중요한 변경은 사전에
                  안내하기 위해 노력합니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="bold display18">
                제5조 (이용자의 의무 및 금지 행위)
              </h2>
              <p className="mt-3">이용자는 다음 행위를 해서는 안 됩니다.</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>
                  타인의 계정을 사용하거나 서비스의 인증·보안 기능을 우회하는
                  행위
                </li>
                <li>
                  법령, 제3자의 권리 또는 외부 채용 사이트의 이용 조건을
                  위반하는 방식으로 서비스를 사용하는 행위
                </li>
                <li>
                  악성 코드, 자동화된 대량 요청 또는 그 밖의 방법으로 서비스
                  운영을 방해하는 행위
                </li>
                <li>
                  타인의 개인정보나 권리를 침해하는 파일·정보를 업로드하거나
                  전송하는 행위
                </li>
              </ol>
            </section>

            <section>
              <h2 className="bold display18">
                제6조 (게시 정보 및 외부 서비스)
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>
                  이용자가 입력하거나 업로드한 정보와 파일의 권리는 이용자 또는
                  정당한 권리자에게 있습니다.
                </li>
                <li>
                  서비스는 기능 제공과 보안·장애 대응에 필요한 범위에서만 해당
                  정보와 파일을 처리합니다. 자세한 내용은 개인정보 처리방침에서
                  확인할 수 있습니다.
                </li>
                <li>
                  채용 공고 URL 분석은 외부 서비스와 연동될 수 있으며, 외부
                  사이트의 정보·정책·가용성에 대해서는 해당 사이트의 정책이
                  적용됩니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="bold display18">제7조 (이용 제한 및 계약 해지)</h2>
              <p className="mt-3">
                서비스는 이용자가 본 약관 또는 관련 법령을 중대하게 위반하거나
                서비스의 안전한 운영을 해치는 경우, 필요한 범위에서 이용을
                제한하거나 계약을 해지할 수 있습니다. 가능한 경우 사유와 조치
                내용을 안내합니다.
              </p>
            </section>

            <section>
              <h2 className="bold display18">제8조 (책임의 제한)</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>
                  서비스는 이용자가 입력한 정보, 외부 채용 사이트 정보 또는 URL
                  분석 결과의 완전성·정확성·최신성을 보장하지 않습니다.
                </li>
                <li>
                  서비스는 천재지변, 통신 장애, 외부 서비스 장애 등 서비스의
                  합리적인 통제 범위를 벗어난 사유로 발생한 손해에 책임을 지지
                  않습니다.
                </li>
                <li>
                  서비스의 고의 또는 과실로 이용자에게 손해가 발생한 경우에는
                  관련 법령에 따라 책임을 부담합니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="bold display18">제9조 (개인정보 보호)</h2>
              <p className="mt-3">
                서비스는 이용자의 개인정보를 개인정보 처리방침에 따라
                처리합니다. 개인정보의 처리 항목, 보유 기간, 외부 처리 사업자 및
                이용자의 권리는{" "}
                <Link className="underline" to="/privacy">
                  개인정보 처리방침
                </Link>
                에서 확인할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="bold display18">제10조 (문의 및 준거법)</h2>
              <p className="mt-3">
                서비스 이용 관련 문의는{" "}
                <a className="underline" href="mailto:moah.kim24@gmail.com">
                  moah.kim24@gmail.com
                </a>
                으로 보내 주세요. 본 약관과 관련한 분쟁에는 대한민국 법령을
                적용합니다.
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

export default TermsPage;
