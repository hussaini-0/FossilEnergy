"use client";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap, CircleMarker, LayerGroup } from "leaflet";
import "leaflet/dist/leaflet.css";

type Station = { city: string; province: string; lat: number; lng: number };

// Pakistan's rough extent, used for the initial view and to keep panning sensible.
const PAKISTAN_BOUNDS: [[number, number], [number, number]] = [
  [23.5, 60.8],
  [37.2, 77.9],
];

export default function StationMap({
  stations,
  selected,
  onSelect,
}: {
  stations: Station[];
  selected: string;
  onSelect: (city: string) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const markers = useRef(new Map<string, CircleMarker>());
  const L = useRef<typeof import("leaflet") | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

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
      m.attributionControl.setPrefix(
        '<a href="https://leafletjs.com">Leaflet</a>',
      );
      m.fitBounds(PAKISTAN_BOUNDS);
      mod
        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(m);
      layer.current = mod.layerGroup().addTo(m);
      map.current = m;
      draw();
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function draw() {
    const mod = L.current;
    const m = map.current;
    if (!mod || !m || !layer.current) return;
    layer.current.clearLayers();
    markers.current.clear();
    for (const s of stations) {
      const active = s.city === selected;
      const marker = mod
        .circleMarker([s.lat, s.lng], {
          radius: active ? 11 : 7,
          color: "#fff",
          weight: 2,
          fillColor: "#e11b22",
          fillOpacity: active ? 1 : 0.85,
        })
        .bindTooltip(`<strong>${s.city}</strong><br/>${s.province}`, {
          direction: "top",
          offset: [0, -8],
        })
        .on("click", () => onSelectRef.current(s.city))
        .addTo(layer.current);
      markers.current.set(s.city, marker);
    }
    const active = stations.find((s) => s.city === selected);
    if (active) {
      markers.current.get(active.city)?.bringToFront().openTooltip();
      m.panTo([active.lat, active.lng], { duration: 0.6 });
    } else if (stations.length) {
      m.fitBounds(
        mod.latLngBounds(stations.map((s) => [s.lat, s.lng])).pad(0.3),
      );
    }
  }

  const cityKey = stations.map((s) => s.city).join("|");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(draw, [cityKey, selected]);

  return (
    <div
      ref={el}
      className="station-map"
      role="region"
      aria-label="Map of preview station locations in Pakistan"
    />
  );
}
