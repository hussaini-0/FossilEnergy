"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { company, pageHref } from "@/data/fossilContent";
import Magnet from "./ReactBitsMagnet";
import QuickLinksRail from "./QuickLinksRail";
import MobileMenu from "./MobileMenu";
import { REGIONS, type Region, formatDate, formatPrice, useDemoData } from "@/lib/demoStore";

const values = ["We Strive", "Customer Focus", "Integrity", "Operational Excellence", "Team Building", "We Care"];
function Pipeline() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 40%"] });
  const height = useSpring(scrollYProgress, { stiffness: 100, damping: 24 });
  const nodes = [
    { number: "01", title: "Regulatory & compliance", text: "OGRA licensing, corporate governance, and health, safety and environment form the foundation of operations.", href: pageHref("2d", "government-licenses"), link: "Explore licenses" },
    { number: "02", title: "Enterprise IT backbone", text: "The company reports SAP implementation with EY Ford Rhodes across its head office and locations in Pakistan.", href: pageHref("2d", "our-it"), link: "Explore IT" },
    { number: "03", title: "Strategic infrastructure", text: "Mehmodkot and Gatti are listed as operational storage terminals, supporting fuel movement across the region.", href: pageHref("2d", "oil-storages"), link: "Explore storage" },
  ];
  return <section className="lp-section lp-pipeline-section" id="governance" ref={ref}>
    <div className="lp-section-intro"><span className="lp-kicker">01 / THE BACKBONE</span><h2>An infrastructure<br /><em>that moves.</em></h2><p>Three connected systems keep energy moving from source to society.</p></div>
    <div className="lp-pipeline-layout"><div className="lp-spine"><motion.div className="lp-spine-progress" style={{ scaleY: reduce ? 1 : height }} /></div>
      <div className="lp-pipeline-nodes">{nodes.map((node) => <article className="lp-node" key={node.number}><span className="lp-node-index">{node.number} / SYSTEM</span><div><h3>{node.title}</h3><p>{node.text}</p><a href={node.href}>{node.link}<ArrowUpRight size={16} /></a></div></article>)}</div>
    </div>
  </section>;
}

const ecosystemCards = [
  {
    number: "01",
    label: "BULK STORAGE",
    title: "Fuel storage terminals",
    text: "Mehmodkot and Gatti are listed as operational terminals in Fossil's storage portfolio.",
    image: "/source-media/f8fb1d46c9c1d1.jpg",
    alt: "Fuel storage tanks at a Fossil Energy terminal",
    href: pageHref("2d", "oil-storages"),
    link: "Explore storage",
  },
  {
    number: "02",
    label: "RETAIL NETWORK",
    title: "Fuel retail stations",
    text: "See Fossil's retail sales strategy and its published station formats.",
    image: "/source-media/6426128e1eeaca.jpg",
    alt: "Fossil Energy fuel station and forecourt",
    href: pageHref("2d", "retail-sales-strategy"),
    link: "Explore retail",
  },
  {
    number: "03",
    label: "QUICK GASES / LPG",
    title: "Residential & commercial LPG",
    text: "Quick Gases presents LPG solutions for homes and businesses.",
    image: "/source-media/bdf492467f8bec.jpg",
    alt: "Gas burner in use, representing residential LPG",
    href: pageHref("2d", "lpg-residential"),
    link: "Explore LPG",
  },
  {
    number: "04",
    label: "CLOVER LUBRICANTS",
    title: "Clover lubricants",
    text: "Explore the Clover range of automotive and industrial lubricants.",
    image: "/source-media/dcfdf023a55900.png",
    alt: "Clover Optimo Gold engine oil container",
    href: pageHref("2d", "lubricants"),
    link: "Explore lubricants",
  },
];

function Ecosystem() {
  const { terminals } = useDemoData();
  const live = terminals.filter((t) => t.status === "operational").map((t) => t.name);
  const storageText = live.length
    ? `${live.join(" and ").replace(/ and (?=.* and )/g, ", ")} ${live.length === 1 ? "is" : "are"} operational, with ${terminals.length - live.length} more sites in the storage portfolio.`
    : "Storage sites are being prepared.";
  return <section className="lp-section lp-ecosystem" id="ecosystem">
    <div className="lp-section-intro"><span className="lp-kicker">02 / THE ECOSYSTEM</span><h2>What Fossil<br /><em>does.</em></h2><p>Retail fuel, oil storage, LPG and lubricants. Explore each part of the business.</p></div>
    <div className="lp-bento">
      {ecosystemCards.map((c) => c.number === "01" ? { ...c, text: storageText } : c).map((card) => <article className="lp-card lp-story-card" key={card.number}>
        <div className={`lp-story-media lp-story-media-${card.number}`}><img src={card.image} alt={card.alt} loading="lazy" /></div>
        <div className="lp-story-content">
          <span className="lp-story-eyebrow"><b>{card.number}</b> / {card.label}</span>
          <h3>{card.title}</h3>
          <p>{card.text}</p>
          <a href={card.href}>{card.link}<ArrowUpRight size={17} /></a>
        </div>
      </article>)}
    </div>
  </section>;
}
function Horizon() {
  return <section className="lp-section lp-horizon" id="vision">
    <div className="lp-section-intro"><span className="lp-kicker">03 / OUR DIRECTION</span><h2>What we are<br /><em>working toward.</em></h2><p>Fossil Energy's stated vision and mission, in the company's own terms.</p></div>
    <div className="lp-purpose-layout">
      <figure className="lp-purpose-image"><img src="/source-media/de9a76ff27c4c2.jpg" alt="Fuel storage tanks and stairways at a Fossil Energy terminal" loading="lazy" /><figcaption>FOSSIL ENERGY / STORAGE INFRASTRUCTURE</figcaption></figure>
      <div className="lp-purpose-copy">
        <div className="lp-purpose-block"><span>OUR VISION</span><h3>Energy security and long-term value.</h3><p>{company.vision}</p></div>
        <div className="lp-purpose-block"><span>OUR MISSION</span><p>{company.mission}</p></div>
        <a href={pageHref("2d", "company-overview")}>Read the company overview <ArrowUpRight size={17} /></a>
      </div>
    </div>
  </section>;
}

function PartnerDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [track, setTrack] = useState("Dealership");
  const [layout, setLayout] = useState("Fuel station");
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = [...drawerRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input:not([disabled])")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = previousOverflow; };
  }, [open, onClose]);
  if (!open) return null;
  const layouts = [
    { label: "Fuel station", href: pageHref("2d", "fossil-fuel-station-layout"), modules: 4 },
    { label: "Small station", href: pageHref("2d", "small-station-layout"), modules: 2 },
    { label: "Agri station", href: pageHref("2d", "fuel-station-agri-layout"), modules: 3 },
  ];
  const modules = layouts.find((l) => l.label === layout)?.modules ?? 4;
  return <div className="lp-drawer-layer"><button className="lp-drawer-backdrop" type="button" aria-label="Close partner panel" onClick={onClose} /><aside ref={drawerRef} className="lp-drawer" role="dialog" aria-modal="true" aria-labelledby="lp-drawer-title"><div className="lp-drawer-head"><span>FOSSIL / PARTNERSHIPS</span><button ref={closeRef} type="button" onClick={onClose} aria-label="Close"><X size={22} /></button></div><h2 id="lp-drawer-title">Build the next<br />connection.</h2><p>Explore a partnership track and station layout. Contact the team to begin an application.</p><span className="lp-form-label">APPLICATION TRACK</span><div className="lp-track-tabs">{["Partnership", "Dealership", "Franchise"].map((t) => <button type="button" key={t} aria-pressed={track === t} onClick={() => setTrack(t)}>{t}</button>)}</div><span className="lp-form-label">SITE TYPOLOGY</span><div className="lp-layout-tabs">{layouts.map((item) => <button type="button" key={item.label} aria-pressed={layout === item.label} onClick={() => setLayout(item.label)}>{item.label}</button>)}</div><div className="lp-blueprint" aria-label={`${layout} illustrative site plan`}><span>ILLUSTRATIVE SITE PLAN / {layout.toUpperCase()}</span><div className="lp-blueprint-drive"><div className="lp-blueprint-canopy">{Array.from({ length: modules }, (_, i) => <i key={i} />)}</div><div className="lp-blueprint-office" /></div><small>ENTRY → CANOPY → SERVICE → EXIT</small></div><a className="lp-layout-link" href={layouts.find((l) => l.label === layout)?.href}>View published {layout.toLowerCase()} layout <ArrowUpRight size={16} /></a><div className="lp-application-note">Application intake is not connected in this preview. Please contact Fossil Energy directly; do not enter identity numbers here.</div><a className="lp-drawer-cta" href={pageHref("2d", "contact-us")}>Contact the partnership team <ArrowRight size={17} /></a></aside></div>;
}

function Tariff() {
  const { prices, pricesUpdated } = useDemoData();
  const [region, setRegion] = useState<Region>("Punjab");
  const p = prices[region];
  return <div className="lp-tariff"><span>FUEL PRICE SNAPSHOT</span><label className="lp-tariff-region"><span className="sr-only">Region</span><select value={region} onChange={(e) => setRegion(e.target.value as Region)}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></label><strong>PMG {formatPrice(p.pmg)}</strong><i /> <strong>HSD {formatPrice(p.hsd)}</strong><small>PKR/L · {formatDate(pricesUpdated).toUpperCase()}</small></div>;
}

export default function LiquidPrecision() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return <div className="lp-page">
    <header className="lp-header"><a href={pageHref("2d")} aria-label="Fossil Energy home"><img src="/images/fossil-logo.png" width="250" height="81" alt="Fossil — your energy partner" /></a><nav aria-label="Main navigation"><a href="#governance">Governance & IT</a><a href="#ecosystem">Ecosystem</a><a href="#vision">Vision</a><a href="#stations">Stations</a><a href="#explore">Information</a></nav><button type="button" onClick={() => setDrawerOpen(true)}>Become a partner <ArrowUpRight size={16} /></button><MobileMenu links={[["Governance & IT", "#governance"], ["Ecosystem", "#ecosystem"], ["Vision", "#vision"], ["Stations", "#stations"], ["Information", "#explore"], ["Contact us", pageHref("2d", "contact-us")]]} variant="2d" cta={{ label: "Become a partner", onClick: () => setDrawerOpen(true) }} /></header>
    <QuickLinksRail variant="2d" />
    <main id="main"><section className="lp-hero"><div className="lp-hero-image"><img src="/source-media/bfdb45a26b7ddc.jpeg" width="1350" height="354" alt="Fossil fuel station illuminated at night" fetchPriority="high" /></div><div className="lp-hero-copy"><span className="lp-kicker">RELIABLE ENERGY. NATIONAL REACH.</span><h1>Fossil<br />Energy</h1><p>{company.description}</p><Magnet padding={70} magnetStrength={7} maxOffset={12} wrapperClassName="lp-magnet"><a href="#ecosystem" className="lp-hero-cta">Explore our business <ArrowRight size={18} /></a></Magnet></div></section><div className="lp-value-strip" aria-label="Core values"><span>OUR CORE VALUES</span><div className="lp-value-window"><div>{[...values, ...values].map((v, i) => <span key={`${v}-${i}`}>{v}<b>✦</b></span>)}</div></div></div><Pipeline /><Ecosystem /><Horizon /></main>
    <Tariff />
    <PartnerDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
  </div>;
}
