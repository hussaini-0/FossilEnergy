import { mkdirSync, writeFileSync } from "node:fs";
mkdirSync("public/images", { recursive: true });
mkdirSync("public/documents", { recursive: true });
const defs = `<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#29292f"/><stop offset="1" stop-color="#5d5d68"/></linearGradient><linearGradient id="tank"><stop stop-color="#a7a7b0"/><stop offset=".4" stop-color="#e5e5e9"/><stop offset="1" stop-color="#73737f"/></linearGradient><pattern id="lines" width="35" height="35" patternUnits="userSpaceOnUse"><path d="M35 0H0V35" fill="none" stroke="#eeeeee" stroke-opacity=".06"/></pattern></defs>`;
const tank = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0V130C0 155 150 155 150 130V0Z" fill="url(#tank)"/><ellipse cx="75" cy="0" rx="75" ry="24" fill="#c7c7ce"/><ellipse cx="75" cy="0" rx="65" ry="18" fill="none" stroke="#eeeeF2" stroke-opacity=".6"/><path d="M0 50Q75 75 150 50M0 100Q75 125 150 100" fill="none" stroke="#62626e" stroke-opacity=".3"/><path d="M120 0V120M127 0V118" stroke="#51515c" stroke-width="2"/>${Array.from({ length: 12 }, (_, i) => `<path d="M120 ${i * 10}h7" stroke="#51515c"/>`).join("")}</g>`;
const station = `<g transform="translate(95 170)"><path d="M0 25 200-25 390 10 190 65Z" fill="#fafafa"/><path d="M0 25V45L190 85 390 30V10L190 65Z" fill="#ff141e"/><path d="M28 52V165M345 44V155" stroke="#dedee3" stroke-width="9"/><path d="M130 100h58v65h-58Z" fill="#d0d0d8"/><path d="M140 109h36v20h-36Z" fill="#34343c"/><path d="M180 117q25-5 22 24v10" fill="none" stroke="#25252c" stroke-width="5"/><text x="175" y="52" fill="#ff141e" font-family="Arial" font-size="15" font-weight="700" transform="rotate(-8 175 52)">FOSSIL</text></g>`;
const bg = `<rect width="640" height="420" fill="url(#sky)"/><rect width="640" height="420" fill="url(#lines)"/><circle cx="500" cy="90" r="48" fill="#ff141e" opacity=".8"/><path d="M0 270 140 230 300 275 440 230 640 265V420H0Z" fill="#28282f"/><path d="M0 375 300 280 640 345" fill="none" stroke="#82828d" stroke-width="70"/><path d="M0 375 300 280 640 345" fill="none" stroke="#eeeeF2" stroke-width="2" stroke-dasharray="14 15"/>`;
const image = (name, inside) =>
  writeFileSync(
    `public/images/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">${defs}${bg}${inside}</svg>`,
  );
image("retail", station);
image(
  "storage",
  `${tank(80, 160, 0.9)}${tank(230, 125, 1.1)}${tank(420, 185, 0.8)}<path d="M90 320V300H460V330" fill="none" stroke="#ff141e" stroke-width="8"/>`,
);
image(
  "lubricants",
  `<g transform="translate(180 90)"><path d="M30 50 75 15H180L210 50V230Q110 265 10 230V70Z" fill="#df202b"/><path d="M80 25h75v35H80Z" fill="#303038"/><path d="M10 110h200v90H10Z" fill="#29292f"/><text x="110" y="150" text-anchor="middle" font-family="Arial" fill="#ffffff" font-size="27" font-weight="700">CLOVER</text><text x="110" y="175" text-anchor="middle" font-family="Arial" fill="#ffffff" font-size="11" letter-spacing="3">LUBRICANTS</text></g>`,
);
image(
  "lpg",
  `<g transform="translate(230 95)"><rect x="40" y="0" width="70" height="42" rx="8" fill="none" stroke="#c6c6d0" stroke-width="10"/><rect x="0" y="35" width="150" height="220" rx="55" fill="url(#tank)"/><path d="M0 100h150v95H0Z" fill="#ff141e"/><text x="75" y="140" text-anchor="middle" font-family="Arial" fill="#ffffff" font-size="22" font-weight="700">QUICK</text><text x="75" y="168" text-anchor="middle" font-family="Arial" fill="#ffffff" font-size="20">GASES</text><rect x="20" y="245" width="110" height="15" rx="3" fill="#6c6c79"/></g>`,
);
writeFileSync(
  "public/images/energy-landscape.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="900" viewBox="0 0 800 900">${defs}<rect width="800" height="900" fill="url(#sky)"/><rect width="800" height="900" fill="url(#lines)"/><circle cx="570" cy="200" r="110" fill="#ff141e"/><path d="M0 460 200 310 330 400 530 310 800 390V900H0Z" fill="#41414a"/><path d="M-100 900Q700 660 370 540T850 360" fill="none" stroke="#25252d" stroke-width="125"/><path d="M-100 900Q700 660 370 540T850 360" fill="none" stroke="#e0e0e8" stroke-width="2" stroke-dasharray="20 20"/>${tank(95, 340, 1.05)}${tank(250, 305, 0.8)}<g transform="translate(170 300) scale(.95)">${station}</g><g stroke="#aaaab5" fill="none"><path d="M655 240v170m-40-130h80m-70 35h60m-80 95 45-170 45 170m-75-110 55 65m-10-65-55 65" stroke-width="3"/><path d="M695 280Q750 320 800 290M615 280Q560 320 510 310"/></g><path d="M0 830 160 760 220 900H0Z" fill="#4f4f5b"/><path d="M650 730 800 650V900H540Z" fill="#4f4f5b"/></svg>`,
);
// Minimal, valid, text-only PDF placeholders; no external generation dependency.
for (const [slug, title] of [
  ["governance", "Corporate Governance Overview"],
  ["investor", "Investor Information"],
]) {
  const stream = `BT /F1 22 Tf 55 760 Td (FOSSIL ENERGY) Tj 0 -45 Td /F1 17 Tf (${title}) Tj 0 -50 Td /F1 12 Tf (PRESENTATION PLACEHOLDER - NOT AN OFFICIAL DISCLOSURE) Tj 0 -35 Td (This file demonstrates the proposed download experience.) Tj 0 -22 Td (Replace with a reviewed and approved corporate document.) Tj 0 -45 Td (Official website: https://fossilpk.com) Tj ET`;
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objs.forEach((o, i) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((o) => String(o).padStart(10, "0") + " 00000 n \n")
    .join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  writeFileSync(`public/documents/${slug}-placeholder.pdf`, pdf);
}
