"use client";

import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";

type DeckStatus = "checking" | "available" | "unavailable";

async function checkWithGet() {
  try {
    const getResponse = await fetch("/deck.pdf", {
      method: "GET",
      cache: "no-store",
    });

    return getResponse.ok;
  } catch {
    return false;
  }
}

export default function DeckCTA() {
  const [status, setStatus] = useState<DeckStatus>("checking");

  useEffect(() => {
    let active = true;

    const setSafeStatus = (nextStatus: DeckStatus) => {
      if (active) {
        setStatus(nextStatus);
      }
    };

    const probeDeck = async () => {
      try {
        const headResponse = await fetch("/deck.pdf", {
          method: "HEAD",
          cache: "no-store",
        });

        if (headResponse.ok) {
          setSafeStatus("available");
          return;
        }

        if (headResponse.status === 403 || headResponse.status === 405) {
          const availableViaGet = await checkWithGet();
          setSafeStatus(availableViaGet ? "available" : "unavailable");
          return;
        }

        setSafeStatus("unavailable");
      } catch {
        const availableViaGet = await checkWithGet();
        setSafeStatus(availableViaGet ? "available" : "unavailable");
      }
    };

    void probeDeck();

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return <p className="text-sm muted-copy">Checking deck availability...</p>;
  }

  if (status === "available") {
    return (
      <a
        href="/deck.pdf"
        target="_blank"
        rel="noreferrer"
        download
        className={buttonClasses({ variant: "primary", size: "lg" })}
      >
        Open Sponsorship Deck
      </a>
    );
  }

  return (
    <div className="inline-flex items-center gap-3">
      <span
        className={buttonClasses({
          variant: "gold",
          size: "lg",
          className: "cursor-not-allowed opacity-70",
        })}
        aria-disabled
      >
        Deck available soon
      </span>
    </div>
  );
}
