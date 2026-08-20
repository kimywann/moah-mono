import type { ReactNode } from "react";
import MainLayout from "@/components/layout/MainLayout";

interface IContentLayoutProps {
  children: ReactNode;
}

const ContentLayout = ({ children }: IContentLayoutProps) => {
  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-content px-8 py-10">{children}</div>
    </MainLayout>
  );
};

export default ContentLayout;
