"use client";
/**
 * Design-demo data store shared by the website and the back office preview.
 *
 * There is no server: everything is kept in this browser's localStorage and
 * broadcast to other open tabs through the `storage` event, so editing in
 * /admin updates the website live. "Reset demo data" restores the seed below.
 */
import { useSyncExternalStore } from "react";

export const REGIONS = ["Punjab", "Sindh", "KPK", "Balochistan", "Islamabad"] as const;
export type Region = (typeof REGIONS)[number];

export type StationStatus = "open" | "coming-soon";
export type Station = {
  id: string;
  name: string;
  city: string;
  province: Region;
  lat: number;
  lng: number;
  status: StationStatus;
  services: string[];
};

export type TerminalStatus = "operational" | "equity" | "development" | "to-confirm";
export type Terminal = {
  id: string;
  name: string;
  city: string;
  province: Region;
  lat: number;
  lng: number;
  status: TerminalStatus;
  capacity: string;
};

export type RegionPrice = { pmg: number; hsd: number };
export type Activity = { at: string; text: string };

export type DemoData = {
  stations: Station[];
  terminals: Terminal[];
  prices: Record<Region, RegionPrice>;
  pricesUpdated: string;
  activity: Activity[];
};

export const SERVICES = ["Fuel", "Tyre shop", "Car wash", "Mart", "Prayer area", "Restrooms"];

export const TERMINAL_STATUS: Record<TerminalStatus, string> = {
  operational: "Operational",
  equity: "Equity partnership",
  development: "In development",
  "to-confirm": "To confirm",
};

const seed: DemoData = {
  stations: [
    { id: "lhr", name: "Fossil Lahore", city: "Lahore", province: "Punjab", lat: 31.5204, lng: 74.3587, status: "open", services: ["Fuel", "Tyre shop", "Mart"] },
    { id: "khi", name: "Fossil Karachi", city: "Karachi", province: "Sindh", lat: 24.8607, lng: 67.0011, status: "open", services: ["Fuel", "Car wash", "Mart"] },
    { id: "mux", name: "Fossil Multan", city: "Multan", province: "Punjab", lat: 30.1575, lng: 71.5249, status: "open", services: ["Fuel", "Prayer area"] },
    { id: "fsd", name: "Fossil Faisalabad", city: "Faisalabad", province: "Punjab", lat: 31.4504, lng: 73.135, status: "open", services: ["Fuel", "Tyre shop"] },
    { id: "dgk", name: "Fossil Dera Ghazi Khan", city: "Dera Ghazi Khan", province: "Punjab", lat: 30.0489, lng: 70.6455, status: "open", services: ["Fuel", "Restrooms"] },
    { id: "pew", name: "Fossil Peshawar", city: "Peshawar", province: "KPK", lat: 34.0151, lng: 71.5249, status: "coming-soon", services: ["Fuel"] },
  ],
  terminals: [
    { id: "mkt", name: "Mehmoodkot", city: "Muzaffargarh", province: "Punjab", lat: 30.27, lng: 71.03, status: "operational", capacity: "—" },
    { id: "gti", name: "Gatti", city: "Faisalabad", province: "Punjab", lat: 31.42, lng: 73.02, status: "operational", capacity: "—" },
    { id: "thl", name: "Thaliyan", city: "Attock", province: "Punjab", lat: 33.6, lng: 72.75, status: "equity", capacity: "—" },
    { id: "mck", name: "Machike", city: "Sheikhupura", province: "Punjab", lat: 31.8, lng: 73.9, status: "development", capacity: "—" },
    { id: "shk", name: "Shikarpur", city: "Shikarpur", province: "Sindh", lat: 27.95, lng: 68.64, status: "to-confirm", capacity: "—" },
  ],
  prices: {
    Punjab: { pmg: 335.06, hsd: 390.62 },
    Sindh: { pmg: 334.86, hsd: 390.42 },
    KPK: { pmg: 335.46, hsd: 391.02 },
    Balochistan: { pmg: 335.66, hsd: 391.22 },
    Islamabad: { pmg: 335.06, hsd: 390.62 },
  },
  pricesUpdated: "2026-07-30T09:00:00.000Z",
  activity: [{ at: "2026-07-30T09:00:00.000Z", text: "Demo data loaded" }],
};

const KEY = "fossil-demo-v1";
const listeners = new Set<() => void>();
let cache: DemoData | null = null;

function read(): DemoData {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...seed, ...(JSON.parse(raw) as Partial<DemoData>) } : seed;
  } catch {
    cache = seed;
  }
  return cache;
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Live demo data; renders the seed on the server and during hydration. */
export function useDemoData(): DemoData {
  return useSyncExternalStore(subscribe, read, () => seed);
}

/** Apply a change, record it in the activity log, persist and notify. */
export function updateDemo(change: (d: DemoData) => DemoData, note: string) {
  const next = change(read());
  next.activity = [{ at: new Date().toISOString(), text: note }, ...next.activity].slice(0, 20);
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode: still updates this tab */
  }
  emit();
}

export function resetDemo() {
  cache = seed;
  try {
    localStorage.removeItem(KEY);
  } catch {}
  emit();
}

export const newId = () => Math.random().toString(36).slice(2, 9);

export const formatPrice = (n: number) => n.toFixed(2);
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
