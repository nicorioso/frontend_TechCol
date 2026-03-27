import { ChevronRightIcon, ChevronDoubleLeftIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import CustomerService from "../../../services/customer/CustomerService";
import SelectInput from "../forms/selectInput";
import CollapsibleMenu from "../forms/collapsibleMenu";
import useClickOutside from "../../../hooks/useClickOutside";

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

  useClickOutside(menuRef, menuOpen, () => setMenuOpen(false));

  const handleLogout = () => {
    setMenuOpen(false);
    CustomerService.logout();
    logout();
    navigate("/");
  };

  const handleGoHome = () => {
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <aside className={`h-[100dvh] w-64 shrink-0 border-r border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 flex flex-col ${className}`}>
      <div className="h-14 flex items-center justify-between border-b border-slate-200 px-2 dark:border-slate-700">
        <span className="px-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          TechCol
        </span>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded-lg bg-cyan-50 p-1.5 transition hover:bg-cyan-100 focus:outline-none dark:bg-cyan-900/30 dark:hover:bg-cyan-900/50"
          aria-label="Contraer menu"
        >
          <ChevronDoubleLeftIcon className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
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
          <div className="h-14 border-t border-slate-200 dark:border-slate-700 px-2 flex items-center">
            <button
              type="button"
              onClick={onToggleTheme}
              className="w-full rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
              aria-label={dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            >
              {dark ? (
                <SunIcon className="w-5 h-5 text-yellow-500" />
              ) : (
                <MoonIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              )}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Tema
              </span>
            </button>
          </div>

          <div className="relative flex h-16 items-center border-t border-slate-200 px-2 dark:border-slate-700" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Abrir menu de usuario"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {displayName}
              </span>
              <ChevronRightIcon className={`h-4 w-4 text-cyan-600 transition-transform dark:text-cyan-300 ${menuOpen ? "rotate-180" : "rotate-0"}`} />
            </button>

            {menuOpen && (
              <div className="absolute bottom-0 left-full z-[60] ml-2 min-w-max rounded-xl border border-slate-200 bg-white py-2 shadow-lg animate-fade-in dark:border-slate-700 dark:bg-slate-800" role="menu">
                <button
                  type="button"
                  className="block w-full whitespace-nowrap px-4 py-2 text-left text-slate-700 transition hover:bg-cyan-50 dark:text-slate-200 dark:hover:bg-slate-700"
                  onClick={handleGoHome}
                >
                  Ir a inicio
                </button>
                <button
                  type="button"
                  className="block w-full whitespace-nowrap px-4 py-2 text-left text-slate-700 transition hover:bg-cyan-50 dark:text-slate-200 dark:hover:bg-slate-700"
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
        `flex items-center gap-3 rounded-xl p-2 transition ${
          isActive
            ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200"
            : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        }`
      }
    >
      {Icon && <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />}
      <span className="text-sm font-medium">
        {label}
      </span>
    </NavLink>
  );
}
