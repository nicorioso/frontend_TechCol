import PropTypes from 'prop-types';

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
  onAddToCart = () => {},
  disableAddToCart = false
}) => {
  return (
    <article className="overflow-hidden rounded-sm border border-slate-200 bg-white">
      <div className="flex h-36 w-full items-center justify-center bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <span className="text-2xl font-semibold tracking-wide text-slate-700" aria-hidden="true">
            {imageIcon || "ITEM"}
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <p className="text-xs font-semibold text-cyan-500">
          {category}
        </p>

        <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-slate-900">
          {name}
        </h3>

        <p className="text-sm text-slate-500">{stock}</p>

        <div className="flex items-end justify-between pt-1">
          <p className="text-2xl font-extrabold leading-none tracking-tight text-slate-900">
            {price}
          </p>
          <button
            onClick={onAddToCart}
            disabled={disableAddToCart}
            className={`rounded p-2 text-slate-950 transition-colors duration-300 ${
              disableAddToCart
                ? "cursor-not-allowed bg-slate-300 text-slate-500"
                : "bg-cyan-500 hover:bg-cyan-600"
            }`}
            aria-label="Agregar al carrito"
          >
            <CartIcon className="h-4 w-4" />
          </button>
        </div>
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
  onAddToCart: PropTypes.func,
  disableAddToCart: PropTypes.bool
};

export default ProductCard;
