import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Lock,
  Minus,
  Package,
  Plus,
  RefreshCw,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { cartService } from "../../services/cart/cartService";
import MainHeader from "../../components/IU/headers/Main";
import MainFooter from "../../components/IU/footers/MainFooter";
import CheckoutProgress from "../../components/IU/section/CheckoutProgress";
import exchangeRateService, { DEFAULT_USD_TO_COP_RATE } from "../../services/exchange/exchangeRateService";
import SeoHead from "../../seo/SeoHead";
import { formatCopCurrency, formatUsdCurrency } from "../../utils/currency";

const EXCHANGE_RATE_REFRESH_MS = 60 * 1000;

export default function CartView() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [usdToCopRate, setUsdToCopRate] = useState(DEFAULT_USD_TO_COP_RATE);

  const loadCart = async () => {
    setIsLoading(true);
    const items = await cartService.getCartItems();
    setCartItems(items);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCart();

    const handleUpdated = () => {
      loadCart();
    };

    window.addEventListener(cartService.CART_UPDATED_EVENT, handleUpdated);
    return () => window.removeEventListener(cartService.CART_UPDATED_EVENT, handleUpdated);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadExchangeRate = async () => {
      try {
        const result = await exchangeRateService.getUsdToCopRate();
        if (!isMounted) return;
        setUsdToCopRate(result.usdToCopRate);
      } catch {
        // Si falla, mantenemos la referencia por defecto para los aproximados.
      }
    };

    loadExchangeRate();
    const intervalId = window.setInterval(loadExchangeRate, EXCHANGE_RATE_REFRESH_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const summary = useMemo(() => cartService.getCartSummary(cartItems), [cartItems]);
  const totalBeforeShipping = useMemo(() => summary.subtotal + summary.tax, [summary.subtotal, summary.tax]);
  const convertCopToUsd = (copAmount) =>
    Number(copAmount ?? 0) / (usdToCopRate > 0 ? usdToCopRate : DEFAULT_USD_TO_COP_RATE);

  const showNotice = (message) => {
    setNotice(message);
  };

  const handleRemoveItem = async (productId) => {
    await cartService.removeItem(productId);
    showNotice("Producto eliminado del carrito.");
  };

  const handleUpdateQuantity = async (productId, nextQuantity) => {
    await cartService.updateQuantity(productId, nextQuantity);
  };

  const handleClearCart = async () => {
    await cartService.clearCart();
    showNotice("Carrito vaciado correctamente.");
  };

  const proceedToCheckout = () => {
    if (summary.itemCount <= 0) return;
    navigate("/checkout");
  };

  return (
    <>
      <SeoHead routeKey="cart" />
      <main className="flex min-h-screen flex-col bg-slate-100 dark:bg-gray-900">
        <MainHeader />

      <section className="border-b-2 border-cyan-500 bg-gradient-to-r from-slate-900 to-slate-800 py-4">
        <div className="mx-auto w-full max-w-6xl px-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-slate-200 transition hover:text-white"
          >
            <span aria-hidden="true">&lt;</span>
            Volver a Productos
          </Link>
          <h1 className="text-3xl font-bold text-white">Carrito de Compras</h1>
        </div>
      </section>

      <section className="flex-1 py-8">
        <div className="mx-auto w-full max-w-6xl px-4">
          <CheckoutProgress activeStep={1} />

          {notice && (
            <div className="mb-4 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
              {notice}
            </div>
          )}

          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Cargando carrito...
            </div>
          ) : cartItems.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
              <ShoppingCart className="mx-auto mb-4 h-4 w-4 text-gray-400" />
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Tu carrito esta vacio</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">Agrega productos para iniciar tu compra.</p>
              <Link
                to="/products"
                className="inline-block rounded-lg bg-cyan-600 px-8 py-3 font-semibold text-white transition hover:bg-cyan-700"
              >
                Ir al catalogo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                      <Package className="h-4 w-4" />
                      Productos en tu Carrito
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={loadCart}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Recargar
                      </button>
                      <button
                        onClick={handleClearCart}
                        className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        Vaciar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <article
                        key={item.product_id}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:shadow-sm dark:border-gray-700 dark:bg-gray-900"
                      >
                        <div className="flex gap-3">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.product_name}
                              loading="lazy"
                              decoding="async"
                              width="64"
                              height="64"
                              className="h-16 w-16 rounded-md bg-gray-100 object-cover dark:bg-gray-700"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-500 dark:bg-gray-700">
                              Sin imagen
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">{item.product_name}</h3>
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                  {formatUsdCurrency(convertCopToUsd(item.unit_price))}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Aprox. {formatCopCurrency(item.unit_price)}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Precio por unidad</p>
                              </div>
                              <span className="text-right">
                                <span className="block font-bold text-cyan-600 dark:text-cyan-400">
                                  {formatUsdCurrency(convertCopToUsd(item.unit_price * item.quantity))}
                                </span>
                                <span className="block text-xs text-slate-500 dark:text-slate-400">
                                  Aprox. {formatCopCurrency(item.unit_price * item.quantity)}
                                </span>
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2 py-1 dark:border-gray-600 dark:bg-gray-800">
                                <button
                                  onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                  className="rounded p-0.5 transition hover:bg-gray-100 dark:hover:bg-gray-700"
                                  aria-label="Disminuir cantidad"
                                >
                                  <Minus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                </button>
                                <span className="w-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                  className="rounded p-0.5 transition hover:bg-gray-100 dark:hover:bg-gray-700"
                                  aria-label="Aumentar cantidad"
                                >
                                  <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item.product_id)}
                                className="text-gray-400 transition hover:text-red-600"
                                aria-label={`Eliminar ${item.product_name}`}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                  <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">Resumen del Pedido</h2>

                  <div className="space-y-3 border-b border-gray-200 pb-4 text-sm dark:border-gray-700">
                    <div className="flex items-start justify-between gap-4 text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span className="text-right">
                        <span className="block text-base font-semibold text-slate-900 dark:text-white">
                          {formatUsdCurrency(convertCopToUsd(summary.subtotal))}
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          Aprox. {formatCopCurrency(summary.subtotal)}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4 text-gray-600 dark:text-gray-400">
                      <span>IVA (19%)</span>
                      <span className="text-right">
                        <span className="block text-base font-semibold text-slate-900 dark:text-white">
                          {formatUsdCurrency(convertCopToUsd(summary.tax))}
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          Aprox. {formatCopCurrency(summary.tax)}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="my-4 flex items-start justify-between gap-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-right">
                      <span className="block text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                        {formatUsdCurrency(convertCopToUsd(totalBeforeShipping))}
                      </span>
                      <span className="block text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Aprox. {formatCopCurrency(totalBeforeShipping)}
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={proceedToCheckout}
                    className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 py-3 font-semibold text-white shadow-md transition hover:bg-cyan-600"
                  >
                    Continuar a Envio
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <p className="mt-4 flex items-center justify-center gap-1 border-t border-gray-200 pt-4 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <Lock className="h-4 w-4" />
                    Pago 100% seguro y encriptado
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

        <MainFooter />
      </main>
    </>
  );
}
