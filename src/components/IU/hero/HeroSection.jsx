import PropTypes from 'prop-types';
import Button from '../forms/button';
import ImageComponent from '../image';

const HeroSection = ({ 
  title = 'TechCol',
  subtitle = 'Tu tienda especializada en partes de computador de alta calidad',
  description = 'Encuentra los mejores componentes para armar o mejorar tu PC gamer, workstation o servidor',
  onStartClick = () => {},
  onViewProductsClick = () => {}
}) => {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Efecto de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 py-16 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Contenido de texto */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              {title}
            </h1>
            
            <p className="text-xl text-gray-300">
              {subtitle}
            </p>
            
            <p className="text-lg text-gray-400">
              {description}
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button 
                variant="primary" 
                size="lg"
                onClick={onStartClick}
              >
                Comienza ahora
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={onViewProductsClick}
              >
                Ver productos
              </Button>
            </div>
          </div>

          {/* Logo/Imagen */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square">
                <ImageComponent
                    id="TechCol_logo" alttext="TechCol_logo"
                />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  logoSrc: PropTypes.string,
  onStartClick: PropTypes.func,
  onViewProductsClick: PropTypes.func
};

export default HeroSection;