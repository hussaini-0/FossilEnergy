"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type Panel = { id: string; label: string; content: ReactNode; tone?: "dark" | "light" };

const LOCK_MS = 850;
const IGNORE = ".leaflet-container, .chatw, .mm-sheet, input, select, textarea, [data-own-scroll]";

/** Can this element (or an ancestor up to the panel) still scroll in the given direction? */
function canScroll(target: EventTarget | null, dir: 1 | -1) {
  let el = target instanceof HTMLElement ? target : null;
  while (el && !el.classList.contains("gp-panel")) {
    const s = getComputedStyle(el).overflowY;
    if ((s === "auto" || s === "scroll") && el.scrollHeight > el.clientHeight + 1) {
      if (dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
    }
    el = el.parentElement;
  }
  return false;
}

/**
 * Full-screen panel navigation: one section per screen, no page scroll.
 * Moves with the wheel/trackpad, swipe, keyboard, the side dots or `#panel` links.
 */
export default function PanelDeck({ panels, header, className = "" }: { panels: Panel[]; header: ReactNode; className?: string }) {
  const [index, setIndex] = useState(0);
  const locked = useRef(false);
  const touch = useRef<{ y: number; target: EventTarget | null } | null>(null);
  const indexRef = useRef(0);
  indexRef.current = index;

  const go = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(panels.length - 1, i));
      if (next === indexRef.current) return;
      locked.current = true;
      window.setTimeout(() => (locked.current = false), LOCK_MS);
      setIndex(next);
      history.replaceState(null, "", next === 0 ? location.pathname : `#${panels[next].id}`);
    },
    [panels],
  );

  // Deep links (#companies) and in-page links.
  useEffect(() => {
    const fromHash = () => {
      const i = panels.findIndex((p) => `#${p.id}` === location.hash);
      if (i >= 0) setIndex(i);
    };
    fromHash();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href^='#']");
      if (!a) return;
      const i = panels.findIndex((p) => `#${p.id}` === a.getAttribute("href"));
      if (i < 0) return;
      e.preventDefault();
      go(i);
    };
    window.addEventListener("hashchange", fromHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick);
    };
  }, [panels, go]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 12 || (e.target as HTMLElement).closest?.(".chatw, .mm-sheet")) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      if (canScroll(e.target, dir)) return;
      if (!locked.current) go(indexRef.current + dir);
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest?.(IGNORE) || document.querySelector(".mm-sheet, .gp-modal")) return;
      if (e.key === " " && t.closest?.("button, a")) return;
      const map: Record<string, number> = { ArrowDown: 1, PageDown: 1, " ": 1, ArrowUp: -1, PageUp: -1 };
      if (e.key === "Home") return go(0);
      if (e.key === "End") return go(panels.length - 1);
      if (map[e.key] && !locked.current) {
        e.preventDefault();
        go(indexRef.current + map[e.key]);
      }
    };
    const onStart = (e: TouchEvent) => {
      touch.current = (e.target as HTMLElement).closest?.(IGNORE) ? null : { y: e.touches[0].clientY, target: e.target };
    };
    const onEnd = (e: TouchEvent) => {
      const t = touch.current;
      touch.current = null;
      if (!t) return;
      const dy = t.y - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 50) return;
      const dir = dy > 0 ? 1 : -1;
      if (!canScroll(t.target, dir)) go(indexRef.current + dir);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [go, panels.length]);

  const tone = panels[index].tone ?? "dark";

  return (
    <div className={`gp-deck tone-${tone} ${className}`}>
      {header}
      <div className="gp-track" style={{ transform: `translate3d(0, ${-index * 100}%, 0)` }}>
        {panels.map((p, i) => (
          <section
            key={p.id}
            className={`gp-panel tone-${p.tone ?? "dark"} ${i === index ? "is-active" : ""}`}
            aria-label={p.label}
            aria-hidden={i !== index}
            inert={i !== index}
          >
            {p.content}
          </section>
        ))}
      </div>

      <nav className="gp-dots" aria-label="Sections">
        {panels.map((p, i) => (
          <button key={p.id} type="button" aria-current={i === index ? "step" : undefined} onClick={() => go(i)}>
            <span>{p.label}</span>
          </button>
        ))}
      </nav>
      <div className="gp-pager">
        <span>
          {String(index + 1).padStart(2, "0")} <i>/ {String(panels.length).padStart(2, "0")}</i>
        </span>
        <button type="button" aria-label="Previous section" disabled={index === 0} onClick={() => go(index - 1)}>
          <ChevronUp size={18} />
        </button>
        <button type="button" aria-label="Next section" disabled={index === panels.length - 1} onClick={() => go(index + 1)}>
          <ChevronDown size={18} />
        </button>
      </div>
    </div>
  );
}
