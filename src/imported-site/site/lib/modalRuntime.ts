const MODAL_ACTIVE_CLASS = "modal-active";
export const GLOBAL_MODAL_STATE_EVENT = "successors:global-modal-state";

export interface GlobalModalStateDetail {
  open: boolean;
}

export function readGlobalModalOpenState(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains(MODAL_ACTIVE_CLASS);
}

export function setGlobalModalOpenState(open: boolean) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  document.documentElement.classList.toggle(MODAL_ACTIVE_CLASS, open);
  document.body.classList.toggle(MODAL_ACTIVE_CLASS, open);

  window.dispatchEvent(
    new CustomEvent<GlobalModalStateDetail>(GLOBAL_MODAL_STATE_EVENT, {
      detail: { open },
    }),
  );
}
