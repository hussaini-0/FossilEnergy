"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Fuel,
  LayoutDashboard,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Warehouse,
  Check,
  Search,
  Activity as ActivityIcon,
} from "lucide-react";
import StationMap, { type MapPoint } from "@/components/StationMap";
import {
  REGIONS,
  SERVICES,
  TERMINAL_STATUS,
  formatDate,
  formatPrice,
  newId,
  resetDemo,
  updateDemo,
  useDemoData,
  type Region,
  type Station,
  type Terminal,
  type TerminalStatus,
} from "@/lib/demoStore";

type Tab = "overview" | "stations" | "prices" | "storage";
const TABS: { id: Tab; label: string; icon: typeof Fuel }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "stations", label: "Stations", icon: MapPin },
  { id: "prices", label: "Fuel prices", icon: Fuel },
  { id: "storage", label: "Storage", icon: Warehouse },
];

function useToast() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(() => setMsg(""), 2600);
    return () => window.clearTimeout(t);
  }, [msg]);
  return [msg, setMsg] as const;
}

export default function BackOffice() {
  const [tab, setTab] = useState<Tab>("overview");
  const [toast, setToast] = useToast();

  useEffect(() => {
    const fromHash = window.location.hash.slice(1) as Tab;
    if (TABS.some((t) => t.id === fromHash)) setTab(fromHash);
  }, []);
  const go = (t: Tab) => {
    setTab(t);
    history.replaceState(null, "", `#${t}`);
  };

  return (
    <div className="bo">
      <aside className="bo-side">
        <a className="bo-brand" href="/admin">
          <img src="/images/fossil-logo.png" alt="Fossil Energy" width={112} height={36} />
          <span>Back office</span>
        </a>
        <nav aria-label="Back office sections">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" aria-current={tab === id ? "page" : undefined} onClick={() => go(id)}>
              <Icon size={18} /> <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="bo-side-foot">
          <span className="bo-user">
            <b>FA</b>
            <span>
              Fossil Admin
              <small>Demo account</small>
            </span>
          </span>
        </div>
      </aside>

      <div className="bo-main">
        <header className="bo-top">
          <div>
            <p className="bo-crumb">Back office / {TABS.find((t) => t.id === tab)?.label}</p>
            <h1>{TABS.find((t) => t.id === tab)?.label}</h1>
          </div>
          <div className="bo-top-actions">
            <span className="bo-pill">Design demo · saved in this browser</span>
            <a className="bo-btn ghost" href="/3d#stations" target="_blank" rel="noreferrer">
              Version 1 <ArrowUpRight size={15} />
            </a>
            <a className="bo-btn ghost" href="/2d#stations" target="_blank" rel="noreferrer">
              Version 2 <ArrowUpRight size={15} />
            </a>
            <button
              type="button"
              className="bo-btn ghost"
              onClick={() => {
                if (confirm("Reset all demo data to the original locations and prices?")) {
                  resetDemo();
                  setToast("Demo data reset");
                }
              }}
            >
              <RotateCcw size={15} /> Reset
            </button>
          </div>
        </header>

        {tab === "overview" && <Overview go={go} />}
        {tab === "stations" && <Stations toast={setToast} />}
        {tab === "prices" && <Prices toast={setToast} />}
        {tab === "storage" && <Storage toast={setToast} />}
      </div>

      {toast && (
        <div className="bo-toast" role="status">
          <Check size={16} /> {toast}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Overview ───────────────────────── */

function Overview({ go }: { go: (t: Tab) => void }) {
  const d = useDemoData();
  const open = d.stations.filter((s) => s.status === "open").length;
  const avg = (k: "pmg" | "hsd") => REGIONS.reduce((a, r) => a + d.prices[r][k], 0) / REGIONS.length;
  const points: MapPoint[] = [
    ...d.stations.map((s) => ({ id: s.id, label: s.name, sub: s.city, lat: s.lat, lng: s.lng, kind: "station" as const, muted: s.status !== "open" })),
    ...d.terminals.map((t) => ({ id: `t-${t.id}`, label: t.name, sub: TERMINAL_STATUS[t.status], lat: t.lat, lng: t.lng, kind: "terminal" as const })),
  ];
  return (
    <div className="bo-content">
      <div className="bo-stats">
        <button type="button" className="bo-stat" onClick={() => go("stations")}>
          <MapPin size={18} />
          <strong>{d.stations.length}</strong>
          <span>Stations · {open} open</span>
        </button>
        <button type="button" className="bo-stat" onClick={() => go("storage")}>
          <Warehouse size={18} />
          <strong>{d.terminals.length}</strong>
          <span>Storage sites · {d.terminals.filter((t) => t.status === "operational").length} operational</span>
        </button>
        <button type="button" className="bo-stat" onClick={() => go("prices")}>
          <Fuel size={18} />
          <strong>{formatPrice(avg("pmg"))}</strong>
          <span>Avg PMG · PKR/L</span>
        </button>
        <button type="button" className="bo-stat" onClick={() => go("prices")}>
          <Fuel size={18} />
          <strong>{formatPrice(avg("hsd"))}</strong>
          <span>Avg HSD · PKR/L</span>
        </button>
      </div>
      <div className="bo-grid-2">
        <section className="bo-card">
          <h2>Network map</h2>
          <p className="bo-muted">Everything shown here is what visitors see on both website versions.</p>
          <StationMap points={points} className="station-map bo-map" ariaLabel="Network overview map" />
        </section>
        <section className="bo-card">
          <h2>
            <ActivityIcon size={17} /> Recent activity
          </h2>
          <ul className="bo-activity">
            {d.activity.map((a, i) => (
              <li key={i}>
                <span>{a.text}</span>
                <time>{new Date(a.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</time>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ───────────────────────── Shared location editor ───────────────────────── */

type Draft = { id?: string; name: string; city: string; province: Region; lat: string; lng: string };

function LocationFields({
  draft,
  set,
  points,
}: {
  draft: Draft;
  set: (d: Partial<Draft>) => void;
  points: MapPoint[];
}) {
  const lat = parseFloat(draft.lat);
  const lng = parseFloat(draft.lng);
  const hasPoint = Number.isFinite(lat) && Number.isFinite(lng);
  return (
    <>
      <div className="bo-field-row">
        <label className="bo-field">
          Name
          <input required value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Fossil Hyderabad" />
        </label>
      </div>
      <div className="bo-field-row">
        <label className="bo-field">
          City
          <input required value={draft.city} onChange={(e) => set({ city: e.target.value })} placeholder="City" />
        </label>
        <label className="bo-field">
          Region
          <select value={draft.province} onChange={(e) => set({ province: e.target.value as Region })}>
            {REGIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="bo-field">
        Location <small className="bo-muted">Click the map to drop the pin</small>
        <StationMap
          className="station-map bo-map bo-picker"
          points={[...points, ...(hasPoint ? [{ id: "draft", label: draft.name || "New location", sub: "Unsaved", lat, lng, kind: "draft" as const }] : [])]}
          selected={hasPoint ? "draft" : ""}
          onPick={(la, ln) => set({ lat: la.toFixed(4), lng: ln.toFixed(4) })}
          ariaLabel="Pick a location on the map"
        />
      </div>
      <div className="bo-field-row">
        <label className="bo-field">
          Latitude
          <input required inputMode="decimal" value={draft.lat} onChange={(e) => set({ lat: e.target.value })} placeholder="31.5204" />
        </label>
        <label className="bo-field">
          Longitude
          <input required inputMode="decimal" value={draft.lng} onChange={(e) => set({ lng: e.target.value })} placeholder="74.3587" />
        </label>
      </div>
    </>
  );
}

function validCoords(d: Draft) {
  const lat = parseFloat(d.lat);
  const lng = parseFloat(d.lng);
  return lat >= 23 && lat <= 37.5 && lng >= 60.5 && lng <= 78 ? { lat, lng } : null;
}

/* ───────────────────────── Stations ───────────────────────── */

type StationDraft = Draft & { status: Station["status"]; services: string[] };
const emptyStation: StationDraft = { name: "", city: "", province: "Punjab", lat: "", lng: "", status: "open", services: ["Fuel"] };

function Stations({ toast }: { toast: (m: string) => void }) {
  const { stations, terminals } = useDemoData();
  const [draft, setDraft] = useState<StationDraft | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const list = stations.filter((s) => `${s.name} ${s.city} ${s.province}`.toLowerCase().includes(q.toLowerCase()));
  const others = useMemo<MapPoint[]>(
    () =>
      stations
        .filter((s) => s.id !== draft?.id)
        .map((s) => ({ id: s.id, label: s.name, sub: s.city, lat: s.lat, lng: s.lng, kind: "station" as const, muted: true })),
    [stations, draft?.id],
  );

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const c = validCoords(draft);
    if (!c) return setError("Pick a point inside Pakistan on the map, or enter valid coordinates.");
    const st: Station = {
      id: draft.id ?? newId(),
      name: draft.name.trim(),
      city: draft.city.trim(),
      province: draft.province,
      lat: c.lat,
      lng: c.lng,
      status: draft.status,
      services: draft.services,
    };
    const isNew = !draft.id;
    updateDemo(
      (d) => ({ ...d, stations: isNew ? [...d.stations, st] : d.stations.map((s) => (s.id === st.id ? st : s)) }),
      `${isNew ? "Added" : "Updated"} station ${st.name}`,
    );
    setDraft(null);
    toast(`${st.name} saved · live on the website`);
  };

  const remove = (s: Station) => {
    if (!confirm(`Remove ${s.name} from the website?`)) return;
    updateDemo((d) => ({ ...d, stations: d.stations.filter((x) => x.id !== s.id) }), `Removed station ${s.name}`);
    toast(`${s.name} removed`);
  };

  return (
    <div className={`bo-content bo-split ${draft ? "has-form" : ""}`}>
      <section className="bo-card">
        <div className="bo-card-head">
          <label className="bo-search">
            <Search size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stations" aria-label="Search stations" />
          </label>
          <button type="button" className="bo-btn" onClick={() => { setError(""); setDraft({ ...emptyStation }); }}>
            <Plus size={16} /> Add station
          </button>
        </div>
        <div className="bo-table-wrap">
          <table className="bo-table">
            <thead>
              <tr>
                <th>Station</th>
                <th>Region</th>
                <th>Status</th>
                <th>Services</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className={draft?.id === s.id ? "editing" : undefined}>
                  <td>
                    <strong>{s.name}</strong>
                    <small>
                      {s.city} · {s.lat.toFixed(3)}, {s.lng.toFixed(3)}
                    </small>
                  </td>
                  <td>{s.province}</td>
                  <td>
                    <span className={`bo-status ${s.status}`}>{s.status === "open" ? "Open" : "Coming soon"}</span>
                  </td>
                  <td className="bo-muted">{s.services.join(", ")}</td>
                  <td className="bo-actions">
                    <button type="button" aria-label={`Edit ${s.name}`} onClick={() => { setError(""); setDraft({ ...s, lat: String(s.lat), lng: String(s.lng) }); }}>
                      <Pencil size={15} />
                    </button>
                    <button type="button" aria-label={`Delete ${s.name}`} onClick={() => remove(s)}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {!list.length && (
                <tr>
                  <td colSpan={5} className="bo-empty">No stations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="bo-muted bo-foot">{terminals.length} storage terminals are managed under Storage.</p>
      </section>

      {draft && (
        <form className="bo-card bo-form" onSubmit={save}>
          <h2>{draft.id ? "Edit station" : "New station"}</h2>
          <LocationFields draft={draft} set={(p) => setDraft({ ...draft, ...p })} points={others} />
          <div className="bo-field">
            Status
            <div className="bo-seg">
              {(["open", "coming-soon"] as const).map((st) => (
                <button type="button" key={st} aria-pressed={draft.status === st} onClick={() => setDraft({ ...draft, status: st })}>
                  {st === "open" ? "Open" : "Coming soon"}
                </button>
              ))}
            </div>
          </div>
          <fieldset className="bo-field">
            <legend>Services</legend>
            <div className="bo-chips">
              {SERVICES.map((sv) => (
                <label key={sv} className="bo-chip">
                  <input
                    type="checkbox"
                    checked={draft.services.includes(sv)}
                    onChange={(e) =>
                      setDraft({ ...draft, services: e.target.checked ? [...draft.services, sv] : draft.services.filter((x) => x !== sv) })
                    }
                  />
                  {sv}
                </label>
              ))}
            </div>
          </fieldset>
          {error && <p className="bo-error">{error}</p>}
          <div className="bo-form-actions">
            <button type="button" className="bo-btn ghost" onClick={() => setDraft(null)}>
              Cancel
            </button>
            <button type="submit" className="bo-btn">
              <Check size={16} /> {draft.id ? "Save changes" : "Publish station"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ───────────────────────── Fuel prices ───────────────────────── */

function Prices({ toast }: { toast: (m: string) => void }) {
  const { prices, pricesUpdated } = useDemoData();
  const toDraft = () =>
    Object.fromEntries(REGIONS.map((r) => [r, { pmg: formatPrice(prices[r].pmg), hsd: formatPrice(prices[r].hsd) }])) as Record<Region, { pmg: string; hsd: string }>;
  const [draft, setDraft] = useState(toDraft);
  useEffect(() => setDraft(toDraft()), [prices]); // eslint-disable-line react-hooks/exhaustive-deps

  const changed = REGIONS.filter(
    (r) => parseFloat(draft[r].pmg) !== prices[r].pmg || parseFloat(draft[r].hsd) !== prices[r].hsd,
  );
  const invalid = REGIONS.some((r) => !(parseFloat(draft[r].pmg) > 0) || !(parseFloat(draft[r].hsd) > 0));

  const publish = () => {
    updateDemo(
      (d) => ({
        ...d,
        prices: Object.fromEntries(REGIONS.map((r) => [r, { pmg: parseFloat(draft[r].pmg), hsd: parseFloat(draft[r].hsd) }])) as typeof d.prices,
        pricesUpdated: new Date().toISOString(),
      }),
      `Published fuel prices for ${changed.join(", ")}`,
    );
    toast("Prices published · live on the website");
  };

  const delta = (now: string, was: number) => {
    const d = parseFloat(now) - was;
    if (!Number.isFinite(d) || Math.abs(d) < 0.005) return null;
    return <em className={d > 0 ? "up" : "down"}>{d > 0 ? "+" : ""}{d.toFixed(2)}</em>;
  };

  return (
    <div className="bo-content">
      <section className="bo-card">
        <div className="bo-card-head">
          <div>
            <h2>Region-wise prices</h2>
            <p className="bo-muted">PKR per litre · last published {formatDate(pricesUpdated)}</p>
          </div>
          <div className="bo-form-actions">
            <button type="button" className="bo-btn ghost" disabled={!changed.length} onClick={() => setDraft(toDraft())}>
              Discard
            </button>
            <button type="button" className="bo-btn" disabled={!changed.length || invalid} onClick={publish}>
              <Check size={16} /> Publish {changed.length ? `(${changed.length})` : ""}
            </button>
          </div>
        </div>
        <div className="bo-price-grid">
          {REGIONS.map((r) => (
            <div key={r} className={`bo-price ${changed.includes(r) ? "dirty" : ""}`}>
              <h3>{r}</h3>
              {(["pmg", "hsd"] as const).map((k) => (
                <label key={k} className="bo-field">
                  <span>
                    {k === "pmg" ? "PMG · Petrol" : "HSD · Diesel"} {delta(draft[r][k], prices[r][k])}
                  </span>
                  <span className="bo-money">
                    <small>Rs</small>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={draft[r][k]}
                      onChange={(e) => setDraft({ ...draft, [r]: { ...draft[r], [k]: e.target.value } })}
                    />
                  </span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section className="bo-card bo-preview">
        <h2>Website preview</h2>
        <div className="bo-tariff">
          <span>FUEL PRICE SNAPSHOT</span>
          <b>Punjab</b>
          <strong>PMG {formatPrice(parseFloat(draft.Punjab.pmg) || 0)}</strong>
          <i />
          <strong>HSD {formatPrice(parseFloat(draft.Punjab.hsd) || 0)}</strong>
        </div>
        <p className="bo-muted">Visitors pick their region in the price bar and station finder on both versions.</p>
      </section>
    </div>
  );
}

/* ───────────────────────── Storage ───────────────────────── */

type TerminalDraft = Draft & { status: TerminalStatus; capacity: string };
const emptyTerminal: TerminalDraft = { name: "", city: "", province: "Punjab", lat: "", lng: "", status: "development", capacity: "" };

function Storage({ toast }: { toast: (m: string) => void }) {
  const { terminals } = useDemoData();
  const [draft, setDraft] = useState<TerminalDraft | null>(null);
  const [error, setError] = useState("");
  const others = useMemo<MapPoint[]>(
    () =>
      terminals
        .filter((t) => t.id !== draft?.id)
        .map((t) => ({ id: t.id, label: t.name, sub: TERMINAL_STATUS[t.status], lat: t.lat, lng: t.lng, kind: "terminal" as const })),
    [terminals, draft?.id],
  );

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const c = validCoords(draft);
    if (!c) return setError("Pick a point inside Pakistan on the map, or enter valid coordinates.");
    const t: Terminal = {
      id: draft.id ?? newId(),
      name: draft.name.trim(),
      city: draft.city.trim(),
      province: draft.province,
      lat: c.lat,
      lng: c.lng,
      status: draft.status,
      capacity: draft.capacity.trim() || "—",
    };
    const isNew = !draft.id;
    updateDemo(
      (d) => ({ ...d, terminals: isNew ? [...d.terminals, t] : d.terminals.map((x) => (x.id === t.id ? t : x)) }),
      `${isNew ? "Added" : "Updated"} storage site ${t.name}`,
    );
    setDraft(null);
    toast(`${t.name} saved · live on the website`);
  };

  const remove = (t: Terminal) => {
    if (!confirm(`Remove ${t.name} from the website?`)) return;
    updateDemo((d) => ({ ...d, terminals: d.terminals.filter((x) => x.id !== t.id) }), `Removed storage site ${t.name}`);
    toast(`${t.name} removed`);
  };

  return (
    <div className={`bo-content bo-split ${draft ? "has-form" : ""}`}>
      <section className="bo-card">
        <div className="bo-card-head">
          <div>
            <h2>Storage sites</h2>
            <p className="bo-muted">Shown on the station map and the storage sections of both versions.</p>
          </div>
          <button type="button" className="bo-btn" onClick={() => { setError(""); setDraft({ ...emptyTerminal }); }}>
            <Plus size={16} /> Add storage site
          </button>
        </div>
        <div className="bo-terminal-grid">
          {terminals.map((t) => (
            <article key={t.id} className={`bo-terminal ${draft?.id === t.id ? "editing" : ""}`}>
              <Warehouse size={20} />
              <div>
                <strong>{t.name}</strong>
                <small>
                  {t.city}, {t.province}
                </small>
                <small>Capacity: {t.capacity}</small>
              </div>
              <span className={`bo-status ${t.status}`}>{TERMINAL_STATUS[t.status]}</span>
              <div className="bo-actions">
                <button type="button" aria-label={`Edit ${t.name}`} onClick={() => { setError(""); setDraft({ ...t, lat: String(t.lat), lng: String(t.lng), capacity: t.capacity === "—" ? "" : t.capacity }); }}>
                  <Pencil size={15} />
                </button>
                <button type="button" aria-label={`Delete ${t.name}`} onClick={() => remove(t)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {draft && (
        <form className="bo-card bo-form" onSubmit={save}>
          <h2>{draft.id ? "Edit storage site" : "New storage site"}</h2>
          <LocationFields draft={draft} set={(p) => setDraft({ ...draft, ...p })} points={others} />
          <div className="bo-field-row">
            <label className="bo-field">
              Status
              <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as TerminalStatus })}>
                {(Object.keys(TERMINAL_STATUS) as TerminalStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {TERMINAL_STATUS[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="bo-field">
              Capacity
              <input value={draft.capacity} onChange={(e) => setDraft({ ...draft, capacity: e.target.value })} placeholder="e.g. 25,000 MT" />
            </label>
          </div>
          {error && <p className="bo-error">{error}</p>}
          <div className="bo-form-actions">
            <button type="button" className="bo-btn ghost" onClick={() => setDraft(null)}>
              Cancel
            </button>
            <button type="submit" className="bo-btn">
              <Check size={16} /> {draft.id ? "Save changes" : "Publish site"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
