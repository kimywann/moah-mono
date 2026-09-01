import MHIcon from "@moah/ui/components/MHIcon";
import { Link } from "react-router";
import logo from "@/shared/assets/logo.svg";

const NAV_CLASS =
  "flex flex-col items-center justify-center gap-1 rounded-small px-3 py-2 text-center text-muted-foreground transition-colors hover:bg-muted";

const Sidebar = () => {
  return (
    <aside className="flex w-30 shrink-0 flex-col border-neutral10 border-r">
      <div className="flex items-center justify-center px-5 py-6">
        <img alt="Moah Logo" className="size-10 object-contain" src={logo} />
      </div>

      <nav
        aria-label="주요 메뉴"
        className="mt-10 flex w-full flex-col gap-4 px-5"
      >
        <Link className={NAV_CLASS} to="/">
          <MHIcon icon="house" size={20} />
          <span className="display14 medium">홈</span>
        </Link>

        <Link className={NAV_CLASS} to="/applications">
          <MHIcon icon="clipboardList" size={20} />
          <span className="display14 medium">지원 목록</span>
        </Link>

        <Link className={NAV_CLASS} to="/recruit">
          <MHIcon icon="layoutDashboard" size={20} />
          <span className="display14 medium">채용 공고</span>
        </Link>

        {/* <Link className={NAV_CLASS} to="/board">
          <MHIcon icon="squareKanban" size={20} />
          <span className="display14 medium">칸반 보드</span>
        </Link> */}
      </nav>
    </aside>
  );
};

export default Sidebar;
