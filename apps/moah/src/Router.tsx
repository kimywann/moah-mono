import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import ApplicationsPage from "@/pages/ApplicationsPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ResumePage from "@/pages/ResumePage";
import ContentLayout from "@/shared/components/layout/ContentLayout";
import MainLayout from "@/shared/components/layout/MainLayout";

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
              <Route element={<ResumePage />} path="resume" />
            </Route>
          </Route>
        </Route>

        <Route element={<LoginPage />} path="login" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
