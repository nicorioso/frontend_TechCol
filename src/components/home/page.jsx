import { useState } from "react";
import ConsultationSection from "../IU/consult/ConsultationSection";
import FeaturesGrid from "../IU/grid/FeaturedGrid";

function Home() {
  const [error] = useState(null);

  return (
    <div className="w-full">
      <FeaturesGrid />

      <div className="w-full">
        {error && (
          <div className="w-full bg-red-100 p-4 text-center text-red-800">
            <p>{error}</p>
          </div>
        )}
      </div>

      <ConsultationSection
        title="Necesitas asesoramiento?"
        description="Nuestro equipo de expertos esta disponible para ayudarte a elegir los mejores componentes."
        buttonText="Contactar soporte"
      />
    </div>
  );
}

export default Home;
