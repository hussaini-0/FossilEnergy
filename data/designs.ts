/** Fossil Group design variants: "a" is served at /, the rest at /group/<id>. */
export type Design = "a" | "b" | "c" | "d" | "e";
export const DESIGNS: { id: Design; name: string }[] = [
  { id: "a", name: "Night" },
  { id: "b", name: "Daylight" },
  { id: "c", name: "Signal" },
  { id: "d", name: "Mosaic" },
  { id: "e", name: "Ignition" },
];
export const designHref = (d: Design) => (d === "a" ? "/" : `/group/${d}`);

/** Top-bar sections; each has its own page in every design. */
export type Section = "companies" | "fuel-finder" | "prices" | "stations" | "contact";
export const SECTIONS: { id: Section; label: string }[] = [
  { id: "companies", label: "Companies" },
  { id: "fuel-finder", label: "Fuel finder" },
  { id: "prices", label: "Prices" },
  { id: "stations", label: "Stations" },
  { id: "contact", label: "Contact" },
];
export const sectionHref = (d: Design, s: Section) => (d === "a" ? `/${s}` : `/group/${d}/${s}`);
export const sectionTitle = (s: Section) => SECTIONS.find((x) => x.id === s)?.label ?? "Fossil Group";
