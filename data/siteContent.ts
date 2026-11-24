export type ContentSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  columns?: string[];
  rows?: string[][];
};
export type ContentPage = {
  slug: string;
  title: string;
  group: string;
  /** Slug of the page this one is listed under (e.g. a biography under its team page). */
  parent?: string;
  intro: string;
  sections: ContentSection[];
  note?: string;
  source?: string;
  mediaKey?: string;
};
const section = (
  title: string,
  paragraphs: string[] = [],
  items?: string[],
): ContentSection => ({ title, paragraphs, items });
const table = (
  title: string,
  columns: string[],
  rows: string[][],
): ContentSection => ({ title, columns, rows });
export const contentGroups = [
  "Company",
  "Governance",
  "Retail & storage",
  "Products & LPG",
  "News & responsibility",
  "Connect",
];
/**
 * Orders pages so each child follows its parent. A child whose parent is not
 * in `pages` (e.g. filtered out by a search) is listed at the top level.
 */
export function nestPages(pages: ContentPage[]) {
  const slugs = new Set(pages.map((p) => p.slug));
  const out: { page: ContentPage; child: boolean }[] = [];
  for (const page of pages) {
    if (page.parent && slugs.has(page.parent)) continue;
    out.push({ page, child: false });
    for (const c of pages)
      if (c.parent === page.slug) out.push({ page: c, child: true });
  }
  return out;
}
export const contentPages: ContentPage[] = [
  {
    slug: "company-overview",
    title: "Company overview",
    group: "Company",
    mediaKey: "home",
    source: "https://fossilpk.com/",
    intro:
      "An energy business built around investment, infrastructure, and national progress.",
    sections: [
      section("Fossil Energy (Private) Limited", [
        "Established in 2013, FEPL is a privately held Pakistani oil marketing company. Its sponsors set out to develop a diversified portfolio that delivers investor returns while contributing to the economy and everyday life.",
      ]),
      section("Our vision", [
        "To rank among Pakistan’s leading oil marketing and storage businesses, supporting development and energy security. The group seeks further energy investments, financial strength, and long-term stakeholder value.",
      ]),
      section("Our mission", [
        "To make an enduring contribution to the industry and its operating markets, and earn the confidence of business partners.",
      ]),
      section(
        "Our values",
        [],
        [
          "Customer focus",
          "Integrity",
          "Operational excellence",
          "Team building",
          "Care for people",
          "A commitment to improvement",
        ],
      ),
    ],
  },
  {
    slug: "corporate-information",
    title: "Corporate information",
    group: "Company",
    intro:
      "Company identity, registration, banking relationships, and professional advisers.",
    note: "The source contains different adviser, auditor, and banker lists in separate sections. Both are retained below for review; no version has been assumed authoritative.",
    sections: [
      table(
        "Company particulars",
        ["Field", "Published information"],
        [
          ["Legal name", "Fossil Energy (Private) Limited"],
          ["Incorporated", "2013"],
          ["Business", "Oil Marketing Company"],
          [
            "Legal status",
            "Private Limited Company; mainly family-owned shareholding",
          ],
          ["Authorized capital", "PKR 500,000,000"],
          ["Company registration", "0081629"],
          ["National Tax Number", "4223966-4"],
          ["Sales Tax Number", "3277876165486"],
          [
            "Registered / head office",
            "23-B, Lalazar, Off M.T. Khan Road, Karachi",
          ],
          ["Telephone / UAN", "+92 (21) 8618701 / +92 111-367-745"],
        ],
      ),
      section(
        "Banking relationships",
        [],
        [
          "Faysal Bank Limited",
          "Habib Metropolitan Bank",
          "MCB Bank Limited",
          "Askari Bank Limited",
          "Bank Alfalah Limited",
          "Bank of Punjab",
          "National Bank of Pakistan",
          "Sindh Bank Limited",
        ],
      ),
      section(
        "Professional advisers — source list A",
        [],
        [
          "Legal: Mohsin Tayyab Ali (MTC), Karachi; corporate legal consultant, barristers and advocates.",
          "Auditors: Muhammad Shoaib & Co., Chartered Accountants, Karachi.",
        ],
      ),
      section(
        "Professional advisers — source list B",
        [],
        [
          "Legal: Imran & Co. Advocates, Office 507, Al-Fatima Chamber, near Passport Office, Saddar, Karachi.",
          "Auditors: SM Sohail & Co., Suites 1111–1112, 11th Floor, Park Avenue, Shahrah-e-Faisal, Karachi, Sindh 76560.",
        ],
      ),
    ],
  },
  {
    slug: "board-of-directors",
    title: "Board of directors",
    group: "Company",
    intro: "Board biographies published on the existing corporate website.",
    note: "The board page identifies Nadeem Ahmed Butt and Salim Chamdia; the management page separately identifies Saleem A. Butt and Shehzad Mohsin as Chairman and CEO. These conflicting source listings require company confirmation.",
    sections: [
      section("Nadeem Ahmed Butt — Chairman", [
        "A retired banker with over 38 years in senior roles, including MCB and NIB Bank. His background spans audit, corporate risk, trade finance, treasury, and profit-centre management. A commerce graduate with local and overseas banking training, he is also listed as chair of the Board Audit Committee.",
      ]),
      section("Salim Chamdia — Director & CEO", [
        "An ICAP fellow with over 28 years across financial and commodity markets, banking, investment advisory, and textiles. His experience covers financial control, reporting, and staff leadership. The biography records his chairmanship of the Pakistan Stock Exchange, founding chairmanship of the Pakistan Mercantile Exchange, and executive-director role at Summit Bank.",
      ]),
    ],
  },
  {
    slug: "management-team",
    title: "Management team",
    group: "Company",
    intro:
      "Leadership across commercial operations, governance, marketing, finance, and safety.",
    note: "Multiple leadership versions appear on the live page. The leadership section and earlier biographies are preserved separately, with tenure and experience figures treated as published historical descriptions.",
    sections: [
      table(
        "Leadership section on the source page",
        ["Name", "Published role", "Background"],
        [
          [
            "Saleem A. Butt",
            "Chairman & Sponsor",
            "Chartered Accountant; Shell, Emaar and Hascol",
          ],
          [
            "Shehzad Mohsin",
            "Chief Executive Officer",
            "Strategy, business development and value chains; 24+ years",
          ],
          [
            "Areeba Butt",
            "Head of Planning & Compliance",
            "Finance transformation, risk assurance and reporting; EY London",
          ],
          [
            "Hassan Abbas",
            "General Manager",
            "HR, commercial sales and retail development; engineering background",
          ],
          [
            "Rashid Akbar",
            "GM Operations",
            "Refinery/import supplies and terminal operations; electrical engineering",
          ],
          [
            "Bushra Rehman",
            "GM Marketing",
            "IBA MBA; corporate marketing, non-fuel retail and media",
          ],
          [
            "Raghib Noor Uddin",
            "HSSE Advisor",
            "30+ years; Shell and Fossil safety, training and operations",
          ],
        ],
      ),
      table(
        "Additional biographies retained on the source",
        ["Name / role", "Published background"],
        [
          [
            "Saad Swati — COO",
            "15+ years in oil and gas; Shell and Hascol; MSc International Marketing, London South Bank University.",
          ],
          [
            "Owais Ali Khan — CFO",
            "Previously Dubai Islamic Bank for eight years; began at Harvest Topworth in 2001; Master’s in Commerce; finance, risk and planning.",
          ],
          [
            "Rashid Akbar — GM Supply & Operations",
            "10+ industry years; responsibility for refinery/import supplies, Mehmoodkot and Gatti installations.",
          ],
          [
            "Bushra Rehman — GM Marketing & NFR",
            "15+ years; BP Pakistan and Hascol; creative, editorial, corporate marketing and non-fuel retail.",
          ],
          [
            "Hassan Abbas — HR, Operations & Commercial Sales",
            "Joined in 2017; BE from PAF-KIET and MS in Control Systems from PNEC-NUST; engineering automation and pharmaceutical experience.",
          ],
          [
            "Rukaiya / Ruqaiya Chamdia — Manager HR & Operations",
            "Joined 2023; University of British Columbia graduate (2020); EY and BASF experience; recruitment, benefits, payroll and onboarding.",
          ],
          [
            "Tariq Ghauri — Multan Regional Manager",
            "Regional contact details are listed in Corporate Offices.",
          ],
        ],
      ),
      section(
        "Published team indicators",
        [],
        [
          "7+ leadership professionals",
          "150+ years of combined experience",
          "Multidisciplinary energy, retail and operations expertise",
        ],
      ),
    ],
  },
  {
    slug: "advisors",
    title: "Advisors",
    group: "Company",
    intro:
      "Specialist experience supporting financial, commercial, and operational decisions.",
    sections: [
      section("Saleem Butt — Financial / Business Advisor", [
        "A Chartered Accountant whose career includes six years at a firm now within PwC, fourteen years in Shell companies, COO of Emaar Pakistan, and CEO of Hascol. His work spans finance, corporate affairs, supply chains, sales, people management, IT, and ERP implementation.",
      ]),
      section("Shehzad Mohsin — Business Advisor", [
        "The advisory biography describes more than 24 years in strategy, value-chain development, commercial relationships, and team leadership. Areas include P&L management, customer focus, price risk, trading, oil-market analysis, controls, contracts, and sales/operations planning.",
      ]),
      section("Farid Shamim / Shameem — Operations Advisor", [
        "Listed by the source as an operations consultant; the page uses both spellings of the name.",
      ]),
    ],
  },
  {
    slug: "saleem-butt",
    title: "Saleem Butt",
    group: "Company",
    parent: "advisors",
    intro: "Financial and business advisory biography from the existing site.",
    sections: [
      section("Professional background", [
        "The source describes a career across finance, corporate affairs, supply chain, sales, HR, administration, IT, and ERP. It includes six years in a chartered-accountancy firm now associated with PwC, fourteen years with Shell companies in Pakistan and abroad, COO responsibilities at Emaar Pakistan, and leadership of Hascol Petroleum.",
      ]),
      section("Qualifications and board experience", [
        "A commerce graduate of the University of Karachi and a Chartered Accountant, he became an ICAP associate in 1992 and fellow in 2004. The biography also records non-executive directorships at listed Pakistani companies.",
      ]),
    ],
  },
  {
    slug: "team/nadeem-ahmed-butt",
    title: "Nadeem Ahmed Butt",
    group: "Company",
    parent: "board-of-directors",
    intro: "Board biography published by Fossil Energy.",
    sections: [
      section("Banking and governance", [
        "Over 38 years in senior banking positions including MCB and NIB Bank, with expertise in audit, corporate risk, trade finance, treasury, and profit-centre management. The biography notes contributions to institutional policy and strategy, a commerce degree, banking training in Pakistan and abroad, and chairmanship of the Board Audit Committee.",
      ]),
    ],
  },
  {
    slug: "team/salim-chamdia",
    title: "Salim Chamdia",
    group: "Company",
    parent: "board-of-directors",
    intro: "Director and chief-executive biography published by Fossil Energy.",
    sections: [
      section("Markets and financial leadership", [
        "An ICAP fellow with over 28 years spanning financial and commodity markets, investment advisory, banking, and textiles. His background includes financial reporting, control, and staff leadership, chairmanship of the Pakistan Stock Exchange, founding chairmanship of the Pakistan Mercantile Exchange, and an executive-director role at Summit Bank.",
      ]),
    ],
  },
  {
    slug: "the-pillars-of-fepl-operations",
    title: "The pillars of FEPL operations",
    group: "Governance",
    intro:
      "Discipline, organizational capability, and performance underpin the governance model.",
    sections: [
      section(
        "Three operating foundations",
        [],
        [
          "Strong governance: structures and oversight that support disciplined decisions.",
          "Growth and return on equity: an emphasis on business performance and investor outcomes.",
          "Organizational capabilities: people and systems that support flexibility, excellence, and continued development.",
        ],
      ),
    ],
  },
  {
    slug: "corporate-governance-framework",
    title: "Corporate governance framework",
    group: "Governance",
    intro:
      "Oversight for a diversified business portfolio and long-term stakeholder value.",
    sections: [
      section("Governance and investment", [
        "FEPL’s sponsors link portfolio diversification with investment returns and Pakistan’s economic development. The source’s organizational framework diagrams are retained in the gallery below so their reporting relationships remain available.",
      ]),
    ],
  },
  {
    slug: "compliance-risk-management",
    title: "Compliance & risk management",
    group: "Governance",
    intro:
      "Risk controls protect operations, employees, and surrounding communities.",
    sections: [
      section(
        "Control framework",
        [],
        [
          "Identify, quantify, and manage business risks.",
          "Management and the board audit/compliance committee oversee policy implementation.",
          "A risk-based control structure reinforces responsibility and accountability.",
          "Internal policies address company controls, statutory obligations, and external regulatory requirements.",
        ],
      ),
    ],
  },
  {
    slug: "our-it",
    title: "IT infrastructure",
    group: "Governance",
    intro:
      "SAP S/4 connects the head office, regional offices, and storage terminals.",
    sections: [
      section("Connected operations", [
        "The group reports deployment of the SAP S/4 ERP Business Suite across its locations. Round-the-clock access to operational information supports timely decisions and customer service.",
      ]),
      section("Implementation milestone", [
        "The homepage records the selection of EY Ford Rhodes as implementation partner in January 2019 and reports subsequent implementation at the head office and nationwide locations.",
      ]),
    ],
  },
  {
    slug: "government-licenses",
    title: "Government licenses",
    group: "Governance",
    intro: "Published OGRA authorization and storage-license documents.",
    note: "The published authorization for 577 Punjab stations is a licensed capacity, not a verified count of operating outlets.",
    sections: [
      section(
        "Published authorizations",
        [],
        [
          "OGRA oil marketing company authorization.",
          "Permission stated for 577 fuel stations in Punjab.",
          "Storage ownership and operating licenses for Mehmodkot and Gatti.",
        ],
      ),
      section("License documents", [
        "The original Mehmodkot and Gatti license PDFs are available below.",
      ]),
    ],
  },
  {
    slug: "ogra-crs",
    title: "OGRA complaint resources",
    group: "Governance",
    intro:
      "English and Urdu complaint forms and the regulator resources linked by the existing site.",
    note: "The source link labeled “OGRA’s CRP Regulations” points to a lubricant-license PDF. It is retained with a mismatch label; it must not be mistaken for complaint regulations.",
    sections: [
      section("Complaint support", [
        "Access the original English or Urdu complaint form below. For the correct complaint regulations or assistance with a complaint, contact FEPL using the contact directory.",
      ]),
    ],
  },
  {
    slug: "retail-sales-strategy",
    title: "Retail sales strategy",
    group: "Retail & storage",
    intro:
      "Retail network development, outlet formats, and published growth projections.",
    note: "The volume projections below belong to 2020–2024. The source gives no unit and does not identify them as actual sales.",
    sections: [
      section("Network development", [
        "The page describes permission to commence marketing in Punjab and develop nearly 600 outlets. It links that permission to the start of its marketing network.",
      ]),
      table(
        "Historical five-year volume projections",
        ["Year", "Published projection"],
        [
          ["2020", "600,000"],
          ["2021", "1,200,000"],
          ["2022", "1,300,000"],
          ["2023", "1,400,000"],
          ["2024", "1,500,000"],
        ],
      ),
      section(
        "Outlet formats",
        [],
        ["Full fuel station", "Small station", "Agri station"],
      ),
    ],
  },
  {
    slug: "fossil-fuel-station-layout",
    title: "Fossil fuel station layout",
    group: "Retail & storage",
    intro: "A full-service forecourt concept with a 200-foot frontage.",
    sections: [
      section(
        "Site facilities",
        [],
        [
          "Three to six dispensers",
          "Tyre care and oil-changing facilities",
          "Fossil office and monolith signage",
          "Generator set",
          "Car wash",
          "Green belts and parking",
          "Ecomart convenience retail",
          "Dera and outdoor seating",
        ],
      ),
      section("The customer experience", [
        "The Ecomart concept combines contemporary design with everyday products. The Dera includes locally styled outdoor seating and a non-permanent kitchen. Source site plans and visual references are included below.",
      ]),
    ],
  },
  {
    slug: "small-station-layout",
    title: "Small station layout",
    group: "Retail & storage",
    intro: "A compact forecourt concept with a 100-foot frontage.",
    sections: [
      section(
        "Site facilities",
        [],
        [
          "Three to six dispensers",
          "Tyre care",
          "Fossil office",
          "Generator set",
          "Ecomart",
          "Car wash",
          "Fossil monolith signage",
        ],
      ),
      section("Planning references", [
        "The source’s small-station renderings and layout drawings are retained below for inspection.",
      ]),
    ],
  },
  {
    slug: "fuel-station-agri-layout",
    title: "Agri station layout",
    group: "Retail & storage",
    intro:
      "A rural-service format combining fuel infrastructure with agricultural and local-business facilities.",
    sections: [
      section(
        "Agri facilities",
        [],
        [
          "Fossil Agri canopy and dispensers",
          "Gestetner photocopy shop",
          "Tyre care",
          "Solar power support and generator set",
          "Fossil godam / storage",
          "Fossil office and pole sign",
          "Fossil Rozgar Scheme",
        ],
      ),
      section("Site references", [
        "See the original diagrams and site illustrations below.",
      ]),
    ],
  },
  {
    slug: "oil-storages",
    title: "Oil storages",
    group: "Retail & storage",
    intro:
      "Strategic terminals and development locations supporting energy distribution.",
    sections: [
      table(
        "Published storage footprint",
        ["Location", "Status"],
        [
          ["Mehmodkot, near Multan", "Operational storage"],
          ["Gatti, near Faisalabad", "Operational storage"],
          ["Thaliyan, near Islamabad", "FEPL equity partnership"],
          ["Machike", "Land acquired for storage development"],
          ["Habibabad", "Land acquired for storage development"],
          ["Vehari", "Land acquired for storage development"],
          [
            "Dar, Al Janna",
            "Land acquired for storage development — source wording",
          ],
        ],
      ),
    ],
  },
  {
    slug: "storage-gatti",
    title: "Gatti terminal",
    group: "Retail & storage",
    intro:
      "Located near PARCO’s pipeline station at Gatti, Faisalabad; published construction cost PKR 2.0 billion.",
    note: "The source’s 27,600 MT total differs from the sum of its HSD and MS figures (32,800 MT). Both are preserved as published; capacity requires confirmation.",
    sections: [
      table(
        "Terminal specifications",
        ["Item", "Published value"],
        [
          ["Total storage", "27,600 MT"],
          ["HSD configuration", "24,300 MT"],
          ["MS configuration", "8,500 MT"],
          ["Receipts", "Pipeline from PARCO terminal at Gutty and tank trucks"],
          ["Loading", "10 metered loading bays for HSD and MS"],
          ["Construction cost", "PKR 2.0 billion"],
        ],
      ),
    ],
  },
  {
    slug: "storage-mehmoodkot",
    title: "Mehmoodkot terminal",
    group: "Retail & storage",
    intro:
      "Located near PARCO’s refinery at Mehmoodkot, Qasba Gujrat, Multan; published construction cost PKR 3.0 billion.",
    note: "Receipt connectivity is reproduced as stated by the source, which refers to the PARCO terminal at Gutty; the routing description requires confirmation.",
    sections: [
      table(
        "Terminal specifications",
        ["Item", "Published value"],
        [
          ["Total storage", "32,800 MT"],
          ["HSD configuration", "24,300 MT"],
          ["MS configuration", "8,500 MT"],
          ["Receipts", "Pipeline from PARCO terminal at Gutty and tank trucks"],
          ["Loading", "10 metered loading bays for HSD and MS"],
          ["Construction cost", "PKR 3.0 billion"],
        ],
      ),
    ],
  },
  {
    slug: "fuel-price",
    title: "Fuel products & published prices",
    group: "Products & LPG",
    intro: "The fuel-price information available on the existing website.",
    note: "Historical source snapshot, effective 30 July 2026. These are not verified current pump prices; contact FEPL for today’s prices.",
    sections: [
      table(
        "Published price snapshot",
        ["Product", "PKR per litre", "Source effective date"],
        [
          ["Premier Motor Gasoline", "335.06", "30 July 2026"],
          ["High Speed Diesel", "390.62", "30 July 2026"],
        ],
      ),
      section(
        "Product names in the presentation brief",
        [],
        ["Primo Diesel", "Octo 97", "Optimo 92"],
      ),
    ],
  },
  {
    slug: "lubricants",
    title: "Clover Lubricants",
    group: "Products & LPG",
    intro:
      "Automotive, industrial, and agricultural lubricants distributed through Fossil stations and Clover’s national network.",
    note: "The source lists both Asim Khan and Malik Waheed as General Manager contacts in different sections. Both public business contacts are retained for review.",
    sections: [
      section("Distribution partnership", [
        "FEPL works with Clover Pakistan Limited on lubricant supply. The complete published product and packaging list appears below, together with available specification sheets.",
      ]),
      table(
        "Published contacts",
        ["Name", "Email", "Phone"],
        [
          ["Asim Khan", "asim.khan@cloverpk.com", "+92 333 2164124"],
          ["Malik Waheed", "m.waheed@cloverpk.com", "+92 321 2402098"],
        ],
      ),
    ],
  },
  {
    slug: "rtx-lubricants",
    title: "RTX Lubricants",
    group: "Products & LPG",
    intro:
      "German-formulated, locally blended automotive and industrial oils, lubricants, and greases.",
    sections: [
      section("Product range", [
        "The source covers motorcycle, passenger-car, diesel, transmission, gear, and hydraulic oils. Product names, published grades, and pack sizes are retained in the catalog below.",
      ]),
      table(
        "Commercial contact",
        ["Name", "Email", "Phone"],
        [
          [
            "Malik Waheed — General Manager, Clover Lubricants",
            "m.waheed@cloverpk.com",
            "+92 321 2402098",
          ],
        ],
      ),
    ],
  },
  {
    slug: "clover-pakistan-limited",
    title: "Clover Pakistan Limited",
    group: "Company",
    intro: "A Pakistan Stock Exchange-listed company established in 1986.",
    sections: [
      section("Business portfolio", [
        "The source describes a turnaround following FEPL’s acquisition of a majority stake. It references four operating divisions and the later introduction of a fifth, industrial chemicals.",
      ]),
      section("Market reach", [
        "Clover’s branch network supports national distribution, including office automation and FMCG. Further company disclosures are available from Clover’s official website.",
      ]),
    ],
  },
  {
    slug: "lpg-commercial",
    title: "Commercial LPG",
    group: "Products & LPG",
    intro:
      "QuickGases supplies commercial, industrial, agricultural, and transport energy applications.",
    sections: [
      section(
        "Commercial service",
        [],
        [
          "Storage, filling and distribution capabilities",
          "Tailored fuel plans and delivery schedules",
          "Dedicated account management",
          "Installation guidance and technical support",
          "Safety across storage, transport, handling and delivery",
          "Source-described emergency support; confirm local coverage",
        ],
      ),
      section(
        "Industries served",
        [],
        [
          "Construction: temporary heating and site support",
          "Fleet vehicles: propane autogas",
          "Industry: production and processing",
          "Agriculture: crop drying, greenhouses, irrigation and processing",
          "Landscaping: equipment fuel",
          "Forklifts: cylinder exchange and bulk supply",
        ],
      ),
      section("New and existing customers", [
        "The source invites businesses to discuss tank leasing, refills, order support, and billing. Contact the commercial team to confirm available programs and arrange a supply plan.",
      ]),
    ],
  },
  {
    slug: "lpg-residential",
    title: "Residential LPG",
    group: "Products & LPG",
    intro:
      "QuickGases household energy, cylinder, storage, and refill services.",
    note: "Auto-fill, tank-monitoring apps, equipment sizes, and delivery programs are source-described offerings; availability and operating limits must be confirmed with QuickGases.",
    sections: [
      section(
        "Home energy applications",
        [],
        [
          "Cooking and household appliances",
          "Backup generators",
          "Fireplaces and space heating",
          "Outdoor living equipment",
          "Whole-home heating",
        ],
      ),
      section(
        "Delivery choices",
        [],
        [
          "Auto-fill: source-described monitoring with refills scheduled as levels fall.",
          "Will Call: customers track usage and request fuel when required; optional monitoring may have an additional charge.",
          "Tank monitoring: source-described remote level access, with installation charges possible for customer-owned tanks.",
        ],
      ),
      table(
        "Storage sizes shown by the source",
        ["Nominal size", "Listed use"],
        [
          [
            "1,000 gallons",
            "Larger homes with several appliances and commercial use",
          ],
          [
            "800 gallons",
            "Larger homes with several appliances and commercial use",
          ],
        ],
      ),
      section("Service and handling", [
        "The source emphasizes home delivery, timely refills, customer support, and safe handling. Nominal tank sizes are not safe-fill instructions: approved operating limits and professional handling remain necessary.",
      ]),
    ],
  },
  {
    slug: "health-safety-environment",
    title: "Health, safety & environment",
    group: "News & responsibility",
    intro:
      "The HSSE policy covers people, assets, communities, and environmental responsibilities.",
    sections: [
      section(
        "Policy commitments",
        [],
        [
          "Safe and healthy workplaces with responsible care",
          "Incident prevention and a stronger safety culture",
          "Reduced environmental impact",
          "Compliance with legal obligations, internal standards, and good practice",
        ],
      ),
      section(
        "Implementation commitments",
        [],
        [
          "Annual targets and performance review",
          "Risk reduction and staff awareness/training",
          "Emergency-response readiness",
          "Prevention of accidents, occupational illness, fires, and pollution",
          "Reporting unsafe acts and conditions, with prompt corrective action",
          "Resource conservation, emissions management, and horticulture",
          "Consistent policy application and contractor standards",
          "Regular policy review and shared employee/contractor responsibility",
        ],
      ),
      section("Original policy documents", [
        "Download the HSSE policy and product-handling reference below.",
      ]),
    ],
  },
  {
    slug: "training-compliances",
    title: "Training & compliance",
    group: "News & responsibility",
    intro:
      "Published HSSE training records for Mehmoodkot and Gatti terminals in May 2024.",
    sections: [
      table(
        "Mehmoodkot training record",
        ["Date", "Topics"],
        [
          [
            "13 May 2024",
            "Product handling; hazard analysis; construction safety; staff assessment; TBX and permit-to-work briefings; suggested weekly worker recognition.",
          ],
          [
            "14 May 2024",
            "Permit-to-work classroom and field work; golden rules; safety walkabouts; oil-water separator review; performance reporting templates.",
          ],
          [
            "15 May 2024",
            "FEPL, KHTL and SGS training on safety, tanker filling and handling; checklists; security refresher on vehicle inspections and traffic; incident management.",
          ],
        ],
      ),
      table(
        "Gatti training record",
        ["Date", "Topics"],
        [
          [
            "16 May 2024",
            "Staff HSSE/operational assessment; golden rules and field walkabouts; performance data and reporting; SOP review.",
          ],
          [
            "17–18 May 2024",
            "Product controls; permit-to-work exercises; hazard registers; emergency scenarios; SOP updates; tanker inspections and statutory documentation; extinguisher inspections; staff assessments; daily/weekly/monthly task schedules.",
          ],
          [
            "14 June — year not stated",
            "Rescue 1122 training: CPR, firefighting and hydrant-hose handling; participant certificates.",
          ],
        ],
      ),
    ],
  },
  {
    slug: "news-and-media",
    title: "News, media & CSR",
    group: "News & responsibility",
    mediaKey: "home",
    source: "https://fossilpk.com/",
    intro:
      "Company milestones, outlet highlights, community activity, and announcements.",
    sections: [
      section("SAP implementation — January 2019", [
        "The company selected EY Ford Rhodes as its SAP partner and records an agreement signed in Karachi by Muhammad Jamshed. The website reports rollout at the head office and other locations.",
      ]),
      section(
        "Outlet highlights",
        [],
        [
          "Gurmani Retail Outlet",
          "Bhawal District Retail Outlet",
          "Fossil Al Madina Safdara bad Outlet",
          "Ghazanfar Khar Retail Outlet",
          "Translink Multan",
        ],
      ),
      section(
        "Community and dealer activity",
        [],
        [
          "FEPL dealers’ conference at Mahmood Kot",
          "Plantation near Mehmoodkot storage",
          "Construction of a 1.5 km road for villagers",
        ],
      ),
      section("Announcements", [
        "The source includes company and staff announcements and coverage of Clover Pakistan’s proposed LPG expansion through Quick Gases. Original media images are retained below; undated items are not presented as new announcements.",
      ]),
    ],
  },
  {
    slug: "careers",
    title: "Careers",
    group: "Connect",
    intro:
      "People, collaboration, and professional development at Fossil Energy.",
    sections: [
      section("Working at FEPL", [
        "The company describes a collaborative culture, competitive remuneration, a healthy working environment, and investment in staff development. Recruitment is intended to be transparent and to build future leadership.",
      ]),
      section("Development and opportunity", [
        "Training programs aim to strengthen skills, collaboration, and employees’ contributions to business goals. The source page does not list individual open vacancies. Use the official contact channel to ask about opportunities.",
      ]),
    ],
  },
  {
    slug: "regional-office",
    title: "Corporate offices & contacts",
    group: "Connect",
    intro:
      "The head office, regional locations, and public business contacts listed by FEPL.",
    note: "The live page contains two Lahore addresses and different Rawalpindi road spellings. Current-looking and earlier listings are shown separately; confirm the destination before visiting.",
    sections: [
      table(
        "Office directory",
        ["Office", "Published address / phone"],
        [
          ["Karachi head office", "23-B Lalazar, M.T. Khan Road, Karachi"],
          [
            "Islamabad",
            "Office 301, 3rd Floor, Plot 1-A, Mosaic District, Mir Chakar Khan Road, I-8 Markaz; +92 51 6133860",
          ],
          [
            "Lahore",
            "Office 16, 2nd Floor, The Mall of Lahore, 172 Tufail Road, Cantt; 042-36620720",
          ],
          [
            "Rawalpindi",
            "Ground Floor, Qamar Plaza, IJP Road (also spelled UP Road in source)",
          ],
          ["Multan", "Office 603, United Mall, 74-Abdali Road"],
          ["Hyderabad", "New Church Building, Tilak Incaline, Jacob Road"],
          [
            "Lahore — earlier listing",
            "53 Sharah-E-Quaid-e-Azam, adjacent to State Bank of Pakistan",
          ],
        ],
      ),
      table(
        "Business contact directory",
        ["Contact / function", "Telephone", "Email"],
        [
          [
            "Rashid Akbar — Supply & Operations",
            "021-38658709 ext 606; 0308-0324428",
            "rashid.akbar@fossilpk.com",
          ],
          [
            "Hassan Abbas — HR, Sales & Operations",
            "021-38658896 / 38658702 ext 639; WhatsApp +92 313 8126221",
            "hassan.abbas@fossilpk.com",
          ],
          [
            "Imran Khalid — Senior Manager, Lahore",
            "042-37324394 / 37352990; direct 042-37230116; mobile 0342-3207483; fax 042-37232990",
            "Imran.khalid@fossilpk.com",
          ],
          [
            "Athar Butt — Regional Manager, Lahore",
            "042-37324394 / 37352990; direct 042-37230116; mobile 0333-4238488; fax 042-37232990",
            "athar.butt@fossilpk.com",
          ],
          [
            "Wahab Siddiqui — Hyderabad Branch Manager",
            "021-111367745 ext 815; 0301-2337408",
            "wahab.siddiqui@fossilpk.com",
          ],
          [
            "Ashfaq Ahmed Sheikh — Retail & Development",
            "Islamabad: +92 51 6133860; +92 300 8567460",
            "Ashfaq.sheikh@fossilpk.com",
          ],
          [
            "Ashfaq Ahmed Sheikh — earlier Rawalpindi listing",
            "051-4856501-2; direct 051-4856504; fax 051-4856503; 0300-8567460",
            "asfaq.sheikh@gestetner.com.pk",
          ],
          [
            "Tariq Ghauri — Multan Regional Manager",
            "0321-6327818",
            "tariq@fossilpk.com",
          ],
        ],
      ),
    ],
  },
  {
    slug: "contact-us",
    title: "Contact Fossil Energy",
    group: "Connect",
    intro: "Connect with the corporate team or find a regional office.",
    sections: [
      table(
        "Corporate contact",
        ["Channel", "Details"],
        [
          ["Address", "23-B, Lalazar, off M.T. Khan Road, Karachi, Pakistan"],
          ["Telephone", "+92 (21) 38658896 / +92 (21) 38658702"],
          ["UAN", "+92 111-367-745"],
          ["Fax", "+92 (21) 35631960"],
          ["Email", "info@fossilpk.com"],
        ],
      ),
    ],
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & conditions",
    group: "Connect",
    intro:
      "An overview of the agreement topics described on the existing website.",
    note: "The source provides general categories, not a complete website-use contract. Binding terms depend on the applicable agreement and regulation.",
    sections: [
      section(
        "Topics covered by the source",
        [],
        [
          "Fuel supply: price, delivery and quality",
          "Power purchase: payment, pricing and duration",
          "Environmental obligations: emissions and waste",
          "Operations and maintenance: responsibilities and performance",
          "Insurance and liability",
          "Government incentives and subsidies",
          "Technology/equipment supply, maintenance and warranty",
          "Regulatory compliance",
          "Financing, payment and non-compliance provisions",
          "Contract duration",
        ],
      ),
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy policy",
    group: "Connect",
    mediaKey: "home",
    source:
      "https://fossilpk.com/wp-content/uploads/2023/08/Privacy-Policy.pdf",
    intro: "The privacy-policy document linked from the official website.",
    sections: [
      section("Official document", [
        "The original policy PDF is available below. It is retained as a source document rather than replaced with newly invented legal terms.",
      ]),
    ],
  },
];
