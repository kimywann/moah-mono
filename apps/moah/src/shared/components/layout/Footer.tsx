import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="foreground tab:h-20 w-full shrink-0 border-border-subtle border-t bg-muted text-subtle-foreground">
      <div className="display12 mx-auto flex tab:h-full max-w-content tab:flex-row flex-col items-start tab:items-center tab:justify-between gap-2 px-4 tab:px-8 py-5 tab:py-0">
        <span>© 2026 모아 | 취업 지원 관리 서비스</span>
        <div className="flex flex-col items-start tab:items-end gap-1">
          <div className="flex tab:flex-row flex-col items-start tab:items-center gap-1 tab:gap-2">
            <Link className="hover:text-foreground" to="/privacy">
              개인정보 처리방침
            </Link>
            <span aria-hidden="true" className="tab:inline hidden">
              |
            </span>
            <Link className="hover:text-foreground" to="/terms">
              이용약관
            </Link>
          </div>
          <a
            className="hover:text-foreground"
            href="mailto:moah.kim24@gmail.com"
          >
            문의: moah.kim24@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
