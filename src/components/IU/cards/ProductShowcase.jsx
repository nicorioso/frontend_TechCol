import PropTypes from 'prop-types';
import ProductCard from './ProductCard';

const ProductShowcase = ({ 
  title = 'Productos Destacados',
  products = []
}) => {
  return (
    <section className="w-full bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id || index}
              image={product.image}
              category={product.category}
              name={product.name}
              stock={product.stock}
              price={product.price}
              onAddToCart={() => {
                console.log(`Producto añadido: ${product.name}`);
              }}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
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
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    stock: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired
  }))
};

export default ProductShowcase;