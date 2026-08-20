"use client";

import MHButton from "@moah/ui/components/MHButton";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="flex max-w-120 flex-col items-center text-center">
        <p className="bold display40 text-primary">404</p>
        <h1 className="bold display28 mt-4">페이지를 찾을 수 없어요</h1>
        <p className="display16 medium mt-3 text-muted-foreground">
          주소가 변경되었거나 존재하지 않는 페이지입니다.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <MHButton onClick={handleGoBack} variant="secondary">
            이전 페이지로
          </MHButton>
          <MHButton onClick={handleGoHome}>홈으로 가기</MHButton>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
