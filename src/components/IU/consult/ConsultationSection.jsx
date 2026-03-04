import PropTypes from "prop-types";
import Button from "../forms/button";

const ConsultationSection = ({
  title = "Necesitas asesoramiento?",
  description = "Nuestro equipo de expertos esta disponible para ayudarte a elegir los mejores componentes",
  buttonText = "Contactar soporte",
  onContactClick = () => {},
}) => {
  return (
    <section className="w-full bg-slate-50 py-10 dark:bg-gray-900 lg:py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="space-y-5 rounded-md bg-cyan-500 px-6 py-14 text-center lg:px-10">
          <h2 className="text-5xl font-bold text-white">{title}</h2>
          <p className="mx-auto max-w-3xl text-base text-cyan-50">{description}</p>

          <div className="pt-3">
            <Button
              variant="primary"
              size="lg"
              onClick={onContactClick}
              className="border-white bg-white px-6 py-2 text-cyan-600 hover:bg-gray-100"
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
