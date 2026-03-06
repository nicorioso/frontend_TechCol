import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const HomeHeroSection = ({
  brand = "TechCol",
  title = "Tu tienda de componentes de computador en Colombia",
  description = "Encuentra partes PC, hardware gamer y componentes para workstation con asesoria de compatibilidad y envio nacional",
  primaryLabel = "Comienza ahora",
  primaryTo = "/auth/register",
  secondaryLabel = "Ver productos",
  secondaryTo = "/",
  showPrimaryAction = true,
  imageUrl,
  imageAlt = "Logo de TechCol",
}) => {
  return (
    <section className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 py-16 text-white lg:py-20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:px-12">
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">{brand}</h1>

          <p className="max-w-2xl text-xl font-medium text-slate-100 md:text-2xl">{title}</p>

          <p className="max-w-2xl text-base text-slate-300 md:text-lg">{description}</p>

          <div className="flex flex-wrap gap-4 pt-2">
            {showPrimaryAction ? (
              <Link
                to={primaryTo}
                className="rounded-md bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
              >
                {primaryLabel}
              </Link>
            ) : null}

            <Link
              to={secondaryTo}
              className="rounded-md border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              width="208"
              height="208"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-44 w-44 rounded-sm bg-transparent object-cover md:h-52 md:w-52"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

HomeHeroSection.propTypes = {
  brand: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  primaryLabel: PropTypes.string,
  primaryTo: PropTypes.string,
  secondaryLabel: PropTypes.string,
  secondaryTo: PropTypes.string,
  showPrimaryAction: PropTypes.bool,
  imageUrl: PropTypes.string,
  imageAlt: PropTypes.string,
};

export default HomeHeroSection;


