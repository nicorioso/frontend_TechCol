import { useEffect, useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../IU/cards/ProductCard";
import productService from "../../services/product/productService";
import cartService from "../../services/cart/cartService";
import SeoHead from "../../seo/SeoHead";
import { buildProductListSchema } from "../../seo/schema";
import { normalizeProduct } from "../../utils/productPresentation";

const formatMoney = (value) => {
  const amount = Number(value ?? 0);
  return `$ ${amount.toLocaleString("es-CO")}`;
};

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [minPriceFilter, setMinPriceFilter] = useState(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await productService.getAllProducts();
        const normalized = (data || []).map(normalizeProduct);

        setProducts(normalized);
        const priceValues = normalized.map((item) => item.priceAmount).filter((value) => !Number.isNaN(value));
        const minPrice = priceValues.length ? Math.min(...priceValues) : 0;
        const maxPrice = priceValues.length ? Math.max(...priceValues) : 0;
        setMinPriceFilter(minPrice);
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

  const minCatalogPrice = useMemo(() => {
    if (products.length === 0) return 0;
    return products.reduce((acc, item) => (item.priceAmount < acc ? item.priceAmount : acc), products[0].priceAmount);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const next = products.filter((item) => {
      const inSearch = `${item?.product_name ?? item?.productName ?? ""} ${item?.description ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase().trim());

      const inCategory =
        selectedCategories.length === 0 || selectedCategories.includes(item.category);

      const inStock =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && item.stockAmount > 0) ||
        (availabilityFilter === "unavailable" && item.stockAmount <= 0);
      const inPrice = item.priceAmount >= minPriceFilter && item.priceAmount <= maxPriceFilter;

      return inSearch && inCategory && inStock && inPrice;
    });

    return [...next].sort((left, right) => {
      if (sortBy === "price-asc") return left.priceAmount - right.priceAmount;
      if (sortBy === "price-desc") return right.priceAmount - left.priceAmount;
      if (sortBy === "name-asc") return left.displayName.localeCompare(right.displayName, "es");
      if (sortBy === "stock-desc") return right.stockAmount - left.stockAmount;
      return 0;
    });
  }, [products, query, selectedCategories, availabilityFilter, minPriceFilter, maxPriceFilter, sortBy]);

  const toggleCategory = (category) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedCategories([]);
    setAvailabilityFilter("all");
    setSortBy("featured");
    setMinPriceFilter(minCatalogPrice);
    setMaxPriceFilter(maxCatalogPrice);
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
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">Ordenar por</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-cyan-600 transition hover:text-cyan-700"
                >
                  Limpiar
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre: A - Z</option>
                <option value="stock-desc">Mayor disponibilidad</option>
              </select>
            </div>

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
                    <span className="flex-1">{category}</span>
                    <span className="text-xs text-slate-400 dark:text-gray-500">
                      {products.filter((product) => product.category === category).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-gray-100">Rango de Precio</p>
              <div className="mb-3 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-gray-900 dark:text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Minimo</span>
                  <span>{formatMoney(minPriceFilter)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span>Maximo</span>
                  <span>{formatMoney(maxPriceFilter)}</span>
                </div>
              </div>
              <input
                type="range"
                min={minCatalogPrice}
                max={maxCatalogPrice || 0}
                value={minPriceFilter}
                onChange={(event) => {
                  const nextMin = Number(event.target.value);
                  setMinPriceFilter(nextMin > maxPriceFilter ? maxPriceFilter : nextMin);
                }}
                className="w-full accent-cyan-600"
              />
              <input
                type="range"
                min={minCatalogPrice}
                max={maxCatalogPrice || 0}
                value={maxPriceFilter}
                onChange={(event) => {
                  const nextMax = Number(event.target.value);
                  setMaxPriceFilter(nextMax < minPriceFilter ? minPriceFilter : nextMax);
                }}
                className="mt-2 w-full accent-cyan-600"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
                <span>{formatMoney(minCatalogPrice)}</span>
                <span>{formatMoney(maxCatalogPrice)}</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-gray-100">Stock</p>
              <div className="space-y-2">
                {[
                  { value: "all", label: "Todos" },
                  { value: "available", label: "Solo disponibles" },
                  { value: "unavailable", label: "Sin stock" },
                ].map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-gray-300">
                    <input
                      type="radio"
                      name="availability-filter"
                      checked={availabilityFilter === option.value}
                      onChange={() => setAvailabilityFilter(option.value)}
                      className="h-4 w-4 border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
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
                    key={product.productId}
                    image={product.image}
                    category={product.category}
                    name={product.displayName}
                    stock={product.stockAmount > 0 ? "En stock" : "No disponible"}
                    price={formatMoney(product.priceAmount)}
                    productUrl={`/products/${product.productId}`}
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
