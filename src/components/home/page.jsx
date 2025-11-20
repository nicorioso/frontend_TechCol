import { useEffect, useState } from 'react';

import productService from '../../services/product/productService';

const products = await productService.getAllProducts();

import HeroSection from '../IU/hero/HeroSection';
import ConsultationSection from '../IU/consult/ConsultationSection';
import FeaturesGrid from '../IU/grid/FeaturedGrid';
import ProductShowcase from '../IU/cards/ProductShowcase';

import { axiosInstance } from '../../services/api/axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      
      // ← IMPRIME LO QUE RECIBE DEL BACKEND
      console.log('📦 Datos del backend:', data);
      console.log('📦 Primer producto:', data[0]);
      
      // Mapear datos de la BD a formato del componente
      const formattedProducts = data.map(product => {
        console.log('🔍 Mapeando producto:', product);
        
        return {
          id: product.id || product.product_id,
          image: product.product_image_url || product.imageUrl || getProductImage(product.product_name || product.name),
          category: getProductCategory(product.product_name || product.name),
          name: product.product_name || product.name,
          stock: (product.product_stock || product.stock) > 0 ? 'En stock' : 'Agotado',
          // ← AQUÍ ES DONDE FALLA - Asegúrate que product_price exista
          price: `$ ${(product.product_price || product.price || 0).toLocaleString('es-CO')}`
        };
      });
      
      console.log('✅ Productos formateados:', formattedProducts);
      setProducts(formattedProducts);
      setError(null);
    } catch (err) {
      console.error('❌ Error al cargar productos:', err);
      setError(err.response?.data?.message || err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Función para asignar categorías
  const getProductCategory = (productName) => {
    if (!productName) return 'Componentes';
    if (productName.includes('Procesador') || productName.includes('Intel') || productName.includes('AMD')) 
      return 'Procesadores';
    if (productName.includes('Tarjeta') || productName.includes('RTX') || productName.includes('GPU')) 
      return 'Tarjetas Gráficas';
    if (productName.includes('Memoria') || productName.includes('RAM') || productName.includes('DDR')) 
      return 'Memoria';
    if (productName.includes('SSD') || productName.includes('NVMe') || productName.includes('Samsung')) 
      return 'Almacenamiento';
    if (productName.includes('Fuente') || productName.includes('Power') || productName.includes('Corsair')) 
      return 'Fuentes';
    if (productName.includes('Disipador') || productName.includes('Cooler') || productName.includes('Noctua')) 
      return 'Refrigeración';
    return 'Componentes';
  };

  // Función fallback para imágenes
  const getProductImage = (productName) => {
    if (!productName) return 'https://images.unsplash.com/photo-1587829191301-44ec282d457f?w=500&h=400&fit=crop';
    
    const images = {
      'Procesador': 'https://images.unsplash.com/photo-1591290619762-2db47d2e0fdc?w=500&h=400&fit=crop',
      'Tarjeta': 'https://images.unsplash.com/photo-1587829191301-44ec282d457f?w=500&h=400&fit=crop',
      'Memoria': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=400&fit=crop',
      'SSD': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=400&fit=crop',
      'Fuente': 'https://images.unsplash.com/photo-1624705002806-216801bae89e?w=500&h=400&fit=crop',
      'Disipador': 'https://images.unsplash.com/photo-1622438655780-9be82da1e8c6?w=500&h=400&fit=crop'
    };

    for (const [key, url] of Object.entries(images)) {
      if (productName.includes(key)) return url;
    }
    
    return 'https://images.unsplash.com/photo-1587829191301-44ec282d457f?w=500&h=400&fit=crop';
  };

  return (
    <div className="w-full">
      <HeroSection 
        title="TechCol"
        subtitle="Tu tienda especializada en partes de computador de alta calidad"
        description="Encuentra los mejores componentes para armar o mejorar tu PC gamer, workstation o servidor"
        logoSrc="https://images.unsplash.com/photo-1622438655780-9be82da1e8c6?w=200&h=200&fit=crop"
      />

      <FeaturesGrid />

      <div className="w-full">
        {error && (
          <div className="w-full bg-red-100 text-red-800 p-4 text-center">
            <p>⚠️ {error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="w-full py-20 flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 font-medium">Cargando productos...</p>
            </div>
          </div>
        ) : (
          <ProductShowcase 
            title="Productos Destacados"
            products={products}
          />
        )}
      </div>

      <ConsultationSection 
        title="¿Necesitas asesoramiento?"
        description="Nuestro equipo de expertos está disponible para ayudarte a elegir los mejores componentes"
        buttonText="Contactar soporte"
      />
    </div>
  );
}

export default Home;