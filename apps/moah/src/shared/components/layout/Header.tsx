import { API_BASE_URL } from "@moah/shared/config/config";
import MHButton from "@moah/ui/components/MHButton";
import MHIcon from "@moah/ui/components/MHIcon";
import MHModal from "@moah/ui/components/MHModal";
import { toast } from "@moah/ui/components/MHToaster";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/shared/assets/logo.svg";
import NavigationDrawer from "@/shared/components/layout/NavigationDrawer";

const AUTH_BUTTON_CLASS =
  "medium semibold inline-flex h-11 items-center justify-center whitespace-nowrap rounded-tiny bg-primary px-4 text-white leading-body transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 cursor-pointer";
const MENU_ITEM_CLASS =
  "display14 regular flex w-full cursor-pointer rounded-tiny px-3 py-2 text-left text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50";

const Header = () => {
  const { isAuthenticated, user, handleLogout, handleWithdraw } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoginPopoverOpen, setIsLoginPopoverOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const loginPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.pathname) {
      setIsNavigationOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isNavigationOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const desktopMediaQuery = window.matchMedia("(min-width: 64rem)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsNavigationOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNavigationOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    desktopMediaQuery.addEventListener("change", handleDesktopChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      desktopMediaQuery.removeEventListener("change", handleDesktopChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNavigationOpen]);

  useEffect(() => {
    if (!isLoginPopoverOpen) {
      return;
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        loginPopoverRef.current &&
        !loginPopoverRef.current.contains(event.target as Node)
      ) {
        setIsLoginPopoverOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLoginPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoginPopoverOpen]);

  const handleClickLogout = async () => {
    setIsProfileMenuOpen(false);
    setIsNavigationOpen(false);
    await handleLogout();
    navigate("/login", { replace: true });
  };

  const handleClickWithdraw = async () => {
    setIsProfileMenuOpen(false);
    setIsNavigationOpen(false);

    const result = await MHModal<"cancel" | "withdraw">({
      name: "회원 탈퇴",
      title: "정말 탈퇴할까요?",
      description: "탈퇴하면 저장한 지원 정보가 모두 삭제됩니다.",
      buttons: [
        {
          label: "탈퇴하기",
          value: "withdraw",
          variant: "danger",
        },
        {
          label: "돌아가기",
          value: "cancel",
          variant: "secondary",
        },
      ],
    });

    if (result !== "withdraw") {
      return;
    }

    try {
      setIsWithdrawing(true);
      await handleWithdraw();
      toast.success("회원 탈퇴가 완료되었습니다.");
      navigate("/login", { replace: true });
    } catch {
      toast.error("회원 탈퇴에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <header className="desk:static sticky top-0 z-40 h-16 w-full shrink-0 border-border-subtle border-b desk:border-b-0 bg-background">
      <div className="flex h-full w-full items-center desk:justify-end justify-between px-4 tab:px-6">
        <Link aria-label="홈으로 이동" className="desk:hidden" to="/">
          <img alt="Moah Logo" className="size-10 object-contain" src={logo} />
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="desk:flex hidden items-center gap-2">
              <div className="relative">
                <button
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="menu"
                  aria-label="프로필 메뉴"
                  className="flex size-10 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
                  onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
                  type="button"
                >
                  <img
                    alt={`${user?.name ?? "사용자"} 프로필 이미지`}
                    className="size-10 rounded-full object-cover"
                    src={user?.profileImage ?? ""}
                  />
                </button>

                {isProfileMenuOpen && (
                  <div
                    className="absolute top-full right-0 z-50 mt-2 min-w-32 rounded-small border border-neutral10 bg-background p-1 shadow-lg"
                    role="menu"
                  >
                    <button
                      className={MENU_ITEM_CLASS}
                      disabled={isWithdrawing}
                      onClick={() => void handleClickWithdraw()}
                      role="menuitem"
                      type="button"
                    >
                      탈퇴하기
                    </button>
                    <button
                      className={MENU_ITEM_CLASS}
                      onClick={() => void handleClickLogout()}
                      role="menuitem"
                      type="button"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative" ref={loginPopoverRef}>
              <button
                aria-expanded={isLoginPopoverOpen}
                aria-haspopup="dialog"
                className={AUTH_BUTTON_CLASS}
                onClick={() => setIsLoginPopoverOpen((isOpen) => !isOpen)}
                type="button"
              >
                로그인
              </button>

              {isLoginPopoverOpen && (
                <div
                  aria-label="로그인"
                  className="absolute top-full right-0 z-50 mt-2 w-[calc(100vw-2rem)] max-w-80 rounded-medium border border-neutral10 bg-background p-6 text-center shadow-sm"
                  role="dialog"
                >
                  <p className="display14 regular leading-body">
                    채용 공고 URL 하나로 공고 정보를 불러와
                    <br />
                    지원 목록에 바로 저장하세요.
                  </p>
                  <p className="display12 medium mt-2 text-primary">
                    로그인하면 매일 10회 이용할 수 있어요!
                  </p>
                  <MHButton
                    className="mt-3"
                    isFullWidth
                    onClick={() =>
                      window.location.assign(`${API_BASE_URL}/auth/google`)
                    }
                  >
                    Google로 빠르게 로그인하기
                  </MHButton>
                </div>
              )}
            </div>
          )}

          <button
            aria-controls="navigation-drawer"
            aria-expanded={isNavigationOpen}
            aria-label="메뉴 열기"
            className="flex desk:hidden size-10 cursor-pointer items-center justify-center rounded-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            onClick={() => setIsNavigationOpen(true)}
            type="button"
          >
            <MHIcon icon="menu" size={24} />
          </button>
        </div>
      </div>

      <NavigationDrawer
        email={user?.email}
        isAuthenticated={isAuthenticated}
        isOpen={isNavigationOpen}
        isWithdrawing={isWithdrawing}
        name={user?.name ?? undefined}
        onClose={() => setIsNavigationOpen(false)}
        onLogout={() => void handleClickLogout()}
        onWithdraw={() => void handleClickWithdraw()}
        profileImage={user?.profileImage ?? undefined}
      />
    </header>
  );
};

export default Header;
