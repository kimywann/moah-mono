import MHIcon from "@moah/ui/components/MHIcon";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router";
import { loginWithGoogle } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async (credential: string) => {
    const response = await loginWithGoogle(credential);

    if (!response.data) {
      throw new Error("구글 로그인 정보를 확인할 수 없습니다.");
    }

    login(response.data);
    navigate("/");
  };

  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
        <video
          aria-hidden
          autoPlay
          className="absolute inset-0 size-full object-cover"
          loop
          muted
          playsInline
        >
          <source src="/video/login-background.mp4" type="video/mp4" />
        </video>

        <section className="relative z-10 w-full max-w-120 rounded-medium bg-background/95 p-8 shadow-xs backdrop-blur-sm">
          <button
            aria-label="이전 페이지로"
            className="-ml-3 flex size-10 cursor-pointer items-center justify-center rounded-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            onClick={() => navigate(-1)}
            type="button"
          >
            <MHIcon icon="arrowLeft" size={30} />
          </button>

          <div className="mt-4">
            <h1 className="bold display28 text-center">로그인</h1>
            <p className="display16 medium mt-3 text-center text-muted-foreground">
              소셜 계정으로 간편하게 시작하세요
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <GoogleLogin
              onError={() => window.alert("구글 로그인에 실패했습니다.")}
              onSuccess={async ({ credential }) => {
                if (!credential) {
                  window.alert("구글 로그인 정보를 확인할 수 없습니다.");
                  return;
                }

                try {
                  setIsLoading(true);
                  await handleGoogleLogin(credential);
                } catch {
                  window.alert("구글 로그인에 실패했습니다.");
                } finally {
                  setIsLoading(false);
                }
              }}
              text="signin_with"
              width="100%"
            />

            {isLoading && (
              <p className="display14 text-center text-muted-foreground">
                로그인 중입니다...
              </p>
            )}

            {/* <div className="grid grid-cols-2 gap-3">
            <MHButton isFullWidth size="large" variant="secondary">
              네이버
            </MHButton>
            <MHButton isFullWidth size="large" variant="secondary">
              카카오
            </MHButton>
          </div> */}
          </div>
        </section>
      </main>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
