import MHModal from "@moah/ui/components/MHModal";
import { toast } from "@moah/ui/components/MHToaster";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

const AUTH_BUTTON_CLASS =
  "medium semibold inline-flex h-11 items-center justify-center whitespace-nowrap rounded-tiny bg-primary px-4 text-white leading-body transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2";
const MENU_ITEM_CLASS =
  "display14 regular flex w-full cursor-pointer rounded-tiny px-3 py-2 text-left text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50";

const Header = () => {
  const { isAuthenticated, user, handleLogout, handleWithdraw } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleClickLogout = async () => {
    setIsProfileMenuOpen(false);
    await handleLogout();
    navigate("/login", { replace: true });
  };

  const handleClickWithdraw = async () => {
    setIsProfileMenuOpen(false);

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
    <header className="h-16 w-full shrink-0">
      <div className="flex h-full w-full items-center px-6">
        {isAuthenticated ? (
          <div className="ml-auto flex items-center gap-2">
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
          <Link className={`ml-auto ${AUTH_BUTTON_CLASS}`} to="/login">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
