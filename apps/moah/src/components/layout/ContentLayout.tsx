import { Outlet } from "react-router";

const ContentLayout = () => {
  return (
    <div className="mx-auto w-full max-w-content px-8 py-10">
      <Outlet />
    </div>
  );
};

export default ContentLayout;
