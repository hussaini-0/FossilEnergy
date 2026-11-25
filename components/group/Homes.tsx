"use client";
import { ArrowRight } from "lucide-react";
import { businessLines, group } from "@/data/groupContent";
import { HeroWave, LINE_ICONS, OgraBadge } from "./shared";

const LINE_IMAGES = {
  fuel: "/source-media/6426128e1eeaca.jpg",
  storage: "/source-media/f8fb1d46c9c1d1.jpg",
  lubricants: "/source-media/dcfdf023a55900.png",
  lpg: "/source-media/bdf492467f8bec.jpg",
} as const;

/* D · Mosaic: the four businesses fill the screen as photos; the message sits in a centre card. */
export function HomeD() {
  return (
    <div className="gp-home gp-home-d">
      <HeroWave />
      <ul className="hd-mosaic" aria-label="What we do">
        {businessLines.map((l) => {
          const Icon = LINE_ICONS[l.id];
          return (
            <li key={l.id} className={`hd-tile hd-${l.id}`}>
              <a href={l.href}>
                <img src={LINE_IMAGES[l.id]} alt="" />
                <span className="hd-label">
                  <Icon size={18} />
                  <span>
                    <strong>{l.title}</strong>
                    <small>{l.company}</small>
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <div className="hd-card">
        <p className="gp-eyebrow">FOSSIL GROUP · PAKISTAN</p>
        <h1>
          Fuel, lubricants &amp; LPG <em>for Pakistan.</em>
        </h1>
        <p className="gp-lede">{group.intro}</p>
        <div className="gp-actions">
          <a className="gp-btn" href="#fuel-finder">
            Find the right fuel <ArrowRight size={18} />
          </a>
          <a className="gp-btn ghost" href="#companies">
            Our companies
          </a>
        </div>
        <OgraBadge />
      </div>
    </div>
  );
}
