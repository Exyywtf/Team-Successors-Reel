"use client";

interface CopyToastPayload {
  message: string;
  copyText: string;
  pendingUrl: string;
  onBeforeOpen?: () => void;
  onCloseComplete?: () => void;
}

interface DetailPayload {
  badgeText: string;
  title: string;
  body: string;
  ariaLabel: string;
  closeButtonAriaLabel: string;
  listItems?: string[];
  listItemKeyPrefix?: string;
}

interface ModalPayloadMap {
  teamBio: DetailPayload;
  sponsorDetail: DetailPayload;
  copyToast: CopyToastPayload;
}

export async function openModal<T extends keyof ModalPayloadMap>(
  type: T,
  payload: ModalPayloadMap[T],
) {
  void type;
  void payload;
  return;
}

export default function GlobalModalHost() {
  return null;
}
