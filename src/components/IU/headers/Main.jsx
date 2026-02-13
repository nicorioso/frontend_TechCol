import React, { useContext, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from 'lucide-react';
import ImageComponent from "../image";
import { AuthContext } from "../../../context/AuthContext";
import CustomerService from "../../../services/customer/CustomerService";

export default function MainHeader() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const isAuthenticated = CustomerService.isAuthenticated();
  const currentUser = CustomerService.getCurrentUser();

  // Cerrar menú al hacer click fuera
  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  }
  // Efecto para cerrar menú
  React.useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleProfile = () => {
    setMenuOpen(false);
    navigate('/user/profile');
  };
  const handleLogout = () => {
    setMenuOpen(false);
    // Limpiar localStorage completamente relacionado a sesión
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    logout();
    navigate('/');
  };
  return (
    <header className="sticky top-0 w-full z-10 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-2 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 text-2xl font-bold">
          <ImageComponent
            id="TechCol_logo" alttext="TechCol_logo" style="h-12"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-200 hover:text-white transition">Inicio</Link>
          <Link to="/" className="text-gray-200 hover:text-white transition">Productos</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <button className="text-gray-200 hover:text-white transition">
            <ShoppingCart color='#ffffffff' />
          </button>

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <img
                  src={currentUser?.photoUrl || currentUser?.avatar || '/default-avatar.png'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover"
                />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-slate-900 rounded shadow-lg py-2 z-50 animate-fade-in">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-cyan-100"
                    onClick={handleProfile}
                  >
                    Perfil
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-cyan-100"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="px-4 py-2 border-2 border-gray-400 text-gray-200 rounded hover:bg-gray-700 transition" to="/auth/login">
                Iniciar sesión
              </Link>
              <Link className="px-4 py-2 bg-cyan-400 text-slate-900 font-semibold rounded hover:bg-cyan-300 transition" to="/auth/register">
                Registrarse
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
