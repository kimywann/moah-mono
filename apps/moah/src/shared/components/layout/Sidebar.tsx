import { Link } from "react-router";
import logo from "@/shared/assets/logo.svg";
import NavigationMenu from "@/shared/components/layout/NavigationMenu";

const Sidebar = () => {
  return (
    <aside className="sticky top-0 desk:flex hidden h-screen w-30 shrink-0 flex-col border-neutral10 border-r">
      <div className="flex items-center justify-center px-5 py-6">
        <Link to="/">
          <img
            alt="Moah Logo"
            className="curosr-pointer size-10 object-contain"
            src={logo}
          />
        </Link>
      </div>

      <div className="mt-10 px-5">
        <NavigationMenu />
      </div>
    </aside>
  );
};

export default Sidebar;
