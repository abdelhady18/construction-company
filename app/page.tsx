import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { getSettings } from "@/lib/settings";

export default async function Home() {
  const settings = await getSettings();

  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Projects />
      <About />
      <Contact settings={settings} />
      <Footer />
    </>
  );
}
