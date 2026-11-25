/** Fossil Group design variants: "a" is served at /, the rest at /group/<id>. */
export type Design = "a" | "b" | "c" | "d";
export const DESIGNS: { id: Design; name: string }[] = [
  { id: "a", name: "Night" },
  { id: "b", name: "Daylight" },
  { id: "c", name: "Signal" },
  { id: "d", name: "Mosaic" },
];
export const designHref = (d: Design) => (d === "a" ? "/" : `/group/${d}`);
