import { useState } from "react";
import { Send } from "lucide-react";

// components
import MainHeader from "../../components/IU/headers/Main";
import Home from "../../components/home/page";
import MainFooter from "../../components/IU/footers/MainFooter";

export function HomePage() {
  return (
    <>
      <main className="flex flex-col min-h-screen">
        {/* contenido */}
        <MainHeader/>
        <Home/>
        <MainFooter/>
      </main>
    </>
  );
}

export default HomePage;