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
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="space-y-5 rounded-md bg-cyan-500 px-6 py-14 text-center dark:border dark:border-cyan-400/40 dark:bg-slate-900/70 dark:shadow-lg dark:shadow-cyan-950/40 lg:px-10">
          <h2 className="text-5xl font-bold text-white">{title}</h2>
          <p className="mx-auto max-w-3xl text-base text-cyan-50 dark:text-cyan-100">{description}</p>

          <div className="pt-3">
            <Button
              variant="primary"
              size="lg"
              onClick={onContactClick}
              className="rounded-md border border-slate-200 bg-cyan-500 px-6 py-3 text-sm font-semibold !text-slate-100 transition hover:bg-slate-800 hover:!text-white dark:border-slate-200 dark:bg-slate-900 dark:!text-slate-100 dark:hover:bg-slate-800 dark:hover:!text-white"
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
