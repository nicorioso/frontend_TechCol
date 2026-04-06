import PropTypes from "prop-types";
import { BadgeCheck, ShieldCheck, Truck, Zap } from "lucide-react";
import FeatureCard from "../cards/FeatureCard";

const FeaturesGrid = ({
  features = [
    { title: "Rapido", description: "Entregas rapidas en todo el pais", icon: Zap },
    { title: "Calidad", description: "Productos 100% originales garantizados", icon: ShieldCheck },
    { title: "Envio", description: "Envio gratis en compras mayores a $500k", icon: Truck },
    { title: "Garantia", description: "Garantia de 24 meses en todos los productos", icon: BadgeCheck },
  ],
}) => {
  return (
    <section className="w-full bg-slate-50 py-14 dark:bg-gray-900 lg:py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

FeaturesGrid.propTypes = {
  features: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
    })
  ),
};

export default FeaturesGrid;
