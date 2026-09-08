import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="foreground h-20 w-full shrink-0 border-border-subtle border-t bg-muted text-subtle-foreground">
      <div className="display12 mx-auto flex h-full max-w-content items-center justify-between px-8">
        <span>© 2026 Moah · 구직 활동 관리 서비스</span>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <Link className="hover:text-foreground" to="/privacy">
              개인정보 처리방침
            </Link>
            <span aria-hidden="true">|</span>
            <span>이용약관</span>
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
