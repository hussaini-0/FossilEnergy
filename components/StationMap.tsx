"use client";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap, CircleMarker, LayerGroup } from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapPoint = {
  id: string;
  label: string;
  sub: string;
  lat: number;
  lng: number;
  /** station = red, terminal = dark square-ish marker, draft = the point being placed in the back office */
  kind: "station" | "terminal" | "draft";
  muted?: boolean;
};

// Pakistan's rough extent, used for the initial view and to keep panning sensible.
const PAKISTAN_BOUNDS: [[number, number], [number, number]] = [
  [23.5, 60.8],
  [37.2, 77.9],
];

const style = (p: MapPoint, active: boolean) => {
  if (p.kind === "terminal")
    return { radius: active ? 10 : 7, color: "#fff", weight: 2, fillColor: "#1d2430", fillOpacity: 1 };
  if (p.kind === "draft")
    return { radius: 10, color: "#e11b22", weight: 3, dashArray: "3 3", fillColor: "#fff", fillOpacity: 1 };
  return {
    radius: active ? 11 : 7,
    color: "#fff",
    weight: 2,
    fillColor: p.muted ? "#f08a8e" : "#e11b22",
    fillOpacity: active ? 1 : 0.9,
  };
};

export default function StationMap({
  points,
  selected = "",
  onSelect,
  onPick,
  ariaLabel = "Map of locations in Pakistan",
  className = "station-map",
}: {
  points: MapPoint[];
  selected?: string;
  onSelect?: (id: string) => void;
  /** When set, clicking empty map reports the clicked coordinates (back office location picker). */
  onPick?: (lat: number, lng: number) => void;
  ariaLabel?: string;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const markers = useRef(new Map<string, CircleMarker>());
  const L = useRef<typeof import("leaflet") | null>(null);
  const handlers = useRef({ onSelect, onPick });
  handlers.current = { onSelect, onPick };
  const drawRef = useRef<() => void>(() => {});

  // Create the map once (Leaflet touches `window`, so load it on the client).
  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((mod) => {
      if (cancelled || !el.current || map.current) return;
      L.current = mod;
      const m = mod.map(el.current, {
        // Canvas markers: the site's global `svg { width: 100% }` rule would distort Leaflet's SVG layer.
        preferCanvas: true,
        scrollWheelZoom: false,
        zoomSnap: 0.25,
        maxBounds: [
          [20, 55],
          [40, 82],
        ],
        minZoom: 4,
      });
      m.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
      m.fitBounds(PAKISTAN_BOUNDS);
      mod
        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(m);
      m.on("click", (e) => handlers.current.onPick?.(e.latlng.lat, e.latlng.lng));
      layer.current = mod.layerGroup().addTo(m);
      map.current = m;
      drawRef.current();
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  drawRef.current = () => {
    const mod = L.current;
    const m = map.current;
    if (!mod || !m || !layer.current) return;
    layer.current.clearLayers();
    markers.current.clear();
    for (const p of points) {
      const active = p.id === selected;
      const marker = mod
        .circleMarker([p.lat, p.lng], style(p, active))
        .bindTooltip(`<strong>${p.label}</strong><br/>${p.sub}`, { direction: "top", offset: [0, -8] })
        .on("click", (e) => {
          mod.DomEvent.stopPropagation(e);
          handlers.current.onSelect?.(p.id);
        })
        .addTo(layer.current);
      markers.current.set(p.id, marker);
    }
    const active = points.find((p) => p.id === selected);
    if (active) {
      markers.current.get(active.id)?.bringToFront().openTooltip();
      m.panTo([active.lat, active.lng], { duration: 0.6 });
    }
  };

  const key = points.map((p) => `${p.id}:${p.lat}:${p.lng}:${p.label}:${p.muted}`).join("|");
  useEffect(() => drawRef.current(), [key, selected]);

  return (
    <div
      ref={el}
      className={`${className}${onPick ? " picking" : ""}`}
      role="region"
      aria-label={ariaLabel}
    />
  );
}
