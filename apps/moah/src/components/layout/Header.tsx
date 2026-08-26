import { Link } from "react-router";

const Header = () => {
  return (
    <header className="h-16 w-full shrink-0">
      <div className="flex h-full w-full items-center px-6">
        <Link
          className="display14 bold ml-auto inline-flex h-9 items-center justify-center rounded-tiny bg-primary px-4 text-white hover:bg-primary-hover"
          to="/login"
        >
          로그인
        </Link>
      </div>
    </header>
  );
};

export default Header;
