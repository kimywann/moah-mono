import { BrowserRouter, Route, Routes } from "react-router";
import ContentLayout from "@/components/layout/ContentLayout";
import MainLayout from "@/components/layout/MainLayout";
import ApplicationsPage from "@/pages/ApplicationsPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RecruitPage from "@/pages/RecruitPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<HomePage />} index />

          <Route element={<ContentLayout />}>
            <Route element={<ApplicationsPage />} path="applications" />
            <Route element={<RecruitPage />} path="recruit" />
          </Route>
        </Route>

        <Route element={<LoginPage />} path="login" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
