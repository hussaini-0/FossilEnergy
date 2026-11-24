import ScrollExperience from "@/components/ScrollExperience";
import LiquidPrecision from "@/components/LiquidPrecision";
import Locator from "@/components/Locator";
import ContentDirectory from "@/components/ContentDirectory";
import { Footer, Switcher } from "@/components/Shell";
export default function Page() {
  return (
    <div className="theme editorial liquid-theme">
      <ScrollExperience />
      <LiquidPrecision />
      <Locator />
      <ContentDirectory variant="2d" />
      <Footer variant="2d" />
      <Switcher variant="2d" />
    </div>
  );
}
