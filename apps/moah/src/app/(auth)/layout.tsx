import type { ReactNode } from "react";

interface IAuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: IAuthLayoutProps) => {
  return children;
};

export default AuthLayout;
