import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  CircleDashed,
  Package,
  Truck,
  UserCircle2,
} from "lucide-react";
import ConsultationSection from "../IU/consult/ConsultationSection";
import FeaturesGrid from "../IU/grid/FeaturedGrid";
import HomeHeroSection from "../IU/hero/HomeHeroSection/HomeHeroSection";
import ProductShowcase from "../IU/cards/ProductShowcase";
import { images } from "../../assets/img/img_url";
import CustomerService from "../../services/customer/CustomerService";
import productService from "../../services/product/productService";
import cartService from "../../services/cart/cartService";
import { useOrdersHook } from "../../hooks/useOrdersHook";
import { getRolePathPrefix } from "../../utils/authSession";
import { buildBackendAssetUrl } from "../../utils/backendAssetUrl";
import { getUserDisplayName } from "../../utils/userIdentity";

const ORDER_STATUS_META = {
  pending: {
    badge: "Pendiente",
    badgeClass: "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300",
    activeStep: 0,
  },
  paid: {
    badge: "En camino",
    badgeClass: "border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-900/40 dark:bg-cyan-950/30 dark:text-cyan-300",
    activeStep: 1,
  },
  delivered: {
    badge: "Entregado",
    badgeClass: "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300",
    activeStep: 2,
  },
  default: {
    badge: "Pendiente",
    badgeClass: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
    activeStep: 0,
  },
};

const TRACKING_STEPS = [
  {
    id: "processing",
    title: "Procesando",
    subtitle: "Estado actual",
    icon: CircleDashed,
  },
  {
    id: "shipping",
    title: "En camino",
    subtitle: "Siguiente",
    icon: Truck,
  },
  {
    id: "delivered",
    title: "Entregado",
    subtitle: "Final",
    icon: CheckCircle2,
  },
];

const formatDateLabel = (value) => {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getCustomerId = (user) =>
  user?.customerId ?? user?.customer_id ?? user?.id ?? user?.userId ?? null;

const getOrderStatusMeta = (status) =>
  ORDER_STATUS_META[String(status ?? "").toLowerCase()] || ORDER_STATUS_META.default;

const getLatestOrder = (orders) =>
  [...orders].sort((a, b) => {
    const dateA = new Date(a?.orderDate ?? a?.updatedAt ?? a?.createdAt ?? 0).getTime();
    const dateB = new Date(b?.orderDate ?? b?.updatedAt ?? b?.createdAt ?? 0).getTime();
    return dateB - dateA;
  })[0] ?? null;

const getPrimaryOrderDetail = (order) =>
  Array.isArray(order?.orderDetails) ? order.orderDetails[0] ?? null : null;

const getOrderProductName = (order) => {
  const detail = getPrimaryOrderDetail(order);
  return (
    detail?.product?.productName ??
    detail?.product?.product_name ??
    detail?.product?.name ??
    "Pedido reciente"
  );
};

const getOrderItemCount = (order) =>
  (Array.isArray(order?.orderDetails) ? order.orderDetails : []).reduce(
    (sum, detail) => sum + Number(detail?.quantity ?? 0),
    0
  );

const getTrackingCardClass = (index, activeStep) => {
  if (index < activeStep) {
    return "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300";
  }

  if (index === activeStep) {
    return "border-cyan-300 bg-cyan-50 text-cyan-800 shadow-sm dark:border-cyan-900/40 dark:bg-cyan-950/30 dark:text-cyan-300";
  }

  return "border-slate-200 bg-white text-slate-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";
};

function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [error] = useState(null);
  const [productsError, setProductsError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [notice, setNotice] = useState("");

  const isAuthenticated = CustomerService.isAuthenticated();
  const storedUser = CustomerService.getCurrentUser();
  const customerId = getCustomerId(storedUser);
  const displayName = getUserDisplayName(storedUser);
  const { orders, error: ordersError } = useOrdersHook(isAuthenticated ? customerId : null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productService.getAllProducts();

        const normalized = (products || []).map((product) => {
          const rawPrice = Number(product?.price ?? 0);
          const stockNumber = Number(product?.stock ?? 0);
          const productImage = buildBackendAssetUrl(product?.imageUrl ?? product?.image);

          return {
            id: Number(product?.product_id ?? product?.id),
            image: productImage,
            category: "Componentes",
            name: product?.product_name ?? product?.productName ?? "Producto",
            stock: stockNumber > 0 ? "En stock" : "Agotado",
            stockAmount: stockNumber,
            priceAmount: rawPrice,
            price: `$ ${rawPrice.toLocaleString("es-CO")}`,
          };
        });

        setFeaturedProducts(normalized.slice(0, 6));
        setProductsError("");
      } catch {
        setProductsError("No se pudieron cargar los productos.");
        setFeaturedProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) {
        setCartItems([]);
        return;
      }

      try {
        const items = await cartService.getCartItems();
        setCartItems(items);
      } catch {
        setCartItems([]);
      }
    };

    loadCart();

    const handleUpdated = () => {
      loadCart();
    };

    window.addEventListener(cartService.CART_UPDATED_EVENT, handleUpdated);
    return () => window.removeEventListener(cartService.CART_UPDATED_EVENT, handleUpdated);
  }, [isAuthenticated]);

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

  const latestOrder = useMemo(() => (orders.length ? getLatestOrder(orders) : null), [orders]);
  const latestOrderMeta = useMemo(() => getOrderStatusMeta(latestOrder?.status), [latestOrder?.status]);
  const latestOrderProductName = useMemo(
    () => (latestOrder ? getOrderProductName(latestOrder) : ""),
    [latestOrder]
  );
  const latestOrderItemCount = useMemo(
    () => (latestOrder ? getOrderItemCount(latestOrder) : 0),
    [latestOrder]
  );

  const notifications = useMemo(() => {
    const items = [];

    if (latestOrder) {
      items.push({
        title: `Pedido #${latestOrder?.orderId ?? ""} actualizado`,
        body: `Estado actual: ${latestOrderMeta.badge}.`,
        time: formatDateLabel(latestOrder?.orderDate ?? latestOrder?.updatedAt ?? latestOrder?.createdAt),
        tone: latestOrderMeta.activeStep === 2 ? "green" : "blue",
      });
    }

    if (cartItems.length > 0) {
      const quantity = cartItems.reduce(
        (sum, item) => sum + Number(item?.quantity ?? 0),
        0
      );

      items.push({
        title: "Carrito activo",
        body: `Tienes ${quantity} producto(s) listos para continuar la compra.`,
        time: "Tiempo real",
        tone: "blue",
      });
    }

    return items;
  }, [cartItems, latestOrder, latestOrderMeta]);

  const accessPathPrefix = getRolePathPrefix();
  const ordersPath = accessPathPrefix === "admin" ? "/admin/entities/orders" : "/user/profile?tab=ordenes";
  const showCurrentOrder = Boolean(latestOrder && !ordersError);

  const authenticatedHome = (
    <section className="w-full py-10">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <header className="mb-8 rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/90">
          <p className="mb-2 inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-900/30 dark:text-cyan-300">
            Panel de cuenta
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-gray-100">
            Bienvenido de vuelta, {displayName}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
            Aqui tienes el resumen de tu cuenta y accesos clave.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
          {showCurrentOrder ? (
            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-gray-100">Estado del Pedido Actual</h2>
                <div className="rounded-full bg-slate-100 p-2 dark:bg-gray-700">
                  <Package className="h-4 w-4 text-slate-600 dark:text-gray-200" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-gray-400">
                      Compra actual
                    </p>
                    <p className="mt-1 text-2xl font-bold leading-tight text-slate-900 dark:text-gray-100">
                      {latestOrderProductName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                      Pedido actualizado el{" "}
                      {formatDateLabel(latestOrder?.orderDate ?? latestOrder?.updatedAt ?? latestOrder?.createdAt)}
                    </p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${latestOrderMeta.badgeClass}`}>
                    {latestOrderMeta.badge}
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                  {TRACKING_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.id}
                        className={`rounded-xl border p-3 ${getTrackingCardClass(index, latestOrderMeta.activeStep)}`}
                      >
                        <p className="mb-1 flex items-center gap-1 font-semibold">
                          <Icon className="h-4 w-4" />
                          {step.title}
                        </p>
                        <p>{step.subtitle}</p>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Total de items en pedido: {latestOrderItemCount}
                </p>
              </div>

              <Link
                to={ordersPath}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-teal-400"
              >
                Ver todos los pedidos
              </Link>
            </article>
          ) : null}

          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-gray-100">Accesos Rapidos</h2>

            <div className="space-y-2.5">
              <Link
                to="/products"
                className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-cyan-800 dark:hover:bg-cyan-900/30"
              >
                <Package className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                Continuar comprando
              </Link>
              <Link
                to={ordersPath}
                className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-cyan-800 dark:hover:bg-cyan-900/30"
              >
                <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                Mis Pedidos
              </Link>
              <Link
                to={`/${accessPathPrefix}/profile`}
                className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-cyan-800 dark:hover:bg-cyan-900/30"
              >
                <UserCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                Mi Perfil
              </Link>
            </div>
          </article>
        </div>

        {notifications.length ? (
          <article className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-gray-100">
              <Bell className="h-4 w-4" />
              Notificaciones
            </h2>

            <div className="space-y-2.5">
              {notifications.map((notification, index) => {
                const toneClass =
                  notification.tone === "green"
                    ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/30"
                    : "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/30";

                const timeClass =
                  notification.tone === "green" ? "text-emerald-600" : "text-blue-600";

                return (
                  <div key={`${notification.title}-${index}`} className={`rounded-xl border px-4 py-3 ${toneClass}`}>
                    <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">{notification.title}</p>
                    <p className="text-xs text-slate-600 dark:text-gray-300">{notification.body}</p>
                    <p className={`mt-1 text-xs font-medium ${timeClass}`}>{notification.time}</p>
                  </div>
                );
              })}
            </div>
          </article>
        ) : null}
      </div>

      <ProductShowcase title="Productos Destacados para Ti" products={featuredProducts} onAddToCart={handleAddToCart} />
    </section>
  );

  const guestHome = (
    <>
      <HomeHeroSection
        showPrimaryAction={!isAuthenticated}
        imageUrl={images.TechCol_logo.url}
        imageAlt="Logo oficial de TechCol"
      />

      <FeaturesGrid />
      <section className="w-full py-6">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-gray-100">
              Tu tienda de hardware y partes PC en Colombia
            </h2>
            <p className="mb-2">
              En TechCol encuentras componentes de computador para gaming, oficina y creacion de contenido.
              Si quieres optimizar tu equipo, revisa nuestro{" "}
              <Link to="/products" className="font-semibold text-cyan-600 hover:text-cyan-700">
                catalogo de productos
              </Link>{" "}
              o solicita{" "}
              <Link to="/contact" className="font-semibold text-cyan-600 hover:text-cyan-700">
                asesoria de compatibilidad
              </Link>{" "}
              con nuestro equipo.
            </p>
          </article>
        </div>
      </section>
      <ProductShowcase products={featuredProducts} onAddToCart={handleAddToCart} />

      <ConsultationSection
        title="Necesitas asesoramiento?"
        description="Nuestro equipo de expertos esta disponible para ayudarte a elegir los mejores componentes."
        buttonText="Contactar soporte"
        onContactClick={() => navigate("/contact")}
      />
    </>
  );

  return (
    <div className="w-full dark:bg-gray-900">
      {isAuthenticated ? authenticatedHome : guestHome}

      {notice ? (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-lg dark:border-cyan-900 dark:bg-slate-800 dark:text-slate-200">
          {notice}
        </div>
      ) : null}

      <div className="w-full">
        {error && (
          <div className="w-full bg-red-100 p-4 text-center text-red-800 dark:bg-red-900/30 dark:text-red-200">
            <p>{error}</p>
          </div>
        )}
        {productsError && (
          <div className="w-full bg-yellow-100 p-4 text-center text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
            <p>{productsError}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
