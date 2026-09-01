import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import ContentLayout from "@/components/layout/ContentLayout";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import ApplicationsPage from "@/pages/ApplicationsPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RecruitPage from "@/pages/RecruitPage";

const RequireAuth = () => {
  const { isAuthenticated, isAuthInitialized } = useAuth();

  if (!isAuthInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<HomePage />} index />

          <Route element={<ContentLayout />}>
            <Route element={<RequireAuth />}>
              <Route element={<ApplicationsPage />} path="applications" />
            </Route>
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
