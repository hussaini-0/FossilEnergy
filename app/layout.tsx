import type { Metadata } from "next";
import "./globals.css";
import "./liquid.css";
import "./demo.css";
export const metadata: Metadata = {
  title: "Fossil Energy | Energizing Pakistan",
  description:
    "Explore Fossil Energy through cinematic and motion-led presentations.",
  robots: { index: false, follow: false },
  icons: { icon: "/images/fossil-logo.png" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
