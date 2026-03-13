import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCartIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  ArrowPathIcon,
  TrashIcon,
  ChevronRightIcon,
  CubeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { cartService } from "../../services/cart/cartService";
import MainHeader from "../../components/IU/headers/Main";
import MainFooter from "../../components/IU/footers/MainFooter";
import SeoHead from "../../seo/SeoHead";
import { formatCopCurrency } from "../../utils/currency";

export default function CartView() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState("");

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

  const summary = useMemo(() => cartService.getCartSummary(cartItems), [cartItems]);

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
          <div className="mb-8 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-cyan-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan-500 bg-cyan-50 text-xs font-bold">
                1
              </span>
              <span className="font-semibold">Carrito</span>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-slate-400" />
            <div className="flex items-center gap-2 text-slate-500">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-bold">
                2
              </span>
              <span className="font-semibold">Envio</span>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-slate-400" />
            <div className="flex items-center gap-2 text-slate-500">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-bold">
                3
              </span>
              <span className="font-semibold">Pago</span>
            </div>
          </div>

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
              <ShoppingCartIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
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
                      <CubeIcon className="h-5 w-5" />
                      Productos en tu Carrito
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={loadCart}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <ArrowPathIcon className="h-3.5 w-3.5" />
                        Recargar
                      </button>
                      <button
                        onClick={handleClearCart}
                        className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
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
                                <p className="text-xs text-slate-500">{formatCopCurrency(item.unit_price)} por unidad</p>
                              </div>
                              <span className="font-bold text-cyan-600 dark:text-cyan-400">
                                {formatCopCurrency(item.unit_price * item.quantity)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2 py-1 dark:border-gray-600 dark:bg-gray-800">
                                <button
                                  onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                  className="rounded p-0.5 transition hover:bg-gray-100 dark:hover:bg-gray-700"
                                  aria-label="Disminuir cantidad"
                                >
                                  <MinusIcon className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                                </button>
                                <span className="w-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                  className="rounded p-0.5 transition hover:bg-gray-100 dark:hover:bg-gray-700"
                                  aria-label="Aumentar cantidad"
                                >
                                  <PlusIcon className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item.product_id)}
                                className="text-gray-400 transition hover:text-red-600"
                                aria-label={`Eliminar ${item.product_name}`}
                              >
                                <XMarkIcon className="h-4 w-4" />
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
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span>{formatCopCurrency(summary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>IVA (19%)</span>
                      <span>{formatCopCurrency(summary.tax)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Envio</span>
                      <span className={summary.shipping === 0 ? "text-green-600 dark:text-green-400" : ""}>
                        {summary.shipping === 0 ? "Gratis" : formatCopCurrency(summary.shipping)}
                      </span>
                    </div>
                  </div>

                  <div className="my-4 flex justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{formatCopCurrency(summary.total)}</span>
                  </div>

                  <button
                    onClick={proceedToCheckout}
                    className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 py-3 font-semibold text-white shadow-md transition hover:bg-cyan-600"
                  >
                    Continuar a Envio
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>

                  <p className="mt-4 flex items-center justify-center gap-1 border-t border-gray-200 pt-4 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <LockClosedIcon className="h-3.5 w-3.5" />
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
