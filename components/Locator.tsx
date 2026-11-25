"use client";
import { useState } from "react";
import { MapPin, Search, Navigation, Warehouse } from "lucide-react";
import StationMap, { type MapPoint } from "./StationMap";
import {
  REGIONS,
  TERMINAL_STATUS,
  formatDate,
  formatPrice,
  useDemoData,
} from "@/lib/demoStore";

export default function Locator({
  directory = false,
}: {
  directory?: boolean;
}) {
  const { stations, terminals, prices, pricesUpdated } = useDemoData();
  const [province, setProvince] = useState("All regions");
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState("lhr");
  const [showTerminals, setShowTerminals] = useState(true);
  const q = query.trim().toLowerCase();
  const filtered = stations.filter(
    (s) =>
      (province === "All regions" || s.province === province) &&
      `${s.name} ${s.city}`.toLowerCase().includes(q),
  );
  // Keep the list and map in agreement: if the chosen station is filtered out,
  // highlight the first remaining result instead.
  const selectedStation =
    filtered.find((s) => s.id === chosen) ?? filtered[0] ?? null;
  const selected = selectedStation?.id ?? "";
  const priceRegion =
    selectedStation?.province ??
    (province !== "All regions" ? (province as (typeof REGIONS)[number]) : "Punjab");
  const price = prices[priceRegion];

  const points: MapPoint[] = [
    ...filtered.map((s) => ({
      id: s.id,
      label: s.name,
      sub: `${s.city}, ${s.province}${s.status === "coming-soon" ? " · Coming soon" : ""}`,
      lat: s.lat,
      lng: s.lng,
      kind: "station" as const,
      muted: s.status === "coming-soon",
    })),
    ...(showTerminals
      ? terminals.map((t) => ({
          id: `t-${t.id}`,
          label: `${t.name} terminal`,
          sub: TERMINAL_STATUS[t.status],
          lat: t.lat,
          lng: t.lng,
          kind: "terminal" as const,
        }))
      : []),
  ];

  return (
    <section id="stations" className="section wrap locator-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">ALWAYS ON YOUR WAY</p>
          <h2>
            Your next stop.
            <br />
            <span>Closer than you think.</span>
          </h2>
        </div>
        <p>
          Explore our network across Pakistan.
          <br />
          <small>
            Design demo: locations and prices are managed in the back office
            preview.
          </small>
        </p>
      </div>
      <div className={`locator ${directory ? "directory" : ""}`}>
        <div className="station-directory">
          <div className="price-strip" aria-live="polite">
            <span className="price-region">Fuel prices · {priceRegion}</span>
            <span>
              <small>PMG</small> {formatPrice(price.pmg)}
            </span>
            <span>
              <small>HSD</small> {formatPrice(price.hsd)}
            </span>
            <small className="price-date">PKR/L · {formatDate(pricesUpdated)}</small>
          </div>
          <div className="filters">
            <label className="search">
              <Search size={18} />
              <input
                aria-label="Search stations"
                placeholder="Search a city or station…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <label className="sr-only" htmlFor="province">
              Region
            </label>
            <select
              id="province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            >
              {["All regions", ...REGIONS].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <p className="result-count" role="status">
            {filtered.length} {filtered.length === 1 ? "station" : "stations"}
          </p>
          <div className="station-list">
            {filtered.map((s) => (
              <article
                key={s.id}
                className={`station ${selected === s.id ? "selected" : ""}`}
              >
                <button
                  onClick={() => setChosen(s.id)}
                  aria-pressed={selected === s.id}
                >
                  <MapPin size={20} />
                  <span>
                    <strong>
                      {s.name}
                      {s.status === "coming-soon" && (
                        <em className="station-badge">Coming soon</em>
                      )}
                    </strong>
                    <small>
                      {s.city}, {s.province}
                    </small>
                    <small>{s.services.join(" · ")}</small>
                  </span>
                </button>
                <a
                  aria-label={`Get directions to ${s.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                >
                  <Navigation size={15} /> Get directions
                </a>
              </article>
            ))}
            {!filtered.length && (
              <p className="empty-state">
                No stations match. Try another city or region.
              </p>
            )}
          </div>
        </div>
        {!directory && (
          <div className="network-map">
            <div className="map-caption">
              PAKISTAN <span>STATIONS & TERMINALS</span>
            </div>
            <StationMap
              points={points}
              selected={selected}
              onSelect={(id) => !id.startsWith("t-") && setChosen(id)}
              ariaLabel="Map of Fossil stations and storage terminals in Pakistan"
            />
            <div className="map-legend">
              <span /> Stations
              <label className="legend-toggle">
                <input
                  type="checkbox"
                  checked={showTerminals}
                  onChange={(e) => setShowTerminals(e.target.checked)}
                />
                <Warehouse size={13} /> Storage terminals
              </label>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
