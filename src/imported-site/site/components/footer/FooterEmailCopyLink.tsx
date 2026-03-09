"use client";

import type { MouseEvent } from "react";
import { openModal } from "@/components/modals/GlobalModalHost";
import { linkClasses } from "@/components/uiClasses";
import { CONTACT_EMAIL_ADDRESS } from "@/lib/emailCompose";
import { siteConfig } from "@/lib/siteConfig";

function buildGmailToOnlyUrl() {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: CONTACT_EMAIL_ADDRESS,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
}

export default function FooterEmailCopyLink() {
  const composeUrl = buildGmailToOnlyUrl();

  const handleEmailClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    void openModal("copyToast", {
      message: "The email has been copied to your clipboard!",
      copyText: CONTACT_EMAIL_ADDRESS,
      pendingUrl: composeUrl,
    });
  };

  return (
    <a
      className={linkClasses({
        variant: "inline",
      })}
      href={composeUrl}
      onClick={handleEmailClick}
    >
      {siteConfig.contactEmail}
    </a>
  );
}
