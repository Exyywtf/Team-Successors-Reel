"use client";

import Link from "next/link";
import Container from "@/components/layout/Container";
import FooterEmailCopyLink from "@/components/footer/FooterEmailCopyLink";
import Reveal from "@/components/Reveal";
import { linkClasses } from "@/components/uiClasses";
import { siteContent } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";

export default function Footer() {
  // Uses 'footer-obsidian-haze' for the subtle gradient + noise texture overlay
  return (
    <footer className="footer-obsidian-haze mt-14 border-t border-[var(--border)]">
      <Container className="py-12">
        <Reveal variant="fadeUp" sectionType="dense">
          <div className="grid items-start gap-8 md:grid-cols-[1.2fr,1fr,1fr]">
            <div className="flex min-w-0 flex-col gap-4">
              <p className="gold-underline font-heading text-xl">
                {siteConfig.teamName}
              </p>
              <p className="type-subtitle max-w-sm text-sm">
                Inheriting the Legacy. Defining the Future. A premium digital
                home for our F1 in Schools journey.
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <p className="type-label text-main">Navigate</p>
              <ul className="space-y-2 text-sm muted-copy">
                {siteContent.navigation.map((item) => (
                  <li key={`footer-${item.href}`}>
                    <Link
                      className={linkClasses({ variant: "footer" })}
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <p className="type-label text-main">Contact</p>
              <ul className="space-y-2 text-sm muted-copy">
                <li>
                  <FooterEmailCopyLink />
                </li>
                <li>
                  <span className="inline-flex rounded-md px-1 py-0.5">
                    {siteConfig.locationText}
                  </span>
                </li>
                <li className="flex flex-row flex-wrap items-center gap-3 text-xs uppercase tracking-[0.1em]">
                  {siteConfig.socialLinks.map((social) => (
                    <a
                      key={`footer-social-${social.label}`}
                      className={linkClasses({ variant: "footer" })}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {social.label}
                    </a>
                  ))}
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="divider-soft mt-8" aria-hidden />
        <div className="mt-6 text-center text-xs uppercase tracking-[0.12em] muted-copy">
          &copy; {new Date().getFullYear()} {siteConfig.teamName}. All rights
          reserved.
        </div>
      </Container>
    </footer>
  );
}
