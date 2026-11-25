"use client";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  Droplet,
  Fuel,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import GroupHeader from "./GroupHeader";
import FuelAdvisor from "./FuelAdvisor";
import { HeroWave, OgraBadge, fmtTime } from "./shared";
import StationMap, { type MapPoint } from "@/components/StationMap";
import ChatWidget from "@/components/ChatWidget";
import IgnitionFX, { IgnitionFonts } from "./ignition/IgnitionFX";
import { companies, group } from "@/data/groupContent";
import { DESIGNS, SECTIONS, designHref, sectionHref, type Design, type Section } from "@/data/designs";
import {
  REGIONS,
  TERMINAL_STATUS,
  formatDate,
  formatPrice,
  useDemoData,
  type Region,
} from "@/lib/demoStore";

const INTRO: Record<Section, { eyebrow: string; title: [string, string]; sub: string }> = {
  companies: {
    eyebrow: "THE GROUP",
    title: ["Four companies.", "One energy partner."],
    sub: "Fuel retail and storage, lubricants and LPG. Choose a company to see what it does.",
  },
  "fuel-finder": {
    eyebrow: "FUEL & OIL FINDER",
    title: ["The right fuel", "for your car."],
    sub: "Tell us your make, model and age, and we'll recommend the fuel and engine oil that suit it.",
  },
  prices: {
    eyebrow: "FUEL PRICES",
    title: ["Today's prices,", "straight from OGRA."],
    sub: "Region-wise prices published from Fossil's latest OGRA submission. They update automatically.",
  },
  stations: {
    eyebrow: "STATIONS & TERMINALS",
    title: ["Find a Fossil", "near you."],
    sub: "Search stations by city or region, see their services, and get directions. Storage terminals are shown too.",
  },
  contact: {
    eyebrow: "GET IN TOUCH",
    title: ["Let's power", "what's next."],
    sub: "Questions about fuel, partnerships, lubricants or LPG? Call, email, or send us a message.",
  },
};

/* ───────── Companies: list + detail ───────── */
function CompaniesSection() {
  const [id, setId] = useState(companies[0].id);
  const c = companies.find((x) => x.id === id)!;
  return (
    <div className="gpg-companies">
      <div className="gpg-company-list" role="tablist" aria-label="Group companies">
        {companies.map((x) => (
          <button key={x.id} type="button" role="tab" aria-selected={x.id === id} onClick={() => setId(x.id)}>
            <b>{x.short}</b>
            <span>
              {x.name}
              <small>{x.sector}</small>
            </span>
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
      <article className={`gpg-company ${c.pending ? "pending" : ""}`} role="tabpanel" aria-label={c.name}>
        <div className="gpg-company-media">{c.image ? <img src={c.image} alt="" /> : <b>{c.short}</b>}</div>
        <div className="gpg-company-body">
          <p className="gp-eyebrow">{c.sector}</p>
          <h2>{c.name}</h2>
          <p className="gpg-lead">{c.tagline}</p>
          <p>{c.overview}</p>
          <ul>
            {c.facts.map((f) => (
              <li key={f}>
                <BadgeCheck size={16} /> {f}
              </li>
            ))}
          </ul>
          <div className="gp-actions">
            {c.internal?.map((l) => (
              <a key={l.href} className="gp-btn" href={l.href}>
                {l.label} <ArrowRight size={16} />
              </a>
            ))}
            {c.url ? (
              <a className="gp-btn ghost" href={c.url} target="_blank" rel="noopener noreferrer">
                Visit website <ArrowUpRight size={16} />
              </a>
            ) : (
              <span className="gp-btn ghost is-disabled">Website link to be added</span>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

/* ───────── Fuel finder: advisor + our fuels & oils ───────── */
const FUELS = [
  { name: "Optimo 92", grade: "RON 92 · PMG", text: "Regular petrol for most cars and motorcycles in Pakistan." },
  { name: "Octo 97", grade: "RON 97 · HOBC", text: "High-octane petrol for turbocharged and performance engines." },
  { name: "Primo Diesel", grade: "HSD", text: "High-speed diesel for SUVs, pick-ups, trucks and tractors." },
];
const OILS = [
  { name: "RTX Bianchi", grade: "0W-20 · 5W-30 · 10W-40", text: "Passenger-car motor oils, from new hybrids to older petrol engines." },
  { name: "RTX Rotex", grade: "CI-4 15W-40 · CF-4 20W-50", text: "Diesel engine oils for common-rail and heavy-duty engines." },
  { name: "RTX Gamma / Nova", grade: "10W-40 · 20W-50", text: "4-stroke motorcycle oils that protect engine and clutch." },
];
function FuelFinderSection({ design }: { design: Design }) {
  return (
    <>
      <FuelAdvisor />
      <div className="gpg-catalog">
        <section>
          <h3>
            <Fuel size={18} /> Our fuels
          </h3>
          <div className="gpg-cards">
            {FUELS.map((f) => (
              <div key={f.name} className="gpg-card">
                <strong>{f.name}</strong>
                <em>{f.grade}</em>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h3>
            <Droplet size={18} /> Our engine oils
          </h3>
          <div className="gpg-cards">
            {OILS.map((f) => (
              <div key={f.name} className="gpg-card">
                <strong>{f.name}</strong>
                <em>{f.grade}</em>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <p className="gpg-note">
        Recommendations are general guidance; always follow your owner&apos;s manual. Today&apos;s fuel prices are on the{" "}
        <a href={sectionHref(design, "prices")}>Prices page</a>.
      </p>
    </>
  );
}

/* ───────── Prices: region cards, full table, how OGRA sync works ───────── */
function PricesSection() {
  const { prices, pricesUpdated, ogra } = useDemoData();
  const [region, setRegion] = useState<Region>("Punjab");
  const p = prices[region];
  return (
    <>
      <div className="gpg-prices">
        <div>
          <div className="gpg-tabs" role="tablist" aria-label="Region">
            {REGIONS.map((r) => (
              <button key={r} role="tab" type="button" aria-selected={region === r} onClick={() => setRegion(r)}>
                {r}
              </button>
            ))}
          </div>
          <div className="gpg-price-cards">
            <div>
              <small>Optimo 92 · Petrol (PMG)</small>
              <strong>
                <span>Rs</span> {formatPrice(p.pmg)}
              </strong>
              <i>per litre · {region}</i>
            </div>
            <div>
              <small>Primo Diesel (HSD)</small>
              <strong>
                <span>Rs</span> {formatPrice(p.hsd)}
              </strong>
              <i>per litre · {region}</i>
            </div>
          </div>
          <OgraBadge />
        </div>
        <table className="gpg-table">
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
      <section className="gpg-steps">
        <h3>
          <ShieldCheck size={18} /> How prices reach this page
        </h3>
        <ol>
          <li>
            <b>1</b>
            <strong>Fossil submits to OGRA</strong>
            <span>Region-wise prices are submitted to the Oil & Gas Regulatory Authority.</span>
          </li>
          <li>
            <b>2</b>
            <strong>OGRA acknowledges</strong>
            <span>
              The submission gets a reference: latest <code>{ogra.ref}</code>, {fmtTime(ogra.submittedAt)}.
            </span>
          </li>
          <li>
            <b>3</b>
            <strong>Website updates itself</strong>
            <span>The same figures appear here, on the station finder and in the fuel finder. No re-typing.</span>
          </li>
        </ol>
        <p className="gpg-note">Premium Octo 97 is priced at the pump. Demo: the OGRA connection is simulated.</p>
      </section>
    </>
  );
}

/* ───────── Stations: searchable list + big map + terminals ───────── */
function StationsSection() {
  const { stations, terminals, prices } = useDemoData();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState("");
  const list = stations.filter(
    (s) => (region === "All" || s.province === region) && `${s.name} ${s.city}`.toLowerCase().includes(q.trim().toLowerCase()),
  );
  const points: MapPoint[] = [
    ...list.map((s) => ({ id: s.id, label: s.name, sub: `${s.city}, ${s.province}`, lat: s.lat, lng: s.lng, kind: "station" as const, muted: s.status !== "open" })),
    ...terminals.map((t) => ({ id: `t-${t.id}`, label: `${t.name} terminal`, sub: TERMINAL_STATUS[t.status], lat: t.lat, lng: t.lng, kind: "terminal" as const })),
  ];
  return (
    <>
      <div className="gpg-stations">
        <div className="gpg-station-side">
          <div className="gpg-filters">
            <label className="gpg-search">
              <Search size={16} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search city or station" aria-label="Search stations" />
            </label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Region">
              <option value="All">All regions</option>
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <p className="gpg-count">{list.length} stations</p>
          <div className="gpg-station-list">
            {list.map((s) => (
              <article key={s.id} className={selected === s.id ? "is-selected" : undefined}>
                <button type="button" onClick={() => setSelected(s.id)}>
                  <MapPin size={18} />
                  <span>
                    <strong>
                      {s.name}
                      {s.status !== "open" && <em>Coming soon</em>}
                    </strong>
                    <small>
                      {s.city}, {s.province} · PMG {formatPrice(prices[s.province].pmg)}
                    </small>
                    <small>{s.services.join(" · ")}</small>
                  </span>
                </button>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`} target="_blank" rel="noopener noreferrer">
                  <Navigation size={14} /> Directions
                </a>
              </article>
            ))}
            {!list.length && <p className="gpg-note">No stations match. Try another city or region.</p>}
          </div>
        </div>
        <StationMap
          points={points}
          selected={selected}
          onSelect={(id) => !id.startsWith("t-") && setSelected(id)}
          className="station-map gpg-map"
          ariaLabel="Map of Fossil stations and storage terminals"
        />
      </div>
      <section className="gpg-terminals">
        <h3>
          <Warehouse size={18} /> Storage terminals
        </h3>
        <div className="gpg-cards">
          {terminals.map((t) => (
            <div key={t.id} className="gpg-card">
              <strong>{t.name}</strong>
              <em className={`gpg-status ${t.status}`}>{TERMINAL_STATUS[t.status]}</em>
              <p>
                {t.city}, {t.province}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ───────── Contact: channels + enquiry form (demo) ───────── */
function ContactSection() {
  const [sent, setSent] = useState(false);
  return (
    <div className="gpg-contact">
      <div className="gpg-channels">
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
      <form
        className="gpg-form"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        {sent ? (
          <div className="gpg-sent">
            <span>
              <Check size={22} />
            </span>
            <strong>Thank you. Your message is ready to send.</strong>
            <p>Design demo: messages are not delivered yet.</p>
            <button type="button" className="gp-btn ghost" onClick={() => setSent(false)}>
              Send another
            </button>
          </div>
        ) : (
          <>
            <h3>Send us a message</h3>
            <div className="gpg-form-row">
              <label>
                Name
                <input required autoComplete="name" />
              </label>
              <label>
                Phone
                <input type="tel" autoComplete="tel" />
              </label>
            </div>
            <label>
              Email
              <input type="email" required autoComplete="email" />
            </label>
            <label>
              Which company?
              <select defaultValue="Fossil Group">
                <option>Fossil Group</option>
                {companies.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label>
              Message
              <textarea required rows={4} />
            </label>
            <button type="submit" className="gp-btn">
              Send message <Send size={16} />
            </button>
          </>
        )}
      </form>
    </div>
  );
}

function PageDesigns({ design, section }: { design: Design; section: Section }) {
  return (
    <nav className="gp-designs" aria-label="Design variants">
      <span>Design</span>
      {DESIGNS.map((d) => (
        <a key={d.id} href={sectionHref(d.id, section)} aria-current={d.id === design ? "page" : undefined} title={d.name}>
          {d.id.toUpperCase()}
          <small>{d.name}</small>
        </a>
      ))}
    </nav>
  );
}

export default function GroupPage({ design, section }: { design: Design; section: Section }) {
  const intro = INTRO[section];
  return (
    <div className={`gpg design-${design}`}>
      <div className="gpg-top tone-dark">
        <HeroWave />
        <GroupHeader design={design} current={section} />
        <div className="gp-wrap gpg-intro">
          <p className="gp-eyebrow">{intro.eyebrow}</p>
          <h1>
            {intro.title[0]} <em>{intro.title[1]}</em>
          </h1>
          <p className="gpg-sub">{intro.sub}</p>
        </div>
      </div>
      <main id="main" className="gpg-main tone-light">
        <div className="gp-wrap">
          {section === "companies" && <CompaniesSection />}
          {section === "fuel-finder" && <FuelFinderSection design={design} />}
          {section === "prices" && <PricesSection />}
          {section === "stations" && <StationsSection />}
          {section === "contact" && <ContactSection />}
        </div>
      </main>
      <footer className="gpg-foot">
        <div className="gp-wrap">
          <a href={designHref(design)} className="gp-logo">
            <img src="/images/fossil-logo.png" alt="Fossil" width={96} height={31} />
            <span>GROUP</span>
          </a>
          <nav aria-label="Footer">
            {SECTIONS.map((s) => (
              <a key={s.id} href={sectionHref(design, s.id)}>
                {s.label}
              </a>
            ))}
            <a href="/admin">Back office</a>
          </nav>
          <small>© {new Date().getFullYear()} Fossil Group · Design demo</small>
        </div>
      </footer>
      <PageDesigns design={design} section={section} />
      {design === "e" && (
        <>
          <IgnitionFonts />
          <IgnitionFX mode="page" />
        </>
      )}
      <ChatWidget />
    </div>
  );
}
