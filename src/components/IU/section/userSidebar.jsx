import { ChevronRightIcon, ChevronDoubleLeftIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import CustomerService from "../../../services/customer/CustomerService";
import SelectInput from "../forms/selectInput";
import CollapsibleMenu from "../forms/collapsibleMenu";

export default function UserSidebar({ items = [], user, onToggleCollapse, dark, onToggleTheme, className = "" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const currentUser = CustomerService.getCurrentUser();
  const displayName =
    user?.name ||
    [currentUser?.customerName, currentUser?.customerLastName].filter(Boolean).join(" ") ||
    currentUser?.name ||
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") ||
    currentUser?.username ||
    currentUser?.customerEmail ||
    currentUser?.email ||
    user?.name ||
    "Usuario";

  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  }

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    logout();
    navigate("/");
  };

  const handleGoHome = () => {
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <aside className={`h-[100dvh] w-64 shrink-0 border-r bg-gray-100 dark:border-gray-700 dark:bg-gray-900 flex flex-col ${className}`}>
      <div className="h-14 flex items-center justify-between px-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 px-2">
          TechCol
        </span>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded-lg bg-gray-200 dark:bg-gray-700 p-1.5 hover:bg-gray-300 dark:hover:bg-gray-600 transition focus:outline-none"
          aria-label="Contraer menu"
        >
          <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        </button>
      </div>

      <div className="p-2 space-y-2 overflow-y-auto flex-1">
        {items.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.label}
            href={item.href}
            type={item.type}
            options={item.options}
            value={item.value}
            onChange={item.onChange}
            onSelectOption={item.onSelectOption}
          />
        ))}
      </div>

      {user && (
        <div className="mt-auto">
          <div className="h-14 border-t border-gray-200 dark:border-gray-700 px-2 flex items-center">
            <button
              type="button"
              onClick={onToggleTheme}
              className="w-full flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-lg transition"
              aria-label={dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            >
              {dark ? (
                <SunIcon className="w-5 h-5 text-yellow-500" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Tema
              </span>
            </button>
          </div>

          <div className="h-16 border-t border-gray-200 dark:border-gray-700 px-2 relative flex items-center" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-full flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-lg transition cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {displayName}
              </span>
              <ChevronRightIcon className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? "rotate-180" : "rotate-0"}`} />
            </button>

            {menuOpen && (
              <div className="absolute left-full bottom-0 ml-2 bg-white dark:bg-gray-800 rounded shadow-lg py-2 z-[60] animate-fade-in min-w-max">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-cyan-100 dark:hover:bg-gray-700 transition whitespace-nowrap"
                  onClick={handleGoHome}
                >
                  Ir a inicio
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-cyan-100 dark:hover:bg-gray-700 transition whitespace-nowrap"
                  onClick={handleLogout}
                >
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

function SidebarItem({ icon: Icon, label, href, type = "link", options = [], onChange, value, onSelectOption }) {
  if (type === "select") {
    return (
      <div className="px-2 py-2">
        <SelectInput
          label={label}
          options={options}
          value={value}
          onChange={onChange}
          placeholder={`Selecciona ${label.toLowerCase()}`}
        />
      </div>
    );
  }

  if (type === "collapsible") {
    return (
      <CollapsibleMenu
        icon={Icon}
        label={label}
        options={options}
        onSelectOption={onSelectOption}
      />
    );
  }

  return (
    <NavLink
      to={href || "#"}
      className={({ isActive }) =>
        `flex items-center gap-3 p-2 rounded-lg transition ${isActive ? "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100" : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"}`
      }
    >
      {Icon && <Icon className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
      <span className="text-sm font-medium">
        {label}
      </span>
    </NavLink>
  );
}
