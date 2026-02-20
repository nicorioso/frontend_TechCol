import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import CustomerService from "../../../services/customer/CustomerService";

export default function UserSidebar({ items = [], user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const currentUser = CustomerService.getCurrentUser();

  // Cerrar menú al hacer click fuera
  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  }

  // Efecto para cerrar menú
  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    // Limpiar localStorage completamente relacionado a sesión
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    logout();
    navigate('/');
  };

  const handleGoHome = () => {
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <aside className="sticky top-0 h-screen w-64 bg-gray-100 border-r flex flex-col justify-between">
      
      {/* Menu */}
      <div className="p-4 space-y-2">
        {items.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.label}
            href={item.href}
          />
        ))}
      </div>

      {/* Footer */}
      {user && (
        <div className="border-t p-4" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-full flex items-center justify-between hover:bg-gray-200 p-2 rounded-lg transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.photoUrl || currentUser?.avatar || user.image || '/default-avatar.png'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>
            </div>
            <ChevronRightIcon className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? 'rotate-90' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="mt-2 bg-white rounded shadow-lg py-2 z-50 animate-fade-in">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-cyan-100 transition"
                onClick={handleGoHome}
              >
                Ir a inicio
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-cyan-100 transition"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

function SidebarItem({ icon: Icon, label, href }) {
  return (
    <NavLink
      to={href || '#'}
      className={({ isActive }) =>
        `flex items-center gap-3 p-2 rounded-lg transition ${isActive ? 'bg-gray-300 text-gray-800' : 'hover:bg-gray-200 text-gray-700'}`
      }
    >
      {Icon && <Icon className="w-5 h-5 text-gray-600" />}
      <span className="text-sm font-medium">
        {label}
      </span>
    </NavLink>
  );
}