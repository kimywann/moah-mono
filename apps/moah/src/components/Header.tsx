import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="h-16 w-full shrink-0 border-neutral10 border-b">
      <div className="flex h-full w-full items-center justify-between px-6">
        <Link aria-label="Moah 홈" href="/">
          <Image
            alt="Moah"
            className="h-10 w-auto"
            height={40}
            priority
            src="/icon/logo.svg"
            width={89}
          />
        </Link>

        <Link
          className="display14 bold inline-flex h-9 items-center justify-center rounded-tiny bg-primary px-4 text-white hover:bg-primary-hover"
          href="/login"
        >
          로그인
        </Link>
      </div>
    </header>
  );
};

export default Header;
