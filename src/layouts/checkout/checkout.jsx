import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  LockClosedIcon,
  MapPinIcon,
  TruckIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import MainHeader from "../../components/IU/headers/Main";
import MainFooter from "../../components/IU/footers/MainFooter";
import cartService from "../../services/cart/cartService";
import SeoHead from "../../seo/SeoHead";
import { formatCopCurrency } from "../../utils/currency";

const SHIPPING_METHODS = [
  { id: "standard", label: "Estandar (5-7 dias)", cost: 29999 },
  { id: "express", label: "Express (2-3 dias)", cost: 59999 },
  { id: "next_day", label: "Entrega al dia siguiente", cost: 99999 },
];

const buildInitialFormData = () => {
  const user = cartService.getSession().user ?? {};
  const draft = cartService.getCheckoutDraft();

  return {
    fullName:
      draft.fullName ??
      [user?.customerName ?? user?.name ?? "", user?.customerLastName ?? ""].filter(Boolean).join(" "),
    email: draft.email ?? user?.customerEmail ?? user?.email ?? "",
    phone: draft.phone ?? user?.customerPhoneNumber ?? "",
    zipCode: draft.zipCode ?? "",
    street: draft.street ?? "",
    state: draft.state ?? "",
    city: draft.city ?? "",
    country: draft.country ?? "",
    paymentMethod: draft.paymentMethod ?? "paypal",
    shippingMethod: draft.shippingMethod ?? "standard",
  };
};

const requiredFields = ["fullName", "email", "phone", "street", "state", "city"];

const getShippingCost = (methodId) => SHIPPING_METHODS.find((item) => item.id === methodId)?.cost ?? 0;

export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1: envio, 2: pago, 3: confirmado
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [notice, setNotice] = useState("");
  const [formData, setFormData] = useState(buildInitialFormData);
  const [cartItems, setCartItems] = useState(() => cartService.getGuestCart());

  const loadCart = async () => {
    const items = await cartService.getCartItems();
    setCartItems(items);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const summaryBase = useMemo(() => cartService.getCartSummary(cartItems), [cartItems]);
  const shippingCost = useMemo(() => getShippingCost(formData.shippingMethod), [formData.shippingMethod]);
  const summary = useMemo(
    () => ({
      ...summaryBase,
      shipping: shippingCost,
      total: summaryBase.subtotal + summaryBase.tax + shippingCost,
    }),
    [summaryBase, shippingCost]
  );

  const missingRequired = requiredFields.filter((field) => !String(formData[field] ?? "").trim());

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      cartService.saveCheckoutDraft(next);
      return next;
    });
  };

  const handleContinue = () => {
    if (summary.itemCount === 0) {
      setNotice("Tu carrito esta vacio. Agrega productos para continuar.");
      return;
    }

    if (missingRequired.length > 0) {
      setNotice("Completa los campos obligatorios antes de continuar.");
      return;
    }

    setNotice("");
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (summary.itemCount === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setNotice("");

    const orderCode = `TC-${Date.now()}`;
    const payload = {
      orderCode,
      customerId: cartService.getSession().customerId,
      status: "paid",
      items: cartItems,
      delivery: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      shippingMethod: formData.shippingMethod,
      paymentMethod: formData.paymentMethod,
      totals: summary,
      createdAt: new Date().toISOString(),
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem("orders_local_v1") || "[]");
      localStorage.setItem("orders_local_v1", JSON.stringify([payload, ...existingOrders]));

      await cartService.clearCart();
      cartService.clearCheckoutDraft();

      setOrderData(payload);
      setStep(3);
    } catch {
      setNotice("No fue posible completar la compra. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && step < 3) {
    return (
      <>
        <SeoHead routeKey="checkout" />
        <main className="flex min-h-screen flex-col bg-slate-100 dark:bg-gray-900">
          <MainHeader />
        <section className="flex-1 py-12">
          <div className="mx-auto max-w-2xl px-4">
            <div className="rounded-lg border border-gray-200 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-800">
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">No hay productos para checkout</h1>
              <p className="mb-6 text-gray-600 dark:text-gray-400">Tu carrito esta vacio en este momento.</p>
              <div className="flex justify-center gap-3">
                <Link
                  to="/cart"
                  className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Ir al carrito
                </Link>
                <Link
                  to="/products"
                  className="rounded-lg bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700"
                >
                  Ir al catalogo
                </Link>
              </div>
            </div>
          </div>
        </section>
          <MainFooter />
        </main>
      </>
    );
  }

  return (
    <>
      <SeoHead routeKey="checkout" />
      <main className="flex min-h-screen flex-col bg-slate-100 dark:bg-gray-900">
        <MainHeader />

      <section className="border-b-2 border-cyan-500 bg-gradient-to-r from-slate-900 to-slate-800 py-8">
        <div className="mx-auto w-full max-w-6xl px-4">
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-slate-200 transition hover:text-white">
            <span aria-hidden="true">&lt;</span>
            Volver al paso anterior
          </Link>
          <h1 className="mt-3 text-4xl font-bold text-white">Checkout</h1>
        </div>
      </section>

      <section className="flex-1 py-8">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="mb-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="text-xs font-semibold">1</span>
              <span>Carrito</span>
              <span className="h-5 w-5 rounded-full border border-slate-300 bg-white"></span>
            </div>
            <div className="flex items-center gap-2 text-cyan-600">
              <span className="text-xs font-semibold">2</span>
              <span className="font-semibold">Envio</span>
              <span className="h-5 w-5 rounded-full border border-cyan-500 bg-cyan-50"></span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="text-xs font-semibold">3</span>
              <span>Pago</span>
              <span className="h-5 w-5 rounded-full border border-slate-300 bg-white"></span>
            </div>
          </div>

          {notice && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {notice}
            </div>
          )}

          {step === 3 ? (
            <div className="rounded-lg border border-green-200 bg-white p-8 text-center dark:border-green-800 dark:bg-gray-800">
              <CheckCircleIcon className="mx-auto mb-3 h-12 w-12 text-green-600" />
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Compra confirmada</h2>
              <p className="mb-1 text-gray-600 dark:text-gray-400">Tu orden fue creada correctamente.</p>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                Numero de orden: <span className="font-semibold">{orderData?.orderCode}</span>
              </p>
              <Link
                to="/products"
                className="inline-block rounded-lg bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700"
              >
                Seguir comprando
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                    <MapPinIcon className="h-5 w-5" />
                    Informacion de Envio
                  </h2>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Nombre Completo *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Telefono *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+57 312 345 6789"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Codigo Postal</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="110111"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-semibold text-slate-700">Direccion *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Calle 123 #45-67"
                      className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Departamento *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Bogota"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Ciudad *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Bogota"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-semibold text-slate-700">Pais</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
                    >
                      <option value="">Choose option...</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Peru">Peru</option>
                      <option value="Chile">Chile</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                    <TruckIcon className="h-5 w-5" />
                    Metodo de Envio
                  </h2>

                  <div className="space-y-2">
                    {SHIPPING_METHODS.map((method) => {
                      const active = formData.shippingMethod === method.id;
                      return (
                        <label
                          key={method.id}
                          className={`block cursor-pointer rounded border p-3 transition ${
                            active
                              ? "border-cyan-500 bg-cyan-50"
                              : "border-slate-200 bg-white hover:border-cyan-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.id}
                            checked={active}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <p className="text-sm font-semibold text-slate-800">{method.label}</p>
                          <p className="text-xs text-slate-500">Costo: {formatCopCurrency(method.cost)}</p>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {step === 2 && (
                  <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                      <LockClosedIcon className="h-5 w-5 text-green-600" />
                      Metodo de pago
                    </h2>
                    <div className="space-y-2">
                      {["paypal", "tarjeta", "transferencia"].map((method) => (
                        <label key={method} className="flex items-center gap-2 rounded border border-slate-200 p-2">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={formData.paymentMethod === method}
                            onChange={handleChange}
                            className="h-4 w-4 accent-cyan-600"
                          />
                          <span className="text-sm capitalize">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-20 rounded-lg border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Resumen del Pedido</h3>

                  <div className="space-y-2 border-b border-slate-200 pb-4 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>{formatCopCurrency(summary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>IVA (19%)</span>
                      <span>{formatCopCurrency(summary.tax)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Envio</span>
                      <span>{formatCopCurrency(summary.shipping)}</span>
                    </div>
                  </div>

                  <div className="my-4 flex justify-between">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-3xl font-bold text-cyan-500">{formatCopCurrency(summary.total)}</span>
                  </div>

                  <button
                    onClick={step === 1 ? handleContinue : handlePlaceOrder}
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 py-3 font-semibold text-white shadow-md transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-cyan-300"
                  >
                    {step === 1 ? "Continuar a Pago" : isSubmitting ? "Procesando..." : "Confirmar y Pagar"}
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>

                  <p className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-slate-500">
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
