const Footer = () => {
  return (
    <footer className="foreground h-20 w-full shrink-0 border-border-subtle border-t bg-muted text-subtle-foreground">
      <div className="display12 mx-auto flex h-full max-w-content items-center justify-between px-8">
        <span>© 2026 MOAH · 취업 준비 관리 서비스</span>
        <a className="hover:text-foreground" href="mailto:moah.kim24@gmail.com">
          문의: moah.kim24@gmail.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;
