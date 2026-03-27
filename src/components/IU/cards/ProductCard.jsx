import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

const CartIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
  </svg>
);

const ProductCard = ({ 
  image,
  imageIcon,
  category, 
  name, 
  stock = "En stock",
  price, 
  productUrl = "#",
  onAddToCart = () => {},
  disableAddToCart = false
}) => {
  const availabilityTone = disableAddToCart
    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300"
    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-cyan-900/60">
      <Link to={productUrl} className="block">
        <div className="relative flex h-52 w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
            <span className="rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/80 dark:text-cyan-300">
              {category}
            </span>
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${availabilityTone}`}>
              {stock}
            </span>
          </div>

          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              decoding="async"
              width="320"
              height="220"
              className="relative z-0 h-full w-full object-contain px-6 pb-4 pt-10 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="relative z-10 text-2xl font-semibold tracking-[0.35em] text-slate-700 dark:text-gray-200" aria-hidden="true">
              {imageIcon || "ITEM"}
            </span>
          )}

          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.28),_rgba(255,255,255,0)_58%)] dark:bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.32),_rgba(15,23,42,0)_58%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-white via-white/85 to-transparent dark:from-gray-800 dark:via-gray-800/70" />
        </div>

        <div className="space-y-3 p-5">
          <h3 className="min-h-[3.5rem] line-clamp-2 text-xl font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-cyan-700 dark:text-gray-100 dark:group-hover:text-cyan-300">
            {name}
          </h3>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-gray-500">
                Precio TechCol
              </p>
              <p className="text-2xl font-bold leading-none tracking-tight text-slate-900 dark:text-gray-100">
                {price}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-900 dark:text-gray-300">
              Ver detalle
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-slate-200/80 px-5 pb-5 pt-4 dark:border-gray-700">
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Compra segura y envio nacional
        </p>
        <button
          onClick={onAddToCart}
          disabled={disableAddToCart}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
            disableAddToCart
              ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-gray-700 dark:text-gray-500"
              : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          }`}
          aria-label="Agregar al carrito"
        >
          <CartIcon className="h-4 w-4" />
          <span>Agregar</span>
        </button>
      </div>
    </article>
  );
};

ProductCard.propTypes = {
  image: PropTypes.string,
  imageIcon: PropTypes.string,
  category: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  stock: PropTypes.string,
  price: PropTypes.string.isRequired,
  productUrl: PropTypes.string,
  onAddToCart: PropTypes.func,
  disableAddToCart: PropTypes.bool
};

export default ProductCard;
