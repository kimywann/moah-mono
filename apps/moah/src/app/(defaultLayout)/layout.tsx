import type { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface IDefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout = ({ children }: IDefaultLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout;
