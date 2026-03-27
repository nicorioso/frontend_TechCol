import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckBadgeIcon,
  CubeIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import MainHeader from "../../components/IU/headers/Main";
import MainFooter from "../../components/IU/footers/MainFooter";
import SeoHead from "../../seo/SeoHead";
import productService from "../../services/product/productService";
import cartService from "../../services/cart/cartService";
import { formatCopCurrency } from "../../utils/currency";
import { buildProductHighlights, normalizeProduct } from "../../utils/productPresentation";

const buildSpecRows = (product) => [
  { label: "Categoria", value: product.category },
  { label: "SKU", value: `TC-${product.productId}` },
  { label: "Disponibilidad", value: product.stockAmount > 0 ? "En stock" : "Agotado" },
  { label: "Unidades", value: String(product.stockAmount) },
];

export default function ProductDetailLayout() {
  const { id } = useParams();
  const imageFrameRef = useRef(null);
  const productImageRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [zoomPosition, setZoomPosition] = useState({
    x: 0.5,
    y: 0.5,
    imageWidth: 0,
    imageHeight: 0,
    active: false,
  });

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setError("");

      try {
        const result = await productService.getProductById(id);
        if (!isMounted) return;
        setProduct(normalizeProduct(result));
      } catch {
        if (!isMounted) return;
        setError("No se pudo cargar la informacion del producto.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const highlights = useMemo(() => buildProductHighlights(product), [product]);
  const specRows = useMemo(() => buildSpecRows(product || {}), [product]);
  const ZOOM_FACTOR = 3;
  const ZOOM_PANE_WIDTH = 480;
  const ZOOM_PANE_HEIGHT = 420;
  const LENS_WIDTH = Math.round(ZOOM_PANE_WIDTH / ZOOM_FACTOR);
  const LENS_HEIGHT = Math.round(ZOOM_PANE_HEIGHT / ZOOM_FACTOR);

  const handleAddToCart = async () => {
    if (!product || product.stockAmount <= 0) return;

    try {
      const result = await cartService.addItem(product, 1);
      setNotice(
        result.mode === "backend"
          ? "Producto agregado al carrito de tu cuenta."
          : "Producto agregado al carrito temporal."
      );
    } catch {
      setNotice("No se pudo agregar el producto al carrito.");
    }
  };

  const handleImageMove = (event) => {
    const frame = imageFrameRef.current;
    const image = productImageRef.current;
    if (!frame || !image) return;

    const frameBounds = frame.getBoundingClientRect();
    const imageBounds = image.getBoundingClientRect();

    const insideImage =
      event.clientX >= imageBounds.left &&
      event.clientX <= imageBounds.right &&
      event.clientY >= imageBounds.top &&
      event.clientY <= imageBounds.bottom;

    if (!insideImage) {
      setZoomPosition((prev) => ({ ...prev, active: false }));
      return;
    }

    const x = (event.clientX - imageBounds.left) / imageBounds.width;
    const y = (event.clientY - imageBounds.top) / imageBounds.height;

    const imageLeftInFrame = imageBounds.left - frameBounds.left;
    const imageTopInFrame = imageBounds.top - frameBounds.top;

    const unclampedLensLeft = event.clientX - frameBounds.left - LENS_WIDTH / 2;
    const unclampedLensTop = event.clientY - frameBounds.top - LENS_HEIGHT / 2;

    const minLensLeft = imageLeftInFrame;
    const maxLensLeft = imageLeftInFrame + imageBounds.width - LENS_WIDTH;
    const minLensTop = imageTopInFrame;
    const maxLensTop = imageTopInFrame + imageBounds.height - LENS_HEIGHT;

    const lensLeft = Math.max(minLensLeft, Math.min(maxLensLeft, unclampedLensLeft));
    const lensTop = Math.max(minLensTop, Math.min(maxLensTop, unclampedLensTop));

    setZoomPosition({
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
      imageWidth: imageBounds.width,
      imageHeight: imageBounds.height,
      lensLeft,
      lensTop,
      active: true,
    });
  };

  const handleImageLeave = () => {
    setZoomPosition((prev) => ({ ...prev, active: false }));
  };

  return (
    <main className="flex min-h-screen flex-col bg-slate-100 dark:bg-gray-900">
      <SeoHead
        routeKey="products"
        override={{
          path: `/products/${id}`,
          title: product ? `${product.displayName} | TechCol` : "Detalle de Producto | TechCol",
          description: product?.description || "Detalle de producto en TechCol.",
        }}
      />
      <MainHeader />

      <section className="border-b border-slate-200 bg-slate-50 py-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
            <Link to="/" className="hover:text-cyan-600">Inicio</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-cyan-600">Productos</Link>
            {product ? (
              <>
                <span>/</span>
                <span className="truncate text-slate-700 dark:text-gray-200">{product.displayName}</span>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="flex-1 py-8">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              Cargando detalle del producto...
            </div>
          ) : error || !product ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
              {error || "Producto no encontrado."}
            </div>
          ) : (
            <>
              {notice ? (
                <div className="mb-6 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-200">
                  {notice}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_1.35fr_0.9fr]">
                <div className="relative rounded-2xl border border-slate-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div
                    ref={imageFrameRef}
                    onMouseMove={product.image ? handleImageMove : undefined}
                    onMouseLeave={handleImageLeave}
                    className="relative flex min-h-[420px] cursor-crosshair items-center justify-center overflow-hidden rounded-2xl bg-slate-50 p-6 dark:bg-gray-900"
                  >
                    {product.image ? (
                      <img
                        ref={productImageRef}
                        src={product.image}
                        alt={product.displayName}
                        className="max-h-[420px] w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-500 dark:border-gray-600 dark:text-gray-400">
                        Imagen no disponible
                      </div>
                    )}

                    {product.image && zoomPosition.active ? (
                      <div
                        className="pointer-events-none absolute rounded-md border border-slate-300/90 bg-white/35 shadow-[0_0_0_999px_rgba(15,23,42,0.06)]"
                        style={{
                          width: `${LENS_WIDTH}px`,
                          height: `${LENS_HEIGHT}px`,
                          left: `${zoomPosition.lensLeft ?? 0}px`,
                          top: `${zoomPosition.lensTop ?? 0}px`,
                        }}
                      />
                    ) : null}
                  </div>

                  {product.image && zoomPosition.active ? (
                    <div
                      className="pointer-events-none absolute left-[calc(100%+1rem)] top-6 z-50 hidden overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl lg:block dark:border-gray-700 dark:bg-gray-900"
                      style={{ width: `${ZOOM_PANE_WIDTH}px`, height: `${ZOOM_PANE_HEIGHT}px` }}
                    >
                      <img
                        src={product.image}
                        alt=""
                        aria-hidden="true"
                        className="absolute max-w-none"
                        style={{
                          width: `${zoomPosition.imageWidth * ZOOM_FACTOR}px`,
                          height: `${zoomPosition.imageHeight * ZOOM_FACTOR}px`,
                          left: `${ZOOM_PANE_WIDTH / 2 - zoomPosition.x * zoomPosition.imageWidth * ZOOM_FACTOR}px`,
                          top: `${ZOOM_PANE_HEIGHT / 2 - zoomPosition.y * zoomPosition.imageHeight * ZOOM_FACTOR}px`,
                        }}
                      />
                    </div>
                  ) : null}

                  {product.image ? (
                    <p className="mt-4 text-center text-sm text-slate-500 dark:text-gray-400">
                      Pasa el cursor sobre la imagen para ampliar
                    </p>
                  ) : null}

                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
                      {product.category}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
                      {product.displayName}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {product.stockAmount > 0 ? "Disponible para despacho" : "Temporalmente agotado"}
                      </span>
                      <span className="text-slate-500 dark:text-gray-400">SKU TC-{product.productId}</span>
                    </div>

                    <div className="mt-6 border-t border-slate-200 pt-6 dark:border-gray-700">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
                        Acerca de este producto
                      </h2>
                      <p className="mt-3 leading-7 text-slate-600 dark:text-gray-300">
                        {product.description}
                      </p>
                      <ul className="mt-5 space-y-3">
                        {highlights.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-gray-300">
                            <CheckBadgeIcon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
                      Especificaciones rapidas
                    </h2>
                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700">
                      {specRows.map((row) => (
                        <div
                          key={row.label}
                          className="grid grid-cols-[160px_1fr] border-b border-slate-200 bg-white px-4 py-3 text-sm last:border-b-0 dark:border-gray-700 dark:bg-gray-800"
                        >
                          <span className="font-semibold text-slate-600 dark:text-gray-400">{row.label}</span>
                          <span className="text-slate-900 dark:text-gray-100">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <aside className="xl:sticky xl:top-24 xl:h-fit">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
                      {formatCopCurrency(product.priceAmount)}
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
                      Precio final, sujeto a disponibilidad y cambios de inventario.
                    </p>

                    <div className="mt-6 space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-gray-900">
                      <div className="flex items-start gap-3">
                        <TruckIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        <div className="text-sm">
                          <p className="font-semibold text-slate-900 dark:text-gray-100">Envio nacional</p>
                          <p className="text-slate-500 dark:text-gray-400">Despacho estimado entre 24 y 72 horas.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <ShieldCheckIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        <div className="text-sm">
                          <p className="font-semibold text-slate-900 dark:text-gray-100">Garantia TechCol</p>
                          <p className="text-slate-500 dark:text-gray-400">Cobertura por defectos de fabrica y soporte postventa.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CubeIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        <div className="text-sm">
                          <p className="font-semibold text-slate-900 dark:text-gray-100">Estado de stock</p>
                          <p className="text-slate-500 dark:text-gray-400">
                            {product.stockAmount > 0 ? `${product.stockAmount} unidades disponibles.` : "Sin unidades disponibles."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <button
                        onClick={handleAddToCart}
                        disabled={product.stockAmount <= 0}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                      >
                        <ShoppingCartIcon className="h-5 w-5" />
                        {product.stockAmount > 0 ? "Agregar al carrito" : "No disponible"}
                      </button>
                      <Link
                        to="/products"
                        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-900"
                      >
                        Seguir explorando
                      </Link>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </section>

      <MainFooter />
    </main>
  );
}
