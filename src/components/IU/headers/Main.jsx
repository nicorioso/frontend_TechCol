import React, { useCallback, useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Moon, Sun } from "lucide-react";
import ImageComponent from "../image";
import { AuthContext } from "../../../context/AuthContext";
import CustomerService from "../../../services/customer/CustomerService";
import cartService from "../../../services/cart/cartService";
import useTheme from "../../../hooks/useTheme";
import useClickOutside from "../../../hooks/useClickOutside";
import { getRolePathPrefix } from "../../../utils/authSession";
import { getUserDisplayName, getUserShortName } from "../../../utils/userIdentity";

export default function MainHeader() {
  const { logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [dark, toggleTheme] = useTheme();
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const isAuthenticated = CustomerService.isAuthenticated();
  const currentUser = CustomerService.getCurrentUser();
  const shortName = getUserShortName(currentUser);
  const displayName = getUserDisplayName(currentUser);

  useClickOutside(menuRef, menuOpen, () => setMenuOpen(false));

  const loadCartCount = useCallback(async () => {
    const items = await cartService.getCartItems();
    const summary = cartService.getCartSummary(items);
    setCartCount(summary.itemCount);
  }, []);

  React.useEffect(() => {
    loadCartCount();

    const handleUpdated = () => loadCartCount();

    window.addEventListener(cartService.CART_UPDATED_EVENT, handleUpdated);
    return () => {
      window.removeEventListener(cartService.CART_UPDATED_EVENT, handleUpdated);
    };
  }, [loadCartCount]);

  const handleProfile = () => {
    setMenuOpen(false);
    const pathPrefix = getRolePathPrefix();
    navigate(`/${pathPrefix}/profile`);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    CustomerService.logout();
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-2 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <ImageComponent id="TechCol_logo" alttext="TechCol_logo" style="h-12" />
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-gray-200 transition hover:text-white">
            Inicio
          </Link>
          <Link to="/products" className="text-gray-200 transition hover:text-white">
            Productos
          </Link>
          <Link to="/contact" className="text-gray-200 transition hover:text-white">
            Asesoria
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md p-1.5 text-gray-200 transition hover:bg-slate-700 hover:text-white"
            aria-label={dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            title={dark ? "Tema claro" : "Tema oscuro"}
          >
            {dark ? <Sun className="h-4 w-4 text-yellow-300" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link
            to="/cart"
            className="relative text-gray-200 transition hover:text-white"
            aria-label="Ir al carrito"
          >
            <ShoppingCart color="#ffffffff" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-cyan-400 px-1.5 py-0.5 text-center text-xs font-bold text-slate-900">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Abrir menu de usuario"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cyan-400 bg-slate-700 text-sm font-semibold uppercase text-cyan-100"
                  aria-label="Usuario"
                  title={displayName}
                >
                  {shortName}
                </div>
              </button>
              {menuOpen && (
                <div className="animate-fade-in absolute right-0 z-50 mt-2 w-44 rounded bg-white py-2 text-slate-900 shadow-lg" role="menu">
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left hover:bg-cyan-100"
                    onClick={handleProfile}
                  >
                    Perfil
                  </button>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left hover:bg-cyan-100"
                    onClick={handleLogout}
                  >
                    Cerrar sesion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                className="rounded border-2 border-gray-400 px-4 py-2 text-gray-200 transition hover:bg-gray-700"
                to="/auth/login"
              >
                Iniciar sesion
              </Link>
              <Link
                className="rounded bg-cyan-400 px-4 py-2 font-semibold text-slate-900 transition hover:bg-cyan-300"
                to="/auth/register"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
