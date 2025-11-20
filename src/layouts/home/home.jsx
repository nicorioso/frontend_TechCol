import { useState } from "react";
import { Send } from "lucide-react";

// components
import MainHeader from "../../components/IU/headers/Main";
import HeroSection from "../../components/home/page";
import MainFooter from "../../components/IU/footers/MainFooter";

export function HomePage() {
  return (
    <>
      <main className="flex flex-col min-h-screen">
        {/* contenido */}
        <MainHeader/>
        <HeroSection/>
        <MainFooter/>
      </main>
    </>
  );
}

export default HomePage;