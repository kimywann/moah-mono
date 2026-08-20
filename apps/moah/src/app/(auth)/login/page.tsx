"use client";

import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  return (
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
          onClick={() => router.back()}
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
          <MHButton isFullWidth size="large" variant="secondary">
            구글로 로그인
          </MHButton>

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
  );
};

export default LoginPage;
