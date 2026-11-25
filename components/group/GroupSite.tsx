"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Mail,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
import PanelDeck, { type Panel } from "./PanelDeck";
import FuelAdvisor from "./FuelAdvisor";
import StationMap, { type MapPoint } from "@/components/StationMap";
import MobileMenu from "@/components/MobileMenu";
import ChatWidget from "@/components/ChatWidget";
import { companies, group, type GroupCompany } from "@/data/groupContent";
import {
  REGIONS,
  TERMINAL_STATUS,
  formatDate,
  formatPrice,
  useDemoData,
  type Region,
} from "@/lib/demoStore";

const NAV: [string, string][] = [
  ["Companies", "#companies"],
  ["Fuel finder", "#fuel-finder"],
  ["Prices", "#prices"],
  ["Stations", "#stations"],
  ["Contact", "#contact"],
];

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function OgraBadge() {
  const { ogra } = useDemoData();
  return (
    <span className="gp-ogra">
      <ShieldCheck size={14} /> Synced from OGRA submission · {ogra.ref} · {fmtTime(ogra.submittedAt)}
    </span>
  );
}

/* ── 1. Home ── */
function Home() {
  const { prices } = useDemoData();
  const [region, setRegion] = useState<Region>("Punjab");
  const p = prices[region];
  return (
    <div className="gp-home">
      <div className="gp-home-bg">
        <img src="/source-media/bfdb45a26b7ddc.jpeg" alt="" />
      </div>
      <div className="gp-wrap gp-home-grid">
        <div className="gp-home-copy">
          <p className="gp-eyebrow">FOSSIL GROUP · PAKISTAN</p>
          <h1>
            Energy,
            <br />
            <em>end to end.</em>
          </h1>
          <p className="gp-lede">{group.intro}</p>
          <div className="gp-actions">
            <a className="gp-btn" href="#fuel-finder">
              Find the right fuel for your car <ArrowRight size={18} />
            </a>
            <a className="gp-btn ghost" href="#companies">
              Our companies
            </a>
          </div>
        </div>
        <aside className="gp-ticker" aria-label="Today's fuel prices">
          <div className="gp-ticker-head">
            <span>Today&apos;s prices</span>
            <select aria-label="Region" value={region} onChange={(e) => setRegion(e.target.value as Region)}>
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="gp-ticker-row">
            <small>PMG · Petrol</small>
            <strong>{formatPrice(p.pmg)}</strong>
          </div>
          <div className="gp-ticker-row">
            <small>HSD · Diesel</small>
            <strong>{formatPrice(p.hsd)}</strong>
          </div>
          <OgraBadge />
        </aside>
      </div>
      <div className="gp-wrap gp-home-companies">
        {companies.map((c) => (
          <a key={c.id} href="#companies">
            <b>{c.short}</b>
            <span>
              {c.name}
              <small>{c.sector}</small>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── 2. Companies ── */
function CompanyModal({ company, onClose }: { company: GroupCompany; onClose: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="gp-modal" role="dialog" aria-modal="true" aria-labelledby="gp-modal-title">
      <button className="gp-modal-backdrop" type="button" aria-label="Close" onClick={onClose} />
      <div className="gp-modal-card">
        <div className={`gp-modal-media ${company.image ? "" : "no-image"}`}>
          {company.image ? <img src={company.image} alt="" /> : <b>{company.short}</b>}
          <button ref={ref} type="button" className="gp-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="gp-modal-body">
          <p className="gp-eyebrow">{company.sector}</p>
          <h3 id="gp-modal-title">{company.name}</h3>
          <p>{company.overview}</p>
          <ul>
            {company.facts.map((f) => (
              <li key={f}>
                <BadgeCheck size={15} /> {f}
              </li>
            ))}
          </ul>
          <div className="gp-actions">
            {company.internal?.map((l) => (
              <a key={l.href} className="gp-btn" href={l.href}>
                {l.label} <ArrowRight size={16} />
              </a>
            ))}
            {company.url ? (
              <a className="gp-btn ghost" href={company.url} target="_blank" rel="noopener noreferrer">
                Visit website <ArrowUpRight size={16} />
              </a>
            ) : (
              <span className="gp-btn ghost is-disabled">Website link to be added</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Companies() {
  const [open, setOpen] = useState<GroupCompany | null>(null);
  return (
    <div className="gp-wrap gp-companies">
      <div className="gp-head">
        <p className="gp-eyebrow">THE GROUP</p>
        <h2>
          Four companies. <em>One energy partner.</em>
        </h2>
      </div>
      <div className="gp-company-grid">
        {companies.map((c) => (
          <button key={c.id} type="button" className={`gp-company ${c.pending ? "pending" : ""}`} onClick={() => setOpen(c)}>
            <div className="gp-company-media">
              {c.image ? <img src={c.image} alt="" loading="lazy" /> : <b>{c.short}</b>}
            </div>
            <div className="gp-company-body">
              <small>{c.sector}</small>
              <strong>{c.name}</strong>
              <span>{c.tagline}</span>
              <i>
                View company <ArrowUpRight size={15} />
              </i>
            </div>
          </button>
        ))}
      </div>
      {open && <CompanyModal company={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

/* ── 4. Prices ── */
function Prices() {
  const { prices, pricesUpdated } = useDemoData();
  const [region, setRegion] = useState<Region>("Punjab");
  const p = prices[region];
  return (
    <div className="gp-wrap gp-prices">
      <div className="gp-head">
        <p className="gp-eyebrow">FUEL PRICES</p>
        <h2>
          Straight from <em>our OGRA submission.</em>
        </h2>
        <p className="gp-sub">
          When Fossil submits its prices to OGRA, this page updates automatically. No manual re-entry.
        </p>
      </div>
      <div className="gp-price-layout">
        <div className="gp-price-main">
          <div className="gp-tabs" role="tablist" aria-label="Region">
            {REGIONS.map((r) => (
              <button key={r} role="tab" type="button" aria-selected={region === r} onClick={() => setRegion(r)}>
                {r}
              </button>
            ))}
          </div>
          <div className="gp-price-cards">
            <div>
              <small>Optimo 92 · PMG</small>
              <strong>
                <span>Rs</span> {formatPrice(p.pmg)}
              </strong>
              <i>per litre</i>
            </div>
            <div>
              <small>Primo Diesel · HSD</small>
              <strong>
                <span>Rs</span> {formatPrice(p.hsd)}
              </strong>
              <i>per litre</i>
            </div>
          </div>
          <OgraBadge />
        </div>
        <table className="gp-price-table">
          <caption>All regions · effective {formatDate(pricesUpdated)}</caption>
          <thead>
            <tr>
              <th>Region</th>
              <th>PMG</th>
              <th>HSD</th>
            </tr>
          </thead>
          <tbody>
            {REGIONS.map((r) => (
              <tr key={r} className={r === region ? "is-current" : undefined} onClick={() => setRegion(r)}>
                <td>{r}</td>
                <td>{formatPrice(prices[r].pmg)}</td>
                <td>{formatPrice(prices[r].hsd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── 5. Stations ── */
function Stations() {
  const { stations, terminals } = useDemoData();
  const [selected, setSelected] = useState("");
  const [region, setRegion] = useState("All");
  const list = stations.filter((s) => region === "All" || s.province === region);
  const points: MapPoint[] = [
    ...list.map((s) => ({
      id: s.id,
      label: s.name,
      sub: `${s.city}, ${s.province}${s.status === "coming-soon" ? " · Coming soon" : ""}`,
      lat: s.lat,
      lng: s.lng,
      kind: "station" as const,
      muted: s.status === "coming-soon",
    })),
    ...terminals.map((t) => ({ id: `t-${t.id}`, label: `${t.name} terminal`, sub: TERMINAL_STATUS[t.status], lat: t.lat, lng: t.lng, kind: "terminal" as const })),
  ];
  const sel = list.find((s) => s.id === selected);
  return (
    <div className="gp-stations">
      <StationMap points={points} selected={selected} onSelect={(id) => !id.startsWith("t-") && setSelected(id)} className="station-map gp-map" ariaLabel="Map of Fossil stations and storage terminals" />
      <div className="gp-station-card">
        <p className="gp-eyebrow">STATIONS & TERMINALS</p>
        <h2>Find us on the map.</h2>
        <select aria-label="Region" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="All">All regions</option>
          {REGIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <div className="gp-station-chips">
          {list.map((s) => (
            <button key={s.id} type="button" aria-pressed={selected === s.id} onClick={() => setSelected(s.id)}>
              <MapPin size={13} /> {s.city}
            </button>
          ))}
        </div>
        {sel ? (
          <div className="gp-station-sel">
            <strong>{sel.name}</strong>
            <span>
              {sel.city}, {sel.province} · {sel.status === "open" ? "Open" : "Coming soon"}
            </span>
            <span>{sel.services.join(" · ")}</span>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${sel.lat},${sel.lng}`} target="_blank" rel="noopener noreferrer">
              <Navigation size={14} /> Directions
            </a>
          </div>
        ) : (
          <p className="gp-muted">
            {stations.length} stations · {terminals.length} storage sites. Tap a city to see details.
          </p>
        )}
      </div>
    </div>
  );
}

/* ── 6. Contact ── */
function Contact() {
  return (
    <div className="gp-wrap gp-contact">
      <div className="gp-head">
        <p className="gp-eyebrow">GET IN TOUCH</p>
        <h2>
          Let&apos;s power <em>what&apos;s next.</em>
        </h2>
      </div>
      <div className="gp-contact-grid">
        <a href={group.phoneHref}>
          <Phone size={20} />
          <small>Call</small>
          {group.phone}
        </a>
        <a href={`mailto:${group.email}`}>
          <Mail size={20} />
          <small>Email</small>
          {group.email}
        </a>
        <div>
          <Building2 size={20} />
          <small>Head office</small>
          {group.address}
        </div>
      </div>
      <footer className="gp-foot">
        <div className="gp-foot-links">
          {companies.map((c) =>
            c.internal ? (
              <a key={c.id} href={c.internal[0].href}>
                {c.name}
              </a>
            ) : c.url ? (
              <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer">
                {c.name} ↗
              </a>
            ) : (
              <span key={c.id}>{c.name}</span>
            ),
          )}
          <a href="/admin">Back office</a>
        </div>
        <small>© {new Date().getFullYear()} Fossil Group · Design demo</small>
      </footer>
    </div>
  );
}

function Header() {
  return (
    <header className="gp-header">
      <a href="#home" className="gp-logo" aria-label="Fossil Group home">
        <img src="/images/fossil-logo.png" alt="Fossil" width={118} height={38} />
        <span>GROUP</span>
      </a>
      <nav aria-label="Main navigation">
        {NAV.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <a className="gp-header-cta" href="#fuel-finder">
        Fuel finder
      </a>
      <MobileMenu
        links={[["Home", "#home"], ...NAV]}
        cta={{ label: "Find the right fuel", href: "#fuel-finder" }}
      />
    </header>
  );
}

export default function GroupSite() {
  const panels: Panel[] = [
    { id: "home", label: "Home", content: <Home /> },
    { id: "companies", label: "Companies", content: <Companies />, tone: "light" },
    {
      id: "fuel-finder",
      label: "Fuel finder",
      tone: "light",
      content: (
        <div className="gp-wrap gp-finder">
          <div className="gp-head">
            <p className="gp-eyebrow">FUEL & OIL FINDER</p>
            <h2>
              The right fuel <em>for your car.</em>
            </h2>
            <p className="gp-sub">Pick your make and model and we&apos;ll recommend the fuel and engine oil that suit it.</p>
          </div>
          <FuelAdvisor />
        </div>
      ),
    },
    { id: "prices", label: "Prices", content: <Prices /> },
    { id: "stations", label: "Stations", content: <Stations />, tone: "light" },
    { id: "contact", label: "Contact", content: <Contact /> },
  ];
  return (
    <>
      <PanelDeck panels={panels} header={<Header />} />
      <ChatWidget />
    </>
  );
}
