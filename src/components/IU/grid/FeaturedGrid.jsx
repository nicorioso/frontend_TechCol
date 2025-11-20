import PropTypes from 'prop-types';
import FeatureCard from '../cards/FeatureCard';

// Iconos simples como JSX (sin librería externa)
const LightningIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const ShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const TruckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="1" y="6" width="22" height="12" rx="2"></rect>
    <path d="M1 6V4a2 2 0 0 1 2-2h3l2 3h12V4a2 2 0 0 1 2 2v2"></path>
    <circle cx="6.5" cy="19.5" r="2.5"></circle>
    <circle cx="17.5" cy="19.5" r="2.5"></circle>
  </svg>
);

const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const FeaturesGrid = ({ 
  features = [
    { title: 'Rápido', description: 'Entregas rápidas en toda el país', icon: LightningIcon },
    { title: 'Calidad', description: 'Productos 100% originales garantizados', icon: ShieldIcon },
    { title: 'Envío', description: 'Envío gratis en compras mayores a $500k', icon: TruckIcon },
    { title: 'Garantía', description: 'Garantía de 24 meses en todos los productos', icon: CheckIcon }
  ]
}) => {
  return (
    <section className="w-full bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Grid de características */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
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
  features: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.elementType
  }))
};

export default FeaturesGrid;