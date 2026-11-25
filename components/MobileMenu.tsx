"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Phone, Mail, X } from "lucide-react";
import { company, pageHref, variants, versionName, type Variant } from "@/data/fossilContent";

type Cta = { label: string; href?: string; onClick?: () => void };
type Group = { title: string; links: { label: string; href: string; child?: boolean }[] };

/** Full-screen mobile navigation shared by both presentations. */
export default function MobileMenu({
  links,
  variant,
  cta,
  groups,
}: {
  links: [string, string][];
  variant?: Variant;
  cta?: Cta;
  /** Optional collapsible sections listed under the main links (used on detail pages). */
  groups?: Group[];
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mm-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <span>Menu</span>
        <i aria-hidden="true">
          <b />
          <b />
        </i>
      </button>
      {open &&
        createPortal(
          <div className="mm-sheet" role="dialog" aria-modal="true" aria-label="Site menu">
            <div className="mm-top">
              <img src="/images/fossil-logo.png" alt="Fossil Energy" width={118} height={38} />
              <button ref={closeRef} type="button" className="mm-close" onClick={close} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <nav className="mm-links" aria-label="Mobile navigation">
              {links.map(([label, href], i) => (
                <a key={href} href={href} onClick={close} style={{ animationDelay: `${60 + i * 45}ms` }}>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                  <span>{label}</span>
                  <ArrowUpRight size={20} />
                </a>
              ))}
            </nav>
            {groups && (
              <div className="mm-groups">
                {groups.map((g) => (
                  <details key={g.title}>
                    <summary>{g.title}</summary>
                    {g.links.map((l) => (
                      <a key={l.href} href={l.href} onClick={close} className={l.child ? "mm-child" : undefined}>
                        {l.label}
                      </a>
                    ))}
                  </details>
                ))}
              </div>
            )}
            <div className="mm-bottom">
              {cta &&
                (cta.href ? (
                  <a className="mm-cta" href={cta.href} onClick={close}>
                    {cta.label} <ArrowUpRight size={18} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="mm-cta"
                    onClick={() => {
                      close();
                      cta.onClick?.();
                    }}
                  >
                    {cta.label} <ArrowUpRight size={18} />
                  </button>
                ))}
              <div className="mm-contact">
                <a href={company.phones[0].href}>
                  <Phone size={15} /> {company.phone}
                </a>
                <a href={`mailto:${company.email}`}>
                  <Mail size={15} /> {company.email}
                </a>
              </div>
              <div className="mm-versions" role="group" aria-label="Choose version">
                <a href="/">Group</a>
                {variants.map((v) => (
                  <a key={v} href={pageHref(v)} aria-current={v === variant ? "page" : undefined}>
                    {versionName(v)}
                  </a>
                ))}
                <a href="/admin">Back office</a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
