"use client";
/**
 * Design E · Ignition: page-wide motion layer.
 *
 * - Custom cursor (dot + ring that grows and labels interactive elements), Motion Primitives style
 * - Film grain overlay
 * - Text "decode" scramble on headings when a panel/page comes into view (Kinetics style)
 * - anime.js count-up for prices
 * - Pointer spotlight on cards (Kokonut UI style) and magnetic buttons
 * - Lenis smooth scrolling on the long section pages
 */
import { useEffect, useRef } from "react";
import { animate } from "animejs";
import Lenis from "lenis";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";
const SPOT = ".gp-company, .gp-lines a, .gpg-card, .gpg-company-list button, .gp-price-cards > div, .gpg-price-cards > div, .gp-contact-grid > *, .gpg-channels > *, .gp-adv-form, .gp-adv-result, .gpg-steps li, .ig-tile";
const MAGNETIC = ".gp-btn, .gp-header-cta, .ig-ignite, .gp-designs a, .gpg-tabs button, .gp-tabs button";

/** Fontshare: Clash Display for headlines, Satoshi for text. */
export function IgnitionFonts() {
  return (
    <link
      rel="stylesheet"
      href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=satoshi@400,500,700&display=swap"
      precedence="default"
    />
  );
}

function textNodes(root: Element) {
  const out: Text[] = [];
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walk.nextNode()) {
    const n = walk.currentNode as Text;
    if (n.data.trim()) out.push(n);
  }
  return out;
}

/** Decode effect: characters resolve left to right from random glyphs. Safe with React: only edits existing text nodes and stops if React changes them. */
function scramble(el: Element) {
  for (const node of textNodes(el)) {
    const final = node.data;
    let written = final;
    const state = { p: 0 };
    animate(state, {
      p: 1,
      duration: 650 + final.length * 18,
      ease: "outQuad",
      onUpdate: () => {
        if (node.data !== written) return; // React re-rendered: leave it alone
        const reveal = Math.floor(state.p * final.length);
        written = final
          .split("")
          .map((ch, i) => (i < reveal || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join("");
        node.data = written;
      },
      onComplete: () => {
        if (node.data === written) node.data = final;
      },
    });
  }
}

/** anime.js count-up for numeric text nodes such as "335.06". */
function countUp(el: Element) {
  for (const node of textNodes(el)) {
    const m = node.data.match(/^(\s*)([\d,]+(?:\.\d+)?)(\s*)$/);
    if (!m) continue;
    const final = node.data;
    const target = parseFloat(m[2].replace(/,/g, ""));
    const decimals = (m[2].split(".")[1] || "").length;
    let written = final;
    const state = { v: 0 };
    animate(state, {
      v: target,
      duration: 1400,
      ease: "outExpo",
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

function ignite(root: Element) {
  root.querySelectorAll("h1, h2, .gp-eyebrow").forEach(scramble);
  root
    .querySelectorAll(".gp-price-cards strong, .gpg-price-cards strong, .gp-ticker-row strong, .ig-ticker strong")
    .forEach(countUp);
}

export default function IgnitionFX({ mode }: { mode: "deck" | "page" }) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  // Cursor, spotlight and magnetic buttons (fine pointers only).
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    document.documentElement.classList.add("ig-cursor-on");
    let x = innerWidth / 2,
      y = innerHeight / 2,
      rx = x,
      ry = y,
      raf = 0;
    let mag: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;

      const hit = t.closest?.("a, button, select, input, textarea, label, [data-cursor]") as HTMLElement | null;
      ring.current?.classList.toggle("is-hover", !!hit);
      if (label.current) label.current.textContent = hit?.dataset.cursor ?? "";
      ring.current?.classList.toggle("has-label", !!hit?.dataset.cursor);

      const spot = t.closest?.(SPOT) as HTMLElement | null;
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      const m = reduce ? null : ((t.closest?.(MAGNETIC) as HTMLElement | null) ?? null);
      if (mag && mag !== m) mag.style.transform = "";
      mag = m;
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.transform = `translate(${dx * 0.18}px, ${dy * 0.28}px)`;
      }
    };
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const onDown = () => ring.current?.classList.add("is-down");
    const onUp = () => ring.current?.classList.remove("is-down");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.classList.remove("ig-cursor-on");
      if (mag) mag.style.transform = "";
    };
  }, []);

  // Decode headings + count up prices when a panel (deck) or the page comes into view.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (mode === "page") {
      const main = document.querySelector(".gpg");
      if (main) ignite(main);
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      const lenis = new Lenis({ autoRaf: true, lerp: 0.09 });
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
        window.setTimeout(() => ignite(active), 380);
      }
    };
    check();
    const mo = new MutationObserver(check);
    document.querySelectorAll(".gp-panel").forEach((p) => mo.observe(p, { attributes: true, attributeFilter: ["class"] }));
    return () => mo.disconnect();
  }, [mode]);

  return (
    <>
      <div className="ig-grain" aria-hidden="true" />
      <div className="ig-cursor-dot" ref={dot} aria-hidden="true" />
      <div className="ig-cursor-ring" ref={ring} aria-hidden="true">
        <span ref={label} />
      </div>
    </>
  );
}
