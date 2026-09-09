import MHIcon from "@moah/ui/components/MHIcon";
import cn from "@moah/ui/utils/cn";
import { NavLink } from "react-router";

interface INavigationMenuProps {
  isDrawer?: boolean;
  onNavigate?: () => void;
}

const NAVIGATION_ITEMS = [
  { icon: "house" as const, label: "홈", to: "/" },
  {
    icon: "clipboardList" as const,
    label: "지원 목록",
    to: "/applications",
  },
  { icon: "fileText" as const, label: "이력서", to: "/resume" },
];

const NavigationMenu = ({
  isDrawer = false,
  onNavigate,
}: INavigationMenuProps) => {
  return (
    <nav aria-label="주요 메뉴" className="flex w-full flex-col gap-2">
      {NAVIGATION_ITEMS.map(({ icon, label, to }) => (
        <NavLink
          className={({ isActive }) =>
            cn(
              "display14 medium flex rounded-small text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              isDrawer
                ? "items-center gap-3 px-4 py-3"
                : "flex-col items-center justify-center gap-1 px-3 py-2 text-center",
              isActive && "bg-brand5 text-primary",
            )
          }
          end={to === "/"}
          key={to}
          onClick={onNavigate}
          to={to}
        >
          <MHIcon icon={icon} size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default NavigationMenu;
