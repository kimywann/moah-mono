import type { ReactNode } from "react";
import MainLayout from "@/components/layout/MainLayout";

interface IFullWidthLayoutProps {
  children: ReactNode;
}

const FullWidthLayout = ({ children }: IFullWidthLayoutProps) => {
  return <MainLayout>{children}</MainLayout>;
};

export default FullWidthLayout;
