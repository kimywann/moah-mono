import { Outlet } from "react-router";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
