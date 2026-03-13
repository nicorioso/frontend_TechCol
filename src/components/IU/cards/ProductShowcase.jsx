import PropTypes from 'prop-types';
import ProductCard from './ProductCard';

const ProductShowcase = ({ 
  title = 'Productos Destacados',
  products = [],
  onAddToCart = () => {}
}) => {
  return (
    <section className="w-full bg-white py-4 dark:bg-gray-900 lg:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <h2 className="mb-10 text-center text-4xl font-bold text-slate-900 dark:text-gray-100">
          {title}
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={product.id || index}
              image={product.image}
              imageIcon={product.imageIcon}
              category={product.category}
              name={product.name}
              stock={product.stock}
              price={product.price}
              onAddToCart={() => onAddToCart(product)}
              disableAddToCart={product.stockAmount <= 0}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No hay productos disponibles en este momento.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

ProductShowcase.propTypes = {
  title: PropTypes.string,
  onAddToCart: PropTypes.func,
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string,
    imageIcon: PropTypes.string,
    category: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    stock: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    stockAmount: PropTypes.number
  }))
};

export default ProductShowcase;

