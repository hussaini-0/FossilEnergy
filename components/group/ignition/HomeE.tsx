"use client";
import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { ArrowRight, Flame } from "lucide-react";
import { businessLines, group } from "@/data/groupContent";
import { HeroWave, PriceTicker } from "../shared";

const LINES = [
  { text: "FUEL", cls: "" },
  { text: "LUBRICANTS", cls: "ig-outline" },
  { text: "& LPG", cls: "ig-fire" },
];
const RING = 2 * Math.PI * 46;
const HOLD_MS = 1300;

function Split({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span key={i} className="ig-ch">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

/** Press-and-hold: throttles Version 1's Traffic Wave, fills the ring, then "ignites" the hero. */
function IgniteButton({ onIgnite }: { onIgnite: (on: boolean) => void }) {
  const ring = useRef<SVGCircleElement>(null);
  const anim = useRef<ReturnType<typeof animate> | null>(null);
  const [lit, setLit] = useState(false);

  const wave = () => document.querySelector(".ig-wave [role='img']");
  const press = () => {
    wave()?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    anim.current?.pause();
    anim.current = animate(ring.current!, {
      strokeDashoffset: 0,
      duration: HOLD_MS,
      ease: "inQuad",
      onComplete: () => {
        setLit(true);
        onIgnite(true);
      },
    });
  };
  const release = () => {
    window.dispatchEvent(new PointerEvent("pointerup"));
    anim.current?.pause();
    anim.current = animate(ring.current!, { strokeDashoffset: RING, duration: 500, ease: "outExpo" });
    if (lit) {
      setLit(false);
      onIgnite(false);
    }
  };

  return (
    <button
      type="button"
      className={`ig-ignite ${lit ? "is-lit" : ""}`}
      data-cursor="HOLD"
      aria-label="Press and hold to ignite"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        press();
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault();
          press();
        }
      }}
      onKeyUp={(e) => (e.key === " " || e.key === "Enter") && release()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" className="ig-ring-svg">
        <circle cx="50" cy="50" r="46" className="ig-ring-track" />
        <circle ref={ring} cx="50" cy="50" r="46" className="ig-ring" strokeDasharray={RING} strokeDashoffset={RING} />
      </svg>
      <Flame size={22} />
      <span>{lit ? "Ignited" : "Hold to ignite"}</span>
    </button>
  );
}

export default function HomeE() {
  const root = useRef<HTMLDivElement>(null);
  const [ignited, setIgnited] = useState(false);

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = (s: string) => root.current!.querySelectorAll(s);
    animate(q(".ig-ch"), {
      y: ["115%", "0%"],
      rotate: [12, 0],
      opacity: [0, 1],
      delay: stagger(38, { from: "center" }),
      duration: 1300,
      ease: "outExpo",
    });
    animate(q(".ig-reveal"), { y: [30, 0], opacity: [0, 1], delay: stagger(90, { start: 650 }), duration: 1000, ease: "outExpo" });
  }, []);

  useEffect(() => {
    if (!ignited || !root.current) return;
    animate(root.current.querySelectorAll(".ig-ch"), {
      y: [0, -14, 0],
      scale: [1, 1.08, 1],
      delay: stagger(22),
      duration: 700,
      ease: "outElastic(1, .5)",
    });
  }, [ignited]);

  return (
    <div className={`gp-home gp-home-e ${ignited ? "is-ignited" : ""}`} ref={root}>
      <HeroWave className="gp-wave ig-wave" />
      <div className="ig-flash" aria-hidden="true" />
      <div className="gp-wrap ig-hero">
        <p className="gp-eyebrow ig-reveal">FOSSIL GROUP · PAKISTAN&apos;S ENERGY GROUP</p>
        <h1 className="ig-title" aria-label="Fuel, lubricants and LPG for Pakistan">
          {LINES.map((l) => (
            <span key={l.text} className={`ig-line ${l.cls}`} aria-hidden="true">
              <Split text={l.text} />
            </span>
          ))}
        </h1>
        <div className="ig-row">
          <p className="ig-lede ig-reveal">{group.intro}</p>
          <div className="ig-actions ig-reveal">
            <a className="gp-btn" href="#fuel-finder" data-cursor="GO">
              Find your fuel <ArrowRight size={18} />
            </a>
            <IgniteButton onIgnite={setIgnited} />
          </div>
          <PriceTicker className="gp-ticker ig-ticker ig-reveal" />
        </div>
      </div>
      <div className="ig-marquee" aria-hidden="true">
        <div>
          {Array.from({ length: 4 }).flatMap((_, k) =>
            businessLines.map((l) => (
              <span key={`${k}-${l.id}`}>
                {l.title} <i>{l.company}</i> <b>✦</b>
              </span>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
