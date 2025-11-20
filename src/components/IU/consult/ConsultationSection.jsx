import PropTypes from 'prop-types';
import Button from '../forms/button';

const ConsultationSection = ({ 
  title = '¿Necesitas asesoramiento?',
  description = 'Nuestro equipo de expertos está disponible para ayudarte a elegir los mejores componentes',
  buttonText = 'Contactar soporte',
  onContactClick = () => {}
}) => {
  return (
    <section className="w-full bg-cyan-500 py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center space-y-6">
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            {title}
          </h2>

          <p className="text-lg text-white max-w-2xl mx-auto">
            {description}
          </p>

          <div className="pt-4">
            <Button 
              variant="primary"
              size="lg"
              onClick={onContactClick}
              className="bg-white text-cyan-600 hover:bg-gray-100 border-white"
            >
              {buttonText}
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};

ConsultationSection.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  onContactClick: PropTypes.func
};

export default ConsultationSection;