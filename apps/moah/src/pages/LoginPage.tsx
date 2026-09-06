import { API_BASE_URL } from "@moah/shared/config/config";
import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <section className="relative z-10 w-full max-w-120 rounded-medium border border-border p-8 shadow-xs">
        <button
          aria-label="이전 페이지로"
          className="-ml-3 flex size-10 cursor-pointer items-center justify-center rounded-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          onClick={() => navigate(-1)}
          type="button"
        >
          <MHIcon icon="arrowLeft" size={30} />
        </button>

        <div className="mt-2">
          <h1 className="bold display28 text-center">로그인</h1>
          <p className="display16 medium mt-8 text-center text-muted-foreground">
            채용 공고 URL 하나로 공고 정보를 불러와
            <br />
            지원 목록에 바로 저장하세요.
          </p>
          <p className="display14 medium mt-2 text-center text-primary">
            로그인하면 매일 10회 이용할 수 있어요!
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <MHButton
            isFullWidth
            onClick={() =>
              window.location.assign(`${API_BASE_URL}/auth/google`)
            }
            size="large"
          >
            Google로 빠르게 로그인하기
          </MHButton>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
