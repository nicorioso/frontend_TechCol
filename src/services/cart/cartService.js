import { axiosInstance } from "../api";

const GUEST_CART_KEY = "guest_cart_v1";
const AUTH_CART_PREFIX = "auth_cart_v1_";
const CHECKOUT_DRAFT_PREFIX = "checkout_draft_v1_";
const TAX_RATE = 0.19;
const FREE_SHIPPING_THRESHOLD = 250000;
const STANDARD_SHIPPING = 15000;
const CART_UPDATED_EVENT = "cart:updated";

const parseJson = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const emitCartUpdated = () => {
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
};

const getStoredUser = () => {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return null;
  return parseJson(rawUser, null);
};

const getCustomerIdFromUser = (user) => {
  if (!user || typeof user !== "object") return null;
  return user.customerId ?? user.customer_id ?? user.id ?? user.userId ?? null;
};

const getSession = () => {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  const user = getStoredUser();
  const customerId = getCustomerIdFromUser(user);

  return {
    isAuthenticated,
    user,
    customerId,
  };
};

const getAuthCartKey = (customerId) => `${AUTH_CART_PREFIX}${customerId}`;
const getDraftKey = (customerId) => `${CHECKOUT_DRAFT_PREFIX}${customerId ?? "guest"}`;
const hasLocalCartCache = (customerId = null) => {
  const key = customerId ? getAuthCartKey(customerId) : GUEST_CART_KEY;
  return localStorage.getItem(key) !== null;
};

const normalizeCartItem = (item) => {
  const productId = Number(item?.product_id ?? item?.productId ?? item?.id);
  if (!Number.isFinite(productId)) return null;

  const quantity = Number(item?.quantity ?? 1);
  const unitPrice = Number(item?.unit_price ?? item?.unitPrice ?? item?.price ?? 0);

  return {
    product_id: productId,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    unit_price: Number.isFinite(unitPrice) ? unitPrice : 0,
    product_name:
      item?.product_name ?? item?.productName ?? item?.name ?? `Producto ${productId}`,
    imageUrl: item?.imageUrl ?? item?.image ?? "",
  };
};

const normalizeCart = (items) =>
  (Array.isArray(items) ? items : [])
    .map(normalizeCartItem)
    .filter(Boolean);

const readLocalCart = (customerId = null) => {
  const key = customerId ? getAuthCartKey(customerId) : GUEST_CART_KEY;
  const raw = localStorage.getItem(key);
  return normalizeCart(parseJson(raw, []));
};

const saveLocalCart = (items, customerId = null) => {
  const key = customerId ? getAuthCartKey(customerId) : GUEST_CART_KEY;
  const normalized = normalizeCart(items);
  localStorage.setItem(key, JSON.stringify(normalized));
  emitCartUpdated();
  return normalized;
};

const upsertItemInCart = (cart, itemToInsert, quantity) => {
  const existingIndex = cart.findIndex((item) => item.product_id === itemToInsert.product_id);

  if (existingIndex >= 0) {
    const nextQty = cart[existingIndex].quantity + quantity;
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity: nextQty,
      unit_price: itemToInsert.unit_price,
      product_name: itemToInsert.product_name,
      imageUrl: itemToInsert.imageUrl,
    };
  } else {
    cart.push({
      ...itemToInsert,
      quantity,
    });
  }

  return cart;
};

const hydrateAuthCartFromBackend = async (customerId) => {
  if (!customerId) return [];

  try {
    const response = await axiosInstance.get(`/cart/${customerId}`);
    const normalized = normalizeCart(response?.data);
    saveLocalCart(normalized, customerId);
    return normalized;
  } catch {
    return readLocalCart(customerId);
  }
};

const getCartItems = async () => {
  const { isAuthenticated, customerId } = getSession();

  if (!isAuthenticated || !customerId) {
    return readLocalCart();
  }

  const localAuthCart = readLocalCart(customerId);
  // Si ya existe cache local (incluso vacio), no rehidratar desde backend.
  if (hasLocalCartCache(customerId)) return localAuthCart;

  return hydrateAuthCartFromBackend(customerId);
};

const addItem = async (product, quantity = 1) => {
  const parsedQuantity = Number(quantity);
  if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
    return {
      mode: "invalid",
      items: [],
    };
  }

  const normalizedProduct = normalizeCartItem(product);
  if (!normalizedProduct) {
    return {
      mode: "invalid",
      items: [],
    };
  }

  const { isAuthenticated, customerId } = getSession();

  if (isAuthenticated && customerId) {
    const current = readLocalCart(customerId);
    const updated = upsertItemInCart([...current], normalizedProduct, parsedQuantity);
    saveLocalCart(updated, customerId);

    try {
      await axiosInstance.post(`/cart/${customerId}`, {
        product_id: normalizedProduct.product_id,
        quantity: parsedQuantity,
      });
    } catch {
      // Si falla backend, el carrito local mantiene la experiencia.
    }

    return {
      mode: "backend",
      customerId,
      items: updated,
    };
  }

  const currentGuest = readLocalCart();
  const updatedGuest = upsertItemInCart([...currentGuest], normalizedProduct, parsedQuantity);
  saveLocalCart(updatedGuest);

  return {
    mode: "guest",
    items: updatedGuest,
  };
};

const updateQuantity = async (productId, quantity) => {
  const parsedProductId = Number(productId);
  const parsedQuantity = Number(quantity);
  const { isAuthenticated, customerId } = getSession();

  const current = readLocalCart(isAuthenticated && customerId ? customerId : null);

  let updated;
  if (parsedQuantity <= 0) {
    updated = current.filter((item) => item.product_id !== parsedProductId);
  } else {
    updated = current.map((item) =>
      item.product_id === parsedProductId
        ? { ...item, quantity: parsedQuantity }
        : item
    );
  }

  return saveLocalCart(updated, isAuthenticated && customerId ? customerId : null);
};

const removeItem = async (productId) => {
  const parsedProductId = Number(productId);
  const { isAuthenticated, customerId } = getSession();
  const current = readLocalCart(isAuthenticated && customerId ? customerId : null);
  const updated = current.filter((item) => item.product_id !== parsedProductId);

  return saveLocalCart(updated, isAuthenticated && customerId ? customerId : null);
};

const clearCart = async () => {
  const { isAuthenticated, customerId } = getSession();
  return saveLocalCart([], isAuthenticated && customerId ? customerId : null);
};

const getCartSummary = (items) => {
  const normalized = normalizeCart(items);
  const itemCount = normalized.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);
  const subtotal = normalized.reduce(
    (sum, item) => sum + Number(item.unit_price ?? 0) * Number(item.quantity ?? 0),
    0
  );
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING;
  const total = subtotal + tax + shipping;

  return {
    itemCount,
    subtotal,
    tax,
    shipping,
    total,
  };
};

const getGuestCart = () => readLocalCart();

const getCheckoutDraft = () => {
  const { customerId } = getSession();
  const raw = localStorage.getItem(getDraftKey(customerId));
  return parseJson(raw, {});
};

const saveCheckoutDraft = (draft) => {
  const { customerId } = getSession();
  localStorage.setItem(getDraftKey(customerId), JSON.stringify(draft ?? {}));
};

const clearCheckoutDraft = () => {
  const { customerId } = getSession();
  localStorage.removeItem(getDraftKey(customerId));
};

export const cartService = {
  CART_UPDATED_EVENT,
  TAX_RATE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING,
  getSession,
  getCartItems,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  getCartSummary,
  getGuestCart,
  getCheckoutDraft,
  saveCheckoutDraft,
  clearCheckoutDraft,
};

export default cartService;
