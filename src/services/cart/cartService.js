import { axiosInstance } from "../api";

const GUEST_CART_KEY = "guest_cart_v1";

const parseJson = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const getStoredUser = () => {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return null;
  return parseJson(rawUser, null);
};

const getCustomerIdFromUser = (user) => {
  if (!user || typeof user !== "object") return null;
  return (
    user.customerId ??
    user.customer_id ??
    user.id ??
    user.userId ??
    null
  );
};

const upsertGuestCartItem = (product, quantity = 1) => {
  const raw = localStorage.getItem(GUEST_CART_KEY);
  const cart = parseJson(raw, []);

  const productId = Number(product?.product_id ?? product?.id);
  if (!Number.isFinite(productId)) return cart;

  const existingIndex = cart.findIndex((item) => Number(item.product_id) === productId);

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      product_id: productId,
      quantity,
      unit_price: Number(product?.price ?? 0),
      product_name: product?.product_name ?? product?.productName ?? "Producto",
      imageUrl: product?.imageUrl ?? "",
    });
  }

  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  return cart;
};

const addItem = async (product, quantity = 1) => {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  const user = getStoredUser();
  const customerId = getCustomerIdFromUser(user);

  if (isAuthenticated && customerId) {
    await axiosInstance.post(`/cart/${customerId}`, {
      product_id: Number(product?.product_id ?? product?.id),
      quantity,
    });

    return {
      mode: "backend",
      customerId,
    };
  }

  const guestCart = upsertGuestCartItem(product, quantity);
  return {
    mode: "guest",
    items: guestCart,
  };
};

const getGuestCart = () => {
  const raw = localStorage.getItem(GUEST_CART_KEY);
  return parseJson(raw, []);
};

export const cartService = {
  addItem,
  getGuestCart,
};

export default cartService;
