"use client";

import { useState, type CSSProperties } from "react";
import { BadgeCheck, ChevronRight, ClipboardCheck, Droplets, FileText, Flame, Fuel, Menu, Route, ShieldCheck, Warehouse, X } from "lucide-react";
import { pageHref, type Variant } from "@/data/fossilContent";

/** Entries reference page slugs from data/siteContent.ts; URLs are built per variant. */
const quickLinks = [
  {
    label: "Corporate Governance", icon: ShieldCheck,
    links: [
      ["The Pillars of FEPL Operations", "the-pillars-of-fepl-operations"],
      ["Compliance & Risk Management", "compliance-risk-management"],
      ["Corporate Governance Framework", "corporate-governance-framework"],
      ["Board of Directors", "board-of-directors"],
      ["Health, Safety & Environment", "health-safety-environment"],
    ],
  },
  {
    label: "Retail Strategy", icon: Route,
    links: [
      ["Introduction", "retail-sales-strategy"],
      ["Fossil Fuel Station Layout", "fossil-fuel-station-layout"],
      ["Small Station Layout", "small-station-layout"],
      ["Fuel Station Agri Layout", "fuel-station-agri-layout"],
    ],
  },
  {
    label: "Storage", icon: Warehouse,
    links: [
      ["Oil Storages", "oil-storages"],
      ["Gatti Terminal", "storage-gatti"],
      ["Mehmoodkot Terminal", "storage-mehmoodkot"],
    ],
  },
  {
    label: "Quick Gases", icon: Flame,
    links: [
      ["Commercial LPG", "lpg-commercial"],
      ["Residential LPG", "lpg-residential"],
    ],
  },
  { label: "Training & Compliance", icon: ClipboardCheck, href: "training-compliances" },
  { label: "Product Specs & Pricing", icon: Fuel, href: "fuel-price" },
  {
    label: "Lubricants", icon: Droplets,
    links: [
      ["Clover Lubricants", "lubricants"],
      ["RTX Lubricants", "rtx-lubricants"],
    ],
  },
  { label: "Government Licenses", icon: BadgeCheck, href: "government-licenses" },
  { label: "OGRA CRS", icon: FileText, href: "ogra-crs" },
] as const;

export default function QuickLinksRail({ variant }: { variant: Variant }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const selected = active === null ? null : quickLinks[active];
  const destination = (slug: string) => pageHref(variant, slug);

  return <aside className="lp-quickrail" data-open={open} aria-label="Fossil Energy quick links"
    onMouseLeave={() => { setActive(null); setOpen(false); }}
    onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) { setActive(null); setOpen(false); } }}>
    <button className="lp-quickrail-toggle" type="button" aria-expanded={open} aria-label={open ? "Close quick links" : "Open quick links"}
      onClick={() => { setOpen((value) => !value); setActive(null); }}>
      {open ? <X size={19} /> : <Menu size={19} />}<span>EXPLORE FOSSIL</span>
    </button>
    <nav className="lp-quickrail-list" aria-label="Business and information links">
      {quickLinks.map((item, index) => {
        const Icon = item.icon;
        const inner = <><Icon size={19} strokeWidth={1.8} aria-hidden="true" /><span>{item.label}</span>{"links" in item && <ChevronRight className="lp-quickrail-chevron" size={15} aria-hidden="true" />}</>;
        return "links" in item
          ? <button key={item.label} className="lp-quickrail-item" type="button" aria-label={item.label} aria-expanded={active === index}
              onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => { setOpen(true); setActive(index); }}>{inner}</button>
          : <a key={item.label} className="lp-quickrail-item" href={destination(item.href)} aria-label={item.label}
              onMouseEnter={() => setActive(null)} onFocus={() => setActive(null)}>{inner}</a>;
      })}
    </nav>
    {selected && "links" in selected && <div className="lp-quickrail-panel" aria-label={`${selected.label} pages`}
      style={{ "--quickrail-top": `${51 + (active ?? 0) * 47}px`, "--quickrail-height": `${54 + selected.links.length * 49}px` } as CSSProperties}>
      <span className="lp-quickrail-panel-title">{selected.label}</span>
      {selected.links.map(([label, href]) => <a key={href} href={destination(href)}>{label}<ChevronRight size={14} aria-hidden="true" /></a>)}
    </div>}
  </aside>;
}
