"use client";
/**
 * Design E · Ignition: a restrained motion layer.
 *
 * - Soft pointer spotlight on cards
 * - anime.js count-up for prices when a panel or page comes into view
 * - Lenis smooth scrolling on the longer section pages
 */
import { useEffect } from "react";
import { animate } from "animejs";
import Lenis from "lenis";

const SPOT = ".gp-company, .gpg-card, .gpg-company-list button, .gp-price-cards > div, .gpg-price-cards > div, .gp-contact-grid > *, .gpg-channels > *, .gp-adv-form, .gp-adv-result, .gpg-steps li";

/** Fontshare: Clash Display for headlines, Satoshi for text. */
export function IgnitionFonts() {
  return (
    <link
      rel="stylesheet"
      href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600&f[]=satoshi@400,500,700&display=swap"
      precedence="default"
    />
  );
}

/** Count numeric text nodes such as "335.06" up from zero. Only edits existing text nodes and stops if React changes them. */
function countUp(el: Element) {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walk.nextNode()) {
    const node = walk.currentNode as Text;
    const m = node.data.match(/^(\s*)([\d,]+(?:\.\d+)?)(\s*)$/);
    if (!m) continue;
    const final = node.data;
    const target = parseFloat(m[2].replace(/,/g, ""));
    const decimals = (m[2].split(".")[1] || "").length;
    let written = final;
    const state = { v: target * 0.9 };
    animate(state, {
      v: target,
      duration: 1100,
      ease: "outCubic",
      onUpdate: () => {
        if (node.data !== written) return;
        written = `${m[1]}${state.v.toFixed(decimals)}${m[3]}`;
        node.data = written;
      },
      onComplete: () => {
        if (node.data === written) node.data = final;
      },
    });
  }
}

const countPrices = (root: Element) =>
  root.querySelectorAll(".gp-price-cards strong, .gpg-price-cards strong, .gp-ticker-row strong").forEach(countUp);

export default function IgnitionFX({ mode }: { mode: "deck" | "page" }) {
  // Spotlight follows the pointer inside cards.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const spot = (e.target as HTMLElement).closest?.(SPOT) as HTMLElement | null;
      if (!spot) return;
      const r = spot.getBoundingClientRect();
      spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
      spot.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (mode === "page") {
      const main = document.querySelector(".gpg");
      if (main) countPrices(main);
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      const lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
      return () => {
        lenis.destroy();
        html.style.scrollBehavior = prev;
      };
    }
    let last: Element | null = null;
    const check = () => {
      const active = document.querySelector(".gp-panel.is-active");
      if (active && active !== last) {
        last = active;
        window.setTimeout(() => countPrices(active), 350);
      }
    };
    check();
    const mo = new MutationObserver(check);
    document.querySelectorAll(".gp-panel").forEach((p) => mo.observe(p, { attributes: true, attributeFilter: ["class"] }));
    return () => mo.disconnect();
  }, [mode]);

  return null;
}
