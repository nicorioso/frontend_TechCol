import { useEffect, useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../IU/cards/ProductCard";
import productService from "../../services/product/productService";
import cartService from "../../services/cart/cartService";
import config from "../../config/config";
import SeoHead from "../../seo/SeoHead";
import { buildProductListSchema } from "../../seo/schema";

const CATEGORY_RULES = [
  { category: "Procesadores", keywords: ["intel", "ryzen", "cpu", "procesador"] },
  { category: "Tarjetas Graficas", keywords: ["rtx", "gtx", "radeon", "gpu", "grafica"] },
  { category: "Memoria", keywords: ["ram", "ddr"] },
  { category: "Almacenamiento", keywords: ["ssd", "hdd", "nvme", "disco"] },
  { category: "Placas Madre", keywords: ["motherboard", "placa", "b650", "z790", "x670"] },
  { category: "Fuentes", keywords: ["fuente", "psu", "watt", "gold", "bronze"] },
  { category: "Refrigeracion", keywords: ["cooler", "fan", "liquid", "water", "refriger"] },
  { category: "Cases", keywords: ["case", "gabinete", "chasis"] },
  { category: "Monitores", keywords: ["monitor", "hz", "panel"] },
];

const formatMoney = (value) => {
  const amount = Number(value ?? 0);
  return `$ ${amount.toLocaleString("es-CO")}`;
};

const inferCategory = (product) => {
  const source = `${product?.product_name ?? product?.productName ?? ""} ${product?.description ?? ""}`.toLowerCase();
  const rule = CATEGORY_RULES.find((entry) =>
    entry.keywords.some((keyword) => source.includes(keyword))
  );
  return rule?.category ?? "Componentes";
};

const buildImageUrl = (imageName) => {
  if (!imageName) return "";
  if (imageName.startsWith("http")) return imageName;

  const host = config.api.baseURL.replace(/\/api\/?$/, "");
  const uploadsPath = config.uploadsPath.replace(/\/+$/, "");
  return `${host}${uploadsPath}/${imageName}`;
};

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await productService.getAllProducts();
        const normalized = (data || []).map((item) => ({
          ...item,
          category: inferCategory(item),
          image: buildImageUrl(item?.imageUrl),
          stockAmount: Number(item?.stock ?? 0),
          priceAmount: Number(item?.price ?? 0),
        }));

        setProducts(normalized);
        const maxPrice = normalized.reduce(
          (acc, item) => (item.priceAmount > acc ? item.priceAmount : acc),
          0
        );
        setMaxPriceFilter(maxPrice);
      } catch {
        setError("No se pudieron cargar los productos del catalogo.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categoryOptions = useMemo(() => {
    const unique = new Set(products.map((item) => item.category));
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "es"));
  }, [products]);

  const maxCatalogPrice = useMemo(
    () =>
      products.reduce(
        (acc, item) => (item.priceAmount > acc ? item.priceAmount : acc),
        0
      ),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const inSearch = `${item?.product_name ?? item?.productName ?? ""} ${item?.description ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase().trim());

      const inCategory =
        selectedCategories.length === 0 || selectedCategories.includes(item.category);

      const inStock = !onlyAvailable || item.stockAmount > 0;
      const inPrice = item.priceAmount <= maxPriceFilter;

      return inSearch && inCategory && inStock && inPrice;
    });
  }, [products, query, selectedCategories, onlyAvailable, maxPriceFilter]);

  const toggleCategory = (category) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  const handleAddToCart = async (product) => {
    if (product.stockAmount <= 0) return;

    try {
      const result = await cartService.addItem(product, 1);
      if (result.mode === "backend") {
        setNotice("Producto agregado al carrito de tu cuenta.");
      } else {
        setNotice("Producto agregado al carrito temporal.");
      }
    } catch {
      setNotice("No se pudo agregar el producto al carrito.");
    }
  };

  return (
    <section className="w-full bg-white py-8 dark:bg-gray-900">
      <SeoHead
        routeKey="products"
        schema={buildProductListSchema(products.map((product) => ({ ...product, imageUrl: product.image })))}
      />
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
            Catalogo de Componentes de Computador en Colombia
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Descubre tarjetas graficas, procesadores, memorias RAM, SSD y partes PC con asesoria de compatibilidad y envio nacional.
          </p>
        </header>

        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <label htmlFor="product-search" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-gray-200">
            <Search className="h-4 w-4" />
            Buscar producto
          </label>
          <input
            id="product-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej. RTX 4090, DDR5, SSD..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        {notice && (
          <div className="mb-4 rounded-md border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm text-cyan-900 dark:border-cyan-900 dark:bg-cyan-900/30 dark:text-cyan-200">
            {notice}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-gray-200">
              <Filter className="h-4 w-4" />
              Filtros
            </h2>

            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-gray-100">Categoria</p>
              <div className="space-y-1.5">
                {categoryOptions.map((category) => (
                  <label key={category} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-gray-100">Rango de Precio</p>
              <input
                type="range"
                min={0}
                max={maxCatalogPrice || 0}
                value={maxPriceFilter}
                onChange={(event) => setMaxPriceFilter(Number(event.target.value))}
                className="w-full accent-cyan-600"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
                <span>$ 0</span>
                <span>{formatMoney(maxPriceFilter)}</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-gray-100">Stock</p>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(event) => setOnlyAvailable(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                Solo disponibles
              </label>
            </div>
          </aside>

          <div>
            <div className="mb-3 flex items-center justify-between text-sm text-slate-600 dark:text-gray-400">
              <span className="font-medium">{filteredProducts.length} productos</span>
              <span className="flex items-center gap-1">
                <SlidersHorizontal className="h-4 w-4" />
                Vista catalogo
              </span>
            </div>

            {isLoading && (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                Cargando productos...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-900 dark:bg-red-900/30 dark:text-red-200">
                {error}
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product?.product_id ?? product?.id}
                    image={product.image}
                    category={product.category}
                    name={product?.product_name ?? product?.productName ?? "Producto"}
                    stock={product.stockAmount > 0 ? "En stock" : "No disponible"}
                    price={formatMoney(product.priceAmount)}
                    disableAddToCart={product.stockAmount <= 0}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))}
              </div>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                No hay productos que coincidan con los filtros seleccionados.
              </div>
            )}

            {!isLoading && !error && (
              <section className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-gray-100">
                  Necesitas ayuda para elegir componentes?
                </h2>
                <p className="mb-3">
                  Si estas armando tu computador gamer o de trabajo, visita nuestra pagina de{" "}
                  <Link to="/contact" className="font-semibold text-cyan-600 hover:text-cyan-700">
                    asesoramiento tecnico
                  </Link>{" "}
                  o vuelve al{" "}
                  <Link to="/" className="font-semibold text-cyan-600 hover:text-cyan-700">
                    inicio de la tienda
                  </Link>{" "}
                  para revisar recomendaciones destacadas.
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
