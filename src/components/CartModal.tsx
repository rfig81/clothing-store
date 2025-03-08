import { useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

import Cart from "./Cart";

interface CartModalProps {
  ref: React.ForwardedRef<{ open: () => void }>;
  title: string;
  actions: React.ReactNode;
}

const CartModal = ({ ref, title, actions }: CartModalProps) => {
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialog.current?.showModal(),
  }));

  return createPortal(
    <dialog id="modal" ref={dialog}>
      <h2>{title}</h2>
      <Cart />
      <form method="dialog" id="modal-actions">
        {actions}
      </form>
    </dialog>,
    document.getElementById("modal") as HTMLElement
  );
};

export default CartModal;
