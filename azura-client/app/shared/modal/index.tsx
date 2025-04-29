import { cn } from "@/components/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JSX } from "react";

type Props = {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  classStyle?: string | Record<string, boolean> | undefined;
  open?: boolean;
  scrollableOverlay?: boolean;
  modalTitle?: JSX.Element | string;
  Icon?: React.ReactNode;
  onInteractOutside?: (e: unknown) => void;
  onOpenChange?: (open: boolean) => void;
};

export const Modal = ({
  children,
  trigger,
  classStyle,
  open,
  modalTitle,
  Icon,
  onInteractOutside,
  onOpenChange,
}: Props) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "fixed left-1/2 top-1/2 h-auto max-w-[90%] -translate-x-1/2 -translate-y-1/2 transform sm:max-w-[25.5rem]",
          classStyle
        )}
        onInteractOutside={onInteractOutside}
      >
        <DialogTitle
          className={`${
            !modalTitle && "hidden border-none"
          } flex items-center gap-2 border-b pb-5`}
        >
          <span>{modalTitle}</span> <span>{Icon}</span>
        </DialogTitle>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export const ModalClose = DialogClose;
