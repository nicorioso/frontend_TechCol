import PropTypes from "prop-types";
import Button from "../forms/button";

const ConsultationSection = ({
  title = "Necesitas asesoramiento?",
  description = "Nuestro equipo de expertos esta disponible para ayudarte a elegir los mejores componentes",
  buttonText = "Contactar soporte",
  onContactClick = () => {},
}) => {
  return (
    <section className="w-full bg-cyan-500 py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="space-y-6 text-center">
          <h2 className="text-4xl font-bold text-white lg:text-5xl">{title}</h2>
          <p className="mx-auto max-w-2xl text-lg text-white">{description}</p>

          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onContactClick}
              className="border-white bg-white text-cyan-600 hover:bg-gray-100"
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
  onContactClick: PropTypes.func,
};

export default ConsultationSection;
