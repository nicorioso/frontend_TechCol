import { useEffect, useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../IU/cards/ProductCard";
import productService from "../../services/product/productService";
import cartService from "../../services/cart/cartService";
import config from "../../config/config";

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

    window.setTimeout(() => {
      setNotice("");
    }, 2500);
  };

  return (
    <section className="w-full bg-slate-100 py-8">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Catalogo de Productos</h1>
          <p className="text-sm text-slate-500">Encuentra los mejores componentes para tu PC.</p>
        </header>

        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <label htmlFor="product-search" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Search className="h-4 w-4" />
            Buscar producto
          </label>
          <input
            id="product-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej. RTX 4090, DDR5, SSD..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:ring-2"
          />
        </div>

        {notice && (
          <div className="mb-4 rounded-md border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm text-cyan-900">
            {notice}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
              <Filter className="h-4 w-4" />
              Filtros
            </h2>

            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-slate-800">Categoria</p>
              <div className="space-y-1.5">
                {categoryOptions.map((category) => (
                  <label key={category} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
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
              <p className="mb-2 text-sm font-semibold text-slate-800">Rango de Precio</p>
              <input
                type="range"
                min={0}
                max={maxCatalogPrice || 0}
                value={maxPriceFilter}
                onChange={(event) => setMaxPriceFilter(Number(event.target.value))}
                className="w-full accent-cyan-600"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                <span>$ 0</span>
                <span>{formatMoney(maxPriceFilter)}</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-800">Stock</p>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
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
            <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
              <span className="font-medium">{filteredProducts.length} productos</span>
              <span className="flex items-center gap-1">
                <SlidersHorizontal className="h-4 w-4" />
                Vista catalogo
              </span>
            </div>

            {isLoading && (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                Cargando productos...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700">
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
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                No hay productos que coincidan con los filtros seleccionados.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
