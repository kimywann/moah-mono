import MHIcon from "@moah/ui/components/MHIcon";
import { Link } from "react-router";

const NAV_CLASS =
  "flex flex-col items-center justify-center gap-1 rounded-small px-3 py-2 text-center text-muted-foreground transition-colors hover:bg-muted";

const Sidebar = () => {
  return (
    <aside className="flex w-30 shrink-0 flex-col justify-center border-neutral10 border-r">
      <nav aria-label="주요 메뉴" className="flex w-full flex-col gap-3 px-5">
        <Link className={NAV_CLASS} to="/">
          <MHIcon icon="house" size={20} />
          <span className="display14 medium">홈</span>
        </Link>

        <Link className={NAV_CLASS} to="/dashboard">
          <MHIcon icon="layoutDashboard" size={20} />
          <span className="display14 medium">대시보드</span>
        </Link>

        <Link className={NAV_CLASS} to="/applications">
          <MHIcon icon="clipboardList" size={20} />
          <span className="display14 medium">지원 목록</span>
        </Link>

        <Link className={NAV_CLASS} to="/board">
          <MHIcon icon="squareKanban" size={20} />
          <span className="display14 medium">칸반 보드</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
