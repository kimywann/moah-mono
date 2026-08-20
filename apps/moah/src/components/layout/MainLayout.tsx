import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

interface IMainLayoutProps {
  children: ReactNode;
}

const MainLayout = (props: IMainLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex min-w-0 flex-1">{props.children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
