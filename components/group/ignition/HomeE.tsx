"use client";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { ArrowRight } from "lucide-react";
import { businessLines, group } from "@/data/groupContent";
import { HeroWave, PriceTicker } from "../shared";

const HEADLINE = ["Fuel,", "lubricants", "&", "LPG"];

/** Design E home: Version 1's Traffic Wave, a calm word-by-word headline, prices, and the business lines. */
export default function HomeE() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = (s: string) => root.current!.querySelectorAll(s);
    animate(q(".ig-word"), { y: ["0.5em", "0em"], opacity: [0, 1], delay: stagger(80, { start: 150 }), duration: 900, ease: "outCubic" });
    animate(q(".ig-reveal"), { y: [16, 0], opacity: [0, 1], delay: stagger(90, { start: 500 }), duration: 900, ease: "outCubic" });
  }, []);

  return (
    <div className="gp-home gp-home-e" ref={root}>
      <HeroWave className="gp-wave ig-wave" />
      <div className="gp-wrap ig-hero">
        <div className="ig-copy">
          <p className="gp-eyebrow ig-reveal">Fossil Group · Pakistan</p>
          <h1 className="ig-title">
            {HEADLINE.map((w) => (
              <span key={w} className="ig-word">
                {w}
              </span>
            ))}{" "}
            <em className="ig-word">for Pakistan.</em>
          </h1>
          <p className="ig-lede ig-reveal">{group.intro}</p>
          <div className="ig-actions ig-reveal">
            <a className="gp-btn" href="#fuel-finder">
              Find the right fuel <ArrowRight size={17} />
            </a>
            <a className="gp-btn ghost" href="#companies">
              Our companies
            </a>
          </div>
        </div>
        <PriceTicker className="gp-ticker ig-ticker ig-reveal" />
      </div>
      <div className="ig-marquee" aria-label="What we do">
        <div>
          {[0, 1].map((k) => (
            <ul key={k} aria-hidden={k === 1}>
              {[...businessLines, ...businessLines].map((l, i) => (
                <li key={`${l.id}-${i}`}>
                  {l.title} <i>{l.company}</i>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
