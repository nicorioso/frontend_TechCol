import { useEffect, useState } from 'react';

import ConsultationSection from '../IU/consult/ConsultationSection';
import FeaturesGrid from '../IU/grid/FeaturedGrid';
import ProductShowcase from '../IU/cards/ProductShowcase';
import ImageComponent from '../IU/image';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="w-full">

      <FeaturesGrid />

      <div className="w-full">
        {error && (
          <div className="w-full bg-red-100 text-red-800 p-4 text-center">
            <p>⚠️ {error}</p>
          </div>
        )}
      </div>

      <ConsultationSection 
        title="¿Necesitas asesoramiento?"
        description="Nuestro equipo de expertos está disponible para ayudarte a elegir los mejores componentes"
        buttonText="Contactar soporte"
      />
    </div>
  );
}

export default Home;