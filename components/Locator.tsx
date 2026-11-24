"use client";
import { useState } from "react";
import { MapPin, Search, Navigation } from "lucide-react";
import { stations } from "@/data/fossilContent";
import StationMap from "./StationMap";
export default function Locator({
  directory = false,
}: {
  directory?: boolean;
}) {
  const [province, setProvince] = useState("All regions");
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState("Lahore");
  const filtered = stations.filter(
    (s) =>
      (province === "All regions" || s.province === province) &&
      s.city.toLowerCase().includes(query.trim().toLowerCase()),
  );
  // Keep the list and map in agreement: if the chosen city is filtered out,
  // highlight the first remaining result instead.
  const selected = filtered.some((s) => s.city === chosen)
    ? chosen
    : (filtered[0]?.city ?? "");
  const setSelected = setChosen;
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
          Explore our network vision across Pakistan.
          <br />
          <small>
            Preview only: city-centre coordinates, not verified station
            locations.
          </small>
        </p>
      </div>
      <div className={`locator ${directory ? "directory" : ""}`}>
        <div className="station-directory">
          <div className="filters">
            <label className="search">
              <Search size={18} />
              <input
                aria-label="Search city"
                placeholder="Search a city…"
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
              {["All regions", "Punjab", "Sindh", "KPK"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <p className="result-count" role="status">
            {filtered.length} preview locations
          </p>
          <div className="station-list">
            {filtered.map((s) => (
              <article
                key={s.city}
                className={`station ${selected === s.city ? "selected" : ""}`}
              >
                <button
                  onClick={() => setSelected(s.city)}
                  aria-pressed={selected === s.city}
                >
                  <MapPin size={20} />
                  <span>
                    <strong>{s.city}</strong>
                    <small>{s.province} · Illustrative location</small>
                    <small>
                      {s.lat.toFixed(4)}° N, {s.lng.toFixed(4)}° E
                    </small>
                  </span>
                </button>
                <a
                  aria-label={`Get directions to ${s.city} city centre`}
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
                No cities match. Try another city or region.
              </p>
            )}
          </div>
        </div>
        {!directory && (
          <div className="network-map">
            <div className="map-caption">
              PAKISTAN <span>NETWORK PREVIEW</span>
            </div>
            <StationMap
              stations={filtered}
              selected={selected}
              onSelect={setSelected}
            />
            <div className="map-legend">
              <span />
              Preview locations <small>City centres · Not verified station sites</small>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
