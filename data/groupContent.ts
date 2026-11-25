/** Fossil Group umbrella content. Facts are drawn from the existing Fossil Energy site; CITA is a placeholder until the client supplies details. */

export type GroupCompany = {
  id: string;
  name: string;
  short: string;
  sector: string;
  tagline: string;
  overview: string;
  facts: string[];
  image?: string;
  /** Official website; null until the client confirms it. */
  url: string | null;
  /** Internal pages for companies hosted on this site. */
  internal?: { label: string; href: string }[];
  pending?: boolean;
};

export const group = {
  name: "Fossil Group",
  headline: "Fuel, lubricants & LPG for Pakistan.",
  intro:
    "Fossil Group runs fuel stations and bulk oil storage, supplies Clover lubricants, and delivers LPG to homes and businesses through Quick Gases.",
  phone: "+92 111-367-745",
  phoneHref: "tel:+92111367745",
  email: "info@fossilpk.com",
  address: "23-B, Lalazar, Off M.T. Khan Road, Karachi",
};

/** The group's business lines, shown on the first screen so visitors know at a glance what the group does. */
export const businessLines = [
  { id: "fuel", title: "Fuel stations", text: "Petrol & diesel across Pakistan", company: "Fossil Energy", href: "#stations" },
  { id: "storage", title: "Oil storage", text: "Bulk terminals at Mehmoodkot & Gatti", company: "Fossil Energy", href: "#stations" },
  { id: "lubricants", title: "Lubricants", text: "Engine & industrial oils", company: "Clover Pakistan", href: "#fuel-finder" },
  { id: "lpg", title: "LPG", text: "Cylinders & bulk gas supply", company: "Quick Gases", href: "#companies" },
] as const;

export const companies: GroupCompany[] = [
  {
    id: "fossil-energy",
    name: "Fossil Energy",
    short: "FE",
    sector: "Oil marketing",
    tagline: "Fuel retail and bulk storage.",
    overview:
      "Fossil Energy (Private) Limited runs fuel retail and bulk oil storage, with operational terminals at Mehmoodkot and Gatti and a growing station network.",
    facts: ["Fuel retail network", "Mehmoodkot & Gatti terminals", "OGRA-licensed OMC"],
    image: "/source-media/6426128e1eeaca.jpg",
    url: "https://fossilpk.com",
    internal: [
      { label: "Explore Version 1", href: "/3d" },
      { label: "Explore Version 2", href: "/2d" },
    ],
  },
  {
    id: "clover",
    name: "Clover Pakistan",
    short: "CP",
    sector: "Lubricants & distribution",
    tagline: "Lubricants, FMCG and industrial chemicals.",
    overview:
      "Clover Pakistan Limited is listed on the Pakistan Stock Exchange and was established in 1986. Fossil Energy holds a majority stake, and Clover's national branch network distributes lubricants, FMCG and office automation products.",
    facts: ["PSX-listed since 1986", "Five operating divisions", "National branch network"],
    image: "/source-media/dcfdf023a55900.png",
    url: "https://www.cloverpk.com",
  },
  {
    id: "cita",
    name: "CITA",
    short: "CI",
    sector: "To be confirmed",
    tagline: "Company details to be added.",
    overview:
      "Placeholder: the client will supply CITA's description, logo and website. This panel shows how it will appear alongside the other group companies.",
    facts: ["Description pending", "Logo pending", "Website pending"],
    url: null,
    pending: true,
  },
  {
    id: "quick-gases",
    name: "Quick Gases",
    short: "QG",
    sector: "LPG",
    tagline: "LPG for homes and businesses.",
    overview:
      "Quick Gases supplies LPG for households and for commercial, industrial, agricultural and transport uses, with cylinder, storage, filling and refill services.",
    facts: ["Residential cylinders & refills", "Commercial & industrial supply", "Storage and filling"],
    image: "/source-media/bdf492467f8bec.jpg",
    url: null,
  },
];
