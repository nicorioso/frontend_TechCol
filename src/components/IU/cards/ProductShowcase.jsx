import PropTypes from 'prop-types';
import ProductCard from './ProductCard';

const ProductShowcase = ({ 
  title = 'Productos Destacados',
  products = []
}) => {
  return (
    <section className="w-full bg-slate-50 py-4 lg:py-8">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="mb-10 text-center text-4xl font-bold text-slate-900">
          {title}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={product.id || index}
              image={product.image}
              imageIcon={product.imageIcon}
              category={product.category}
              name={product.name}
              stock={product.stock}
              price={product.price}
              onAddToCart={() => {
                console.log(`Producto agregado: ${product.name}`);
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
    image: PropTypes.string,
    imageIcon: PropTypes.string,
    category: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    stock: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired
  }))
};

export default ProductShowcase;

