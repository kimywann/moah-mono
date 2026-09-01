import { useEffect, useId } from "react";
import { createRoot } from "react-dom/client";
import cn from "../utils/cn";
import MHButton from "./MHButton";
import MHIcon from "./MHIcon";

type TMHModalButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface IMHModalButton<TResult> {
  label: string;
  value: TResult;
  variant?: TMHModalButtonVariant;
}

type TMHModalButtons<TResult> =
  | readonly [IMHModalButton<TResult>]
  | readonly [IMHModalButton<TResult>, IMHModalButton<TResult>];

interface IMHModalOptions<TResult> {
  buttons: TMHModalButtons<TResult>;
  description?: string;
  name?: string;
  title: string;
  width?: string;
}

interface IMHModalViewProps<TResult> extends IMHModalOptions<TResult> {
  close: (value?: TResult) => void;
}

const MHModal = <TResult,>(
  options: IMHModalOptions<TResult>,
): Promise<TResult | undefined> => {
  return new Promise<TResult | undefined>((resolve) => {
    const modalRootElement = document.createElement("div");
    modalRootElement.dataset.mhModalRoot = "true";

    const reactRoot = createRoot(modalRootElement);
    let isClosed = false;

    const close = (value?: TResult) => {
      if (isClosed) {
        return;
      }

      isClosed = true;
      reactRoot.unmount();
      modalRootElement.remove();
      resolve(value);
    };

    document.body.appendChild(modalRootElement);
    reactRoot.render(<MHModalView {...options} close={close} />);
  });
};

const MHModalView = <TResult,>(props: IMHModalViewProps<TResult>) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        props.close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.close]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <div
        aria-describedby={props.description ? descriptionId : undefined}
        aria-label={props.name}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          "no-scroll flex max-h-[calc(100vh-48px)] min-h-80 w-full flex-col overflow-y-auto rounded-medium bg-background p-8 shadow-xs",
          props.width ? "max-w-none" : "max-w-120",
          props.width,
        )}
        role="dialog"
      >
        <div className="relative flex min-h-8 items-center justify-center text-center">
          {props.name && (
            <span className="semibold display16 text-neutral40">
              {props.name}
            </span>
          )}
          <button
            aria-label={`${props.name ?? props.title} 닫기`}
            className="absolute top-0 right-0 flex size-8 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => props.close()}
            type="button"
          >
            <MHIcon icon="x" size={24} />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h2 className="bold display24" id={titleId}>
            {props.title}
          </h2>
          {props.description && (
            <p
              className="regular display14 mt-2 text-center text-muted-foreground"
              id={descriptionId}
            >
              {props.description}
            </p>
          )}
        </div>

        <div
          className={
            props.buttons.length === 1 ? "mt-8" : "mt-8 grid grid-cols-2 gap-3"
          }
        >
          {props.buttons.map((button) => (
            <MHButton
              isFullWidth
              key={button.label}
              onClick={() => props.close(button.value)}
              size="large"
              variant={button.variant}
            >
              {button.label}
            </MHButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export type {
  IMHModalButton,
  IMHModalOptions,
  TMHModalButtonVariant,
  TMHModalButtons,
};

export default MHModal;
