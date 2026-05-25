import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { cn } from "@shared/lib/utils";

const sizeClassName = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  full: "sm:max-w-[min(100vw-2rem,120rem)]",
} as const;

export type ModalSize = keyof typeof sizeClassName;

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  /** Accessible title when `title` is omitted (recommended if using a fully custom header). */
  ariaLabel?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  contentClassName?: string;
  bodyClassName?: string;
};

export function Modal({
  open,
  onOpenChange,
  children,
  title,
  description,
  footer,
  ariaLabel = "Dialog",
  size = "lg",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  contentClassName,
  bodyClassName,
}: ModalProps) {
  const hasVisibleTitle =
    title !== undefined && title !== null && title !== false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        onPointerDownOutside={(e) => {
          if (!closeOnOverlayClick) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!closeOnEscape) e.preventDefault();
        }}
        className={cn(
          "flex max-h-[min(90vh,900px)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-xl duration-200",
          sizeClassName[size],
          contentClassName
        )}
      >
        <div
          className={cn(
            "flex flex-1 flex-col overflow-y-auto p-6 sm:p-8",
            bodyClassName
          )}
        >
          {hasVisibleTitle ? (
            <DialogHeader className="gap-3 space-y-0 pr-8 text-left sm:pr-10">
              <DialogTitle className="text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription className="text-left text-base text-muted-foreground">
                  {description}
                </DialogDescription>
              ) : (
                <DialogDescription className="sr-only">
                  {ariaLabel}
                </DialogDescription>
              )}
            </DialogHeader>
          ) : (
            <>
              <DialogTitle className="sr-only">{ariaLabel}</DialogTitle>
              <DialogDescription className="sr-only">{ariaLabel}</DialogDescription>
            </>
          )}

          {hasVisibleTitle ? (
            <div className="mt-6">{children}</div>
          ) : (
            children
          )}
        </div>

        {footer ? (
          <DialogFooter className="border-border bg-muted/30 gap-3 border-t p-4 sm:p-6 sm:justify-end">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
