"use client";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { businessLines, group } from "@/data/groupContent";
import { LINE_ICONS, OgraBadge, PriceTicker } from "./shared";

const LINE_IMAGES = {
  fuel: "/source-media/6426128e1eeaca.jpg",
  storage: "/source-media/f8fb1d46c9c1d1.jpg",
  lubricants: "/source-media/dcfdf023a55900.png",
  lpg: "/source-media/bdf492467f8bec.jpg",
} as const;

/* B · Daylight: light editorial split, serif headline, numbered business list. */
export function HomeB() {
  return (
    <div className="gp-home gp-home-b">
      <div className="gp-wrap hb-grid">
        <div className="hb-copy">
          <p className="gp-eyebrow">FOSSIL GROUP · OIL & GAS · PAKISTAN</p>
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
        </div>
        <figure className="hb-photo">
          <img src="/source-media/bfdb45a26b7ddc.jpeg" alt="Fossil fuel station at night" />
          <PriceTicker className="gp-ticker hb-ticker" />
        </figure>
      </div>
      <ol className="gp-wrap hb-lines" aria-label="What we do">
        {businessLines.map((l, i) => (
          <li key={l.id}>
            <a href={l.href}>
              <span className="hb-num">{String(i + 1).padStart(2, "0")}</span>
              <strong>{l.title}</strong>
              <small>{l.text}</small>
              <i>{l.company}</i>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* C · Signal: full brand-red screen, stacked headline, white business cards. */
export function HomeC() {
  return (
    <div className="gp-home gp-home-c">
      <div className="gp-wrap hc-top">
        <div>
          <p className="gp-eyebrow">FOSSIL GROUP · PAKISTAN</p>
          <h1>
            Fuel.
            <br />
            Lubricants.
            <br />
            LPG.
          </h1>
        </div>
        <div className="hc-side">
          <p className="gp-lede">{group.intro}</p>
          <div className="gp-actions">
            <a className="gp-btn" href="#fuel-finder">
              Find the right fuel <ArrowRight size={18} />
            </a>
            <a className="gp-btn ghost" href="#prices">
              Today&apos;s prices
            </a>
          </div>
        </div>
      </div>
      <ul className="gp-wrap hc-lines" aria-label="What we do">
        {businessLines.map((l) => {
          const Icon = LINE_ICONS[l.id];
          return (
            <li key={l.id}>
              <a href={l.href}>
                <Icon size={22} />
                <strong>{l.title}</strong>
                <small>{l.text}</small>
                <i>
                  {l.company} <ArrowUpRight size={13} />
                </i>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* D · Mosaic: the four businesses fill the screen as photos; the message sits in a centre card. */
export function HomeD() {
  return (
    <div className="gp-home gp-home-d">
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
