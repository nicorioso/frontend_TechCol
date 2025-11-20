import PropTypes from 'prop-types';

const CartIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
  </svg>
);

const ProductCard = ({ 
  image, 
  category, 
  name, 
  stock, 
  price, 
  onAddToCart = () => {}
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      
      {/* Imagen del producto */}
      <div className="w-full aspect-video bg-gray-200 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-4">
        
        {/* Categoría */}
        <p className="text-sm text-cyan-500 font-semibold uppercase">
          {category}
        </p>

        {/* Nombre */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {name}
        </h3>


        {/* Precio y botón */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-2xl font-bold text-gray-900">
            {price}
          </p>
          <button
            onClick={onAddToCart}
            className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-lg transition-colors duration-300"
            aria-label="Agregar al carrito"
          >
            <CartIcon className="w-5 h-5" />
          </button>
        </div>

      </div>

    </div>
  );
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  stock: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  onAddToCart: PropTypes.func
};

export default ProductCard;