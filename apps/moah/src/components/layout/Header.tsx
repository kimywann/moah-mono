import MHButton from "@moah/ui/components/MHButton";
import { Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, user, handleLogout } = useAuth();

  return (
    <header className="h-16 w-full shrink-0">
      <div className="flex h-full w-full items-center px-6">
        {isAuthenticated ? (
          <div className="ml-auto flex items-center gap-2">
            <img
              alt={`${user?.name ?? "사용자"} 프로필 이미지`}
              className="size-10 rounded-full object-cover"
              src={user?.profileImage ?? ""}
            />
            <MHButton onClick={handleLogout}>로그아웃</MHButton>
          </div>
        ) : (
          <Link
            className="display14 bold ml-auto inline-flex h-9 items-center justify-center rounded-tiny bg-primary px-4 text-white hover:bg-primary-hover"
            to="/login"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
