import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import config from "../../config/config";

const parseJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

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

const getAccessPathPrefix = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return "user";

  try {
    const payload = parseJwtPayload(token);
    const role = String(payload?.role ?? "").toUpperCase();
    return role.includes("ADMIN") ? "admin" : "user";
  } catch {
    return "user";
  }
};

const getTokenEmail = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return "";
  const payload = parseJwtPayload(token);
  return String(payload?.sub ?? "");
};

const getCustomerId = (user) =>
  user?.customerId ?? user?.customer_id ?? user?.id ?? user?.userId ?? null;

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [error] = useState(null);
  const [productsError, setProductsError] = useState("");
  const [homeError, setHomeError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [notice, setNotice] = useState("");

  const isAuthenticated = CustomerService.isAuthenticated();
  const storedUser = CustomerService.getCurrentUser();
  const customerId = getCustomerId(storedUser);
  const tokenEmail = getTokenEmail();
  const displayName =
    storedUser?.customerName ||
    storedUser?.name ||
    storedUser?.username ||
    (tokenEmail ? tokenEmail.split("@")[0] : "Demo User");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productService.getAllProducts();
        const host = config.api.baseURL.replace(/\/api\/?$/, "");
        const uploadsPath = config.uploadsPath.replace(/\/+$/, "");

        const normalized = (products || []).map((product) => {
          const rawPrice = Number(product?.price ?? 0);
          const stockNumber = Number(product?.stock ?? 0);
          const imageName = product?.imageUrl || "";
          const productImage = imageName
            ? imageName.startsWith("http")
              ? imageName
              : `${host}${uploadsPath}/${imageName}`
            : "";

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

        setAllProducts(normalized);
        setFeaturedProducts(normalized.slice(0, 6));
        setProductsError("");
      } catch {
        setProductsError("No se pudieron cargar los productos.");
        setAllProducts([]);
        setFeaturedProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) {
        setCartItems([]);
        setHomeError("");
        return;
      }

      if (!customerId) {
        setCartItems([]);
        setHomeError("No se pudo identificar tu cuenta para cargar tus pedidos.");
        return;
      }

      try {
        const items = await cartService.getCartItems();
        setCartItems(items);
        setHomeError("");
      } catch {
        setCartItems([]);
        setHomeError("No se pudo cargar el estado de tu pedido actual.");
      }
    };

    loadCart();
    const handleUpdated = () => {
      loadCart();
    };

    window.addEventListener(cartService.CART_UPDATED_EVENT, handleUpdated);
    return () => window.removeEventListener(cartService.CART_UPDATED_EVENT, handleUpdated);
  }, [isAuthenticated, customerId]);

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

  const productsById = useMemo(() => {
    return allProducts.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});
  }, [allProducts]);

  const currentOrderItem = useMemo(() => {
    if (!cartItems.length) return null;

    const sorted = [...cartItems].sort((a, b) => {
      const dateA = new Date(a?.updatedAt ?? a?.createdAt ?? 0).getTime();
      const dateB = new Date(b?.updatedAt ?? b?.createdAt ?? 0).getTime();
      return dateB - dateA;
    });

    return sorted[0];
  }, [cartItems]);

  const orderProduct = currentOrderItem
    ? productsById[Number(currentOrderItem.product_id)]
    : null;

  const orderStateLabel = currentOrderItem ? "Procesando" : "Sin pedidos";
  const orderStatusBadge = currentOrderItem ? "Pendiente" : "Vacio";

  const notifications = useMemo(() => {
    const items = [];

    if (cartItems.length > 0) {
      const quantity = cartItems.reduce(
        (sum, item) => sum + Number(item?.quantity ?? 0),
        0
      );
      items.push({
        title: "Carrito actualizado",
        body: `Tienes ${quantity} producto(s) en tu carrito actualmente.`,
        time: "Tiempo real",
        tone: "blue",
      });
    }

    const available = allProducts.filter((product) => product.stockAmount > 0);
    if (available.length > 0) {
      items.push({
        title: "Productos disponibles",
        body: `${available.length} productos se encuentran disponibles en catalogo.`,
        time: "Tiempo real",
        tone: "green",
      });
    }

    if (items.length === 0) {
      items.push({
        title: "Sin notificaciones",
        body: "Todavia no hay actividad reciente en tu cuenta.",
        time: "Ahora",
        tone: "gray",
      });
    }

    return items;
  }, [allProducts, cartItems]);

  const accessPathPrefix = getAccessPathPrefix();

  const authenticatedHome = (
    <section className="w-full bg-white py-8 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <header className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
            Bienvenido de vuelta, {displayName} !
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Aqui esta lo que necesitas saber sobre tu cuenta.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100">Estado del Pedido Actual</h2>
              <Package className="h-5 w-5 text-slate-600 dark:text-gray-300" />
            </div>

            <div className="rounded-md bg-slate-100 p-4 dark:bg-gray-900">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Compra actual</p>
                  <p className="text-2xl font-bold leading-tight text-slate-900 dark:text-gray-100">
                    {orderProduct?.name ?? "Aun no tienes compras en curso"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Pedido actualizado el {formatDateLabel(currentOrderItem?.updatedAt ?? currentOrderItem?.createdAt)}
                  </p>
                </div>
                <span className="rounded bg-amber-200 px-2 py-1 text-xs font-semibold text-amber-800">
                  {orderStatusBadge}
                </span>
              </div>

              <div className="mb-3 grid grid-cols-3 gap-2 text-xs text-slate-600 dark:text-gray-300">
                <div className="rounded border border-cyan-300 bg-cyan-50 p-2 dark:border-cyan-800 dark:bg-cyan-900/30">
                  <p className="mb-1 flex items-center gap-1 font-semibold text-cyan-800">
                    <CircleDashed className="h-3.5 w-3.5" />
                    {orderStateLabel}
                  </p>
                  <p>Estado actual</p>
                </div>
                <div className="rounded border border-slate-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
                  <p className="mb-1 flex items-center gap-1 font-semibold">
                    <Truck className="h-3.5 w-3.5" />
                    En camino
                  </p>
                  <p>Proximo</p>
                </div>
                <div className="rounded border border-slate-200 bg-white p-2 opacity-70 dark:border-gray-700 dark:bg-gray-800">
                  <p className="mb-1 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Entregado
                  </p>
                  <p>Final</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-gray-400">
                Total de items en carrito: {cartItems.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0)}
              </p>
            </div>

            <Link
              to={`/${accessPathPrefix}/entities/orders`}
              className="mt-4 inline-flex w-full items-center justify-center rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400"
            >
              Ver todos los pedidos
            </Link>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-gray-100">Accesos Rapidos</h2>

            <div className="space-y-2">
              <Link
                to="/products"
                className="flex items-center gap-2 rounded bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Package className="h-4 w-4" />
                Continuar comprando
              </Link>
              <Link
                to={`/${accessPathPrefix}/entities/orders`}
                className="flex items-center gap-2 rounded bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mis Pedidos
              </Link>
              <Link
                to={`/${accessPathPrefix}/profile`}
                className="flex items-center gap-2 rounded bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <UserCircle2 className="h-4 w-4" />
                Mi Perfil
              </Link>
            </div>
          </article>
        </div>

        <article className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-gray-100">
            <Bell className="h-4 w-4" />
            Notificaciones
          </h2>

          <div className="space-y-2">
            {notifications.map((notification, index) => {
              const toneClass =
                notification.tone === "green"
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/30"
                  : notification.tone === "gray"
                    ? "border-slate-200 bg-slate-50 dark:border-gray-700 dark:bg-gray-900"
                    : "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/30";

              const timeClass =
                notification.tone === "green"
                  ? "text-emerald-600"
                  : notification.tone === "gray"
                    ? "text-slate-500"
                    : "text-blue-600";

              return (
                <div key={`${notification.title}-${index}`} className={`rounded border px-3 py-2 ${toneClass}`}>
                  <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">{notification.title}</p>
                  <p className="text-xs text-slate-600 dark:text-gray-300">{notification.body}</p>
                  <p className={`text-xs ${timeClass}`}>{notification.time}</p>
                </div>
              );
            })}
          </div>
        </article>

        {homeError && (
          <div className="mt-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
            {homeError}
          </div>
        )}
      </div>

      <ProductShowcase title="Productos Destacados para Ti" products={featuredProducts} onAddToCart={handleAddToCart} />
    </section>
  );

  const guestHome = (
    <>
      <HomeHeroSection
        showPrimaryAction={!isAuthenticated}
        imageUrl={images.TechCol_logo_light.url}
        imageAlt="Logo oficial de TechCol"
      />

      <FeaturesGrid />
      <ProductShowcase products={featuredProducts} onAddToCart={handleAddToCart} />

      <ConsultationSection
        title="Necesitas asesoramiento?"
        description="Nuestro equipo de expertos esta disponible para ayudarte a elegir los mejores componentes."
        buttonText="Contactar soporte"
      />
    </>
  );

  return (
    <div className="w-full dark:bg-gray-900">
      {isAuthenticated ? authenticatedHome : guestHome}

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
