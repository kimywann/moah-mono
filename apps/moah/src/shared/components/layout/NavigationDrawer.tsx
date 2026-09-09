import MHIcon from "@moah/ui/components/MHIcon";
import NavigationMenu from "@/shared/components/layout/NavigationMenu";

interface INavigationDrawerProps {
  email?: string;
  isAuthenticated: boolean;
  isOpen: boolean;
  isWithdrawing: boolean;
  name?: string;
  onClose: () => void;
  onLogout: () => void;
  onWithdraw: () => void;
  profileImage?: string;
}

const NavigationDrawer = ({
  email,
  isAuthenticated,
  isOpen,
  isWithdrawing,
  name,
  onClose,
  onLogout,
  onWithdraw,
  profileImage,
}: INavigationDrawerProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 desk:hidden">
      <button
        aria-label="메뉴 닫기"
        className="absolute inset-0 cursor-default bg-black/40"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label="주요 메뉴"
        aria-modal="true"
        className="relative ml-auto flex h-full w-72 max-w-[85vw] flex-col bg-background shadow-xl"
        id="navigation-drawer"
        role="dialog"
      >
        <div className="flex h-16 items-center justify-between border-border-subtle border-b px-4">
          <span className="display16 bold">메뉴</span>
          <button
            aria-label="메뉴 닫기"
            className="flex size-10 cursor-pointer items-center justify-center rounded-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            onClick={onClose}
            type="button"
          >
            <MHIcon icon="x" size={24} />
          </button>
        </div>
        <div className="p-4">
          <NavigationMenu isDrawer onNavigate={onClose} />
        </div>

        {isAuthenticated && (
          <div className="mt-auto border-border-subtle border-t p-4">
            <div className="mb-2 flex flex-col gap-1">
              <button
                className="display14 w-full cursor-pointer rounded-small px-4 py-2 text-left text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isWithdrawing}
                onClick={onWithdraw}
                type="button"
              >
                탈퇴하기
              </button>
              <button
                className="display14 w-full cursor-pointer rounded-small px-4 py-2 text-left text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={onLogout}
                type="button"
              >
                로그아웃
              </button>
            </div>

            <div className="flex items-center gap-3 rounded-small bg-muted px-4 py-3">
              {profileImage ? (
                <img
                  alt={`${name ?? "사용자"} 프로필 이미지`}
                  className="size-10 rounded-full object-cover"
                  src={profileImage}
                />
              ) : (
                <span className="display16 medium flex size-10 items-center justify-center rounded-full bg-brand10 text-primary">
                  {(name ?? "사용자").slice(0, 1)}
                </span>
              )}
              <div className="min-w-0">
                <p className="display14 semibold truncate">
                  {name ?? "사용자"}
                </p>
                {email && (
                  <p className="display12 truncate text-muted-foreground">
                    {email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default NavigationDrawer;
