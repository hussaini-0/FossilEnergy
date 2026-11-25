"use client";
import { useState } from "react";
import { Droplets, Flame, Fuel, ShieldCheck, Warehouse } from "lucide-react";
import { REGIONS, formatPrice, useDemoData, type Region } from "@/lib/demoStore";

export { DESIGNS, designHref, type Design } from "@/data/designs";

export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export const LINE_ICONS = { fuel: Fuel, storage: Warehouse, lubricants: Droplets, lpg: Flame } as const;

export function OgraBadge() {
  const { ogra } = useDemoData();
  return (
    <span className="gp-ogra">
      <ShieldCheck size={14} /> Synced from OGRA submission · {ogra.ref} · {fmtTime(ogra.submittedAt)}
    </span>
  );
}

/** Today's PMG/HSD for a chosen region, with the OGRA sync badge. */
export function PriceTicker({ className = "gp-ticker", badge = true }: { className?: string; badge?: boolean }) {
  const { prices } = useDemoData();
  const [region, setRegion] = useState<Region>("Punjab");
  const p = prices[region];
  return (
    <aside className={className} aria-label="Today's fuel prices">
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
      {badge && <OgraBadge />}
    </aside>
  );
}
