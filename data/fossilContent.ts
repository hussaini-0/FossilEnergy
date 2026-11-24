export {
  contentPages,
  contentGroups,
  nestPages,
  type ContentPage,
  type ContentSection,
} from "./siteContent";
export type Variant = "3d" | "2d";
export const variants: Variant[] = ["3d", "2d"];
/** Single place that builds internal URLs, so renamed pages never leave stale links. */
export const pageHref = (variant: Variant, slug?: string, hash?: string) =>
  `/${variant}${slug ? `/${slug}` : ""}${hash ? `#${hash}` : ""}`;
export const company = {
  name: "Fossil Energy",
  legalName: "Fossil Energy (Private) Limited",
  headline: "Fueling Possibilities. Energizing Pakistan.",
  description:
    "Connecting people, powering industry, and moving a nation forward through fuel retail, bulk oil storage, lubricants, and LPG infrastructure.",
  address: "23-B, Lalazar, Off M.T. Khan Road, Karachi",
  phone: "+92 111-367-745",
  phones: [
    { label: "+92 111-367-745", href: "tel:+92111367745" },
    { label: "+92 (21) 8618701", href: "tel:+92218618701" },
  ],
  email: "info@fossilpk.com",
  vision:
    "To rank among Pakistan’s leading oil marketing and storage companies, contribute to national development and energy security, and pursue sound energy investments that create long-term stakeholder value.",
  mission:
    "To make a lasting contribution to the industry and its operating markets, and earn the confidence of business partners.",
};
export const metrics = [
  {
    value: "800+",
    label: "Retail network vision",
    detail: "Our ambition. A nation connected.",
  },
  {
    value: "Strategic",
    label: "Storage infrastructure",
    detail: "Operational: Mehmodkot · Gatti, Faisalabad",
  },
  {
    value: "4",
    label: "Energy business pillars",
    detail: "Retail · Storage · Lubricants · LPG",
  },
  {
    value: "SAP",
    label: "Integrated operations",
    detail: "Built on corporate governance",
  },
];
export const pillars = [
  {
    id: "retail",
    slug: "retail-sales-strategy",
    name: "Retail Fuel Network",
    short: "Retail",
    tagline: "Every journey starts with energy.",
    description:
      "From daily commutes to the open road, discover a complete forecourt experience designed around the way Pakistan moves.",
    products: [
      "Primo Diesel",
      "Octo 97",
      "Optimo 92",
      "Express Tyres",
      "Car Wash",
      "Mercato",
    ],
    image: "/images/retail.svg",
  },
  {
    id: "storage",
    slug: "oil-storages",
    name: "Oil Storage & Logistics",
    short: "Storage",
    tagline: "The strength behind the supply.",
    description:
      "The existing website lists Mehmodkot and Gatti, Faisalabad as operational storages, Thaliyan as an equity partnership, and Machike as a development location. Shikarpur is included in the brief; its status needs confirmation.",
    products: [
      "Mehmodkot · operational",
      "Gatti · operational",
      "Thaliyan · equity partnership",
      "Machike · development",
      "Shikarpur · to confirm",
    ],
    image: "/images/storage.svg",
  },
  {
    id: "lubricants",
    slug: "lubricants",
    name: "Clover Lubricants",
    short: "Lubricants",
    tagline: "Performance in every moving part.",
    description:
      "Automotive and industrial lubricants from Clover Pakistan Limited, supporting engines, machinery, and the people who keep them moving.",
    products: [
      "Automotive lubricants",
      "Industrial lubricants",
      "Clover Pakistan Limited",
    ],
    image: "/images/lubricants.svg",
  },
  {
    id: "lpg",
    slug: "lpg-residential",
    name: "Quick Gases (LPG)",
    short: "LPG",
    tagline: "Energy that feels closer to home.",
    description:
      "Residential and commercial LPG distribution, with a focus on safe handling and dependable service through Quick Gases.",
    products: ["Residential LPG", "Commercial LPG", "Safe handling"],
    image: "/images/lpg.svg",
  },
];
export const stations = [
  {
    city: "Lahore",
    province: "Punjab",
    lat: 31.5204,
    lng: 74.3587,
    x: 72,
    y: 41,
  },
  {
    city: "Karachi",
    province: "Sindh",
    lat: 24.8607,
    lng: 67.0011,
    x: 30,
    y: 85,
  },
  {
    city: "Multan",
    province: "Punjab",
    lat: 30.1575,
    lng: 71.5249,
    x: 54,
    y: 55,
  },
  {
    city: "Faisalabad",
    province: "Punjab",
    lat: 31.4504,
    lng: 73.135,
    x: 63,
    y: 43,
  },
  {
    city: "Dera Ghazi Khan",
    province: "Punjab",
    lat: 30.0489,
    lng: 70.6455,
    x: 46,
    y: 55,
  },
  {
    city: "Peshawar",
    province: "KPK",
    lat: 34.0151,
    lng: 71.5249,
    x: 57,
    y: 24,
  },
];
export const governance = [
  {
    title: "Responsible governance",
    description:
      "A foundation of accountability, corporate oversight, and SAP-integrated operations.",
  },
  {
    title: "People & communities",
    description:
      "The company website highlights the construction of a 1.5 km road for villagers, connecting infrastructure investment with local needs.",
  },
  {
    title: "A considered footprint",
    description:
      "Plantation activity near Mehmoodkot storage is highlighted on the company website as part of its community and environmental initiatives.",
  },
];
export const fuels = [
  {
    name: "Primo Diesel",
    category: "Diesel",
    grade: "Specification pending approval",
  },
  { name: "Octo 97", category: "Gasoline", grade: "97 — product designation" },
  {
    name: "Optimo 92",
    category: "Gasoline",
    grade: "92 — product designation",
  },
];
