import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import ImageComponent from "../image";
import { AuthContext } from "../../../context/AuthContext";
import CustomerService from "../../../services/customer/CustomerService";

const getRolePathPrefix = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return "user";

  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    const role = String(JSON.parse(json)?.role ?? "").toUpperCase();
    return role.includes("ADMIN") ? "admin" : "user";
  } catch {
    return "user";
  }
};

export default function MainHeader() {
  const { logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const isAuthenticated = CustomerService.isAuthenticated();
  const currentUser = CustomerService.getCurrentUser();

  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  }

  React.useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleProfile = () => {
    setMenuOpen(false);
    const pathPrefix = getRolePathPrefix();
    navigate(`/${pathPrefix}/profile`);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
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
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-gray-200 transition hover:text-white">
            <ShoppingCart color="#ffffffff" />
          </button>

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <img
                  src={currentUser?.photoUrl || currentUser?.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="h-10 w-10 rounded-full border-2 border-cyan-400 object-cover"
                />
              </button>
              {menuOpen && (
                <div className="animate-fade-in absolute right-0 z-50 mt-2 w-44 rounded bg-white py-2 text-slate-900 shadow-lg">
                  <button
                    className="block w-full px-4 py-2 text-left hover:bg-cyan-100"
                    onClick={handleProfile}
                  >
                    Perfil
                  </button>
                  <button
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
