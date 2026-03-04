import { useState, useRef, useEffect } from 'react';
import UserSidebar from '../IU/section/userSidebar';
import { useNavigate, NavLink } from 'react-router-dom';
import useStore from '../../store/useStore';
import useTheme from '../../hooks/useTheme';
import { axiosInstance } from '../../services/api';

import {
  ChevronDoubleRightIcon,
  ChevronRightIcon,
  HomeIcon,
  MoonIcon,
  Square2StackIcon,
  SunIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const decodeTokenPayload = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const getRolePathPrefix = () => {
  const payload = decodeTokenPayload();
  const role = String(payload?.role ?? '').toUpperCase();
  return role.includes('ADMIN') ? 'admin' : 'user';
};

const getEmailFromToken = () => String(decodeTokenPayload()?.sub ?? '');

export default function Sidebar({ content, onEntitySelect }) {
  const navigate = useNavigate();
  const setSelectedEntity = useStore((s) => s.setSelectedEntity);
  const pathPrefix = getRolePathPrefix();

  const currentUser = (() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const tokenEmail = getEmailFromToken();
  const currentCustomerId = currentUser?.customerId ?? currentUser?.customer_id ?? null;
  const currentCustomerName = currentUser?.customerName ?? '';
  const currentCustomerLastName = currentUser?.customerLastName ?? '';
  const currentCustomerEmail = currentUser?.customerEmail ?? currentUser?.email ?? '';
  const currentUserName = currentUser?.name ?? '';

  const initialAccountName =
    [currentCustomerName, currentCustomerLastName].filter(Boolean).join(' ') ||
    currentUser?.name ||
    currentUser?.username ||
    currentCustomerEmail ||
    (tokenEmail.split('@')[0] || 'Usuario');

  const [accountName, setAccountName] = useState(initialAccountName);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [entityMenuOpen, setEntityMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const entityMenuRef = useRef(null);

  const toggleCollapse = () => {
    setMenuOpen(false);
    setEntityMenuOpen(false);
    setCollapsed((c) => !c);
  };

  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
    if (entityMenuRef.current && !entityMenuRef.current.contains(e.target)) {
      setEntityMenuOpen(false);
    }
  }

  useEffect(() => {
    if (menuOpen || entityMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen, entityMenuOpen]);

  useEffect(() => {
    const hasCompleteName = Boolean(
      [currentCustomerName, currentCustomerLastName].filter(Boolean).join(' ') ||
      currentUserName
    );

    if (hasCompleteName) {
      setAccountName(initialAccountName);
      return;
    }

    if (!tokenEmail) return;

    const loadNameFromCustomers = async () => {
      try {
        const response = await axiosInstance.get('/customers');
        const customers = Array.isArray(response.data) ? response.data : [];

        const matched = customers.find((customer) => {
          const customerEmail = String(
            customer?.customerEmail ?? customer?.customer_email ?? customer?.email ?? ''
          ).toLowerCase();
          return customerEmail === tokenEmail.toLowerCase();
        });

        if (!matched) return;

        const resolvedName =
          [matched?.customerName, matched?.customerLastName].filter(Boolean).join(' ') ||
          matched?.name ||
          matched?.username ||
          matched?.customerEmail ||
          initialAccountName;

        setAccountName((prev) => (prev === resolvedName ? prev : resolvedName));

        const mergedUser = {
          customerId: matched?.customerId ?? matched?.customer_id ?? currentCustomerId,
          name: currentUserName,
          customerName: matched?.customerName ?? currentCustomerName,
          customerLastName: matched?.customerLastName ?? currentCustomerLastName,
          customerEmail: matched?.customerEmail ?? currentCustomerEmail ?? tokenEmail,
        };

        localStorage.setItem('user', JSON.stringify(mergedUser));
      } catch {
        // keep fallback name when request fails or user has no permission
      }
    };

    loadNameFromCustomers();
  }, [
    currentCustomerEmail,
    currentCustomerId,
    currentCustomerLastName,
    currentCustomerName,
    currentUserName,
    initialAccountName,
    tokenEmail,
  ]);

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleGoHome = () => {
    setMenuOpen(false);
    navigate('/');
  };

  const handleEntitySelect = (entityValue) => {
    setSelectedEntity(entityValue);
    if (onEntitySelect) onEntitySelect(entityValue);
    navigate(`/${pathPrefix}/entities/${entityValue}`);
  };

  const entityOptions = [
    { value: 'customers', label: 'Clientes' },
    { value: 'admins', label: 'Administradores' },
    { value: 'products', label: 'Productos' },
    { value: 'carts', label: 'Carritos' },
    { value: 'orders', label: 'Pedidos' },
  ];

  const items = [
    { label: 'Inicio', icon: HomeIcon, href: `/${pathPrefix}/profile` },
    {
      label: 'Entidades',
      icon: Square2StackIcon,
      type: 'collapsible',
      options: entityOptions,
      onSelectOption: handleEntitySelect,
    },
    { label: 'Difusiones', icon: MegaphoneIcon, href: '/broadcasts' },
    { label: 'Configuración', icon: Cog6ToothIcon, href: `/${pathPrefix}/settings` },
  ];

  return (
    <>
      <div className="flex w-full min-w-0 items-start overflow-x-hidden">
        {!collapsed && (
          <UserSidebar
            items={items}
            user={{
              name: accountName,
              image: 'https://i.pravatar.cc/40',
            }}
            onToggleCollapse={toggleCollapse}
            dark={dark}
            onToggleTheme={toggleTheme}
          />
        )}

        {collapsed && (
          <aside className="sticky top-0 self-start h-screen w-14 shrink-0 overflow-visible border-r border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900 flex flex-col">
            <div>
              <div className="h-14 flex items-center px-2 border-b border-gray-200 dark:border-gray-700">
                <div className="w-full">
                  <button
                    type="button"
                    onClick={toggleCollapse}
                    className="rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none text-gray-700 dark:text-gray-200 w-9 h-9 flex items-center justify-center"
                    aria-label="Expandir menú"
                  >
                    <ChevronDoubleRightIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  </button>
                </div>
              </div>

              <div className="px-2 py-2 space-y-2 overflow-visible flex-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  if (item.type === 'collapsible') {
                    return (
                      <div key={item.label} className="relative" ref={entityMenuRef}>
                        <button
                          title={item.label}
                          onClick={() => {
                            setMenuOpen(false);
                            setEntityMenuOpen((v) => !v);
                          }}
                          className="w-9 h-9 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-200 flex items-center justify-center"
                        >
                          {Icon && <Icon className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
                        </button>

                        {entityMenuOpen && item.options && item.options.length > 0 && (
                          <div className="absolute left-full top-0 ml-2 bg-white dark:bg-gray-800 rounded shadow-lg py-2 z-[60] animate-fade-in min-w-max">
                            {item.options.map((option) => (
                              <button
                                key={option.value}
                                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-cyan-100 dark:hover:bg-gray-700 transition whitespace-nowrap"
                                onClick={() => {
                                  if (item.onSelectOption) item.onSelectOption(option.value);
                                  setEntityMenuOpen(false);
                                }}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.label}
                      to={item.href || '#'}
                      title={item.label}
                      onClick={() => setEntityMenuOpen(false)}
                      className={({ isActive }) =>
                        `w-9 h-9 rounded-lg transition flex items-center justify-center ${
                          isActive
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                        }`
                      }
                    >
                      {Icon && <Icon className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto">
              <div className="h-14 border-t border-gray-200 dark:border-gray-700 px-2 flex items-center">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-9 h-9 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none flex items-center justify-center text-gray-700 dark:text-gray-200"
                  aria-label={dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                  title="Tema"
                >
                  {dark ? (
                    <SunIcon className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              </div>

              <div className="h-16 border-t border-gray-200 dark:border-gray-700 px-2 relative flex items-center" ref={menuRef}>
                <button
                  onClick={() => {
                    setEntityMenuOpen(false);
                    setMenuOpen((v) => !v);
                  }}
                  className="w-9 h-9 rounded-lg transition cursor-pointer flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800"
                  title="Menú de usuario"
                >
                  <ChevronRightIcon className={`w-5 h-5 text-gray-700 dark:text-gray-200 transition-transform ${menuOpen ? 'rotate-180' : 'rotate-0'}`} />
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
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}

        <main className="min-h-screen flex-1 min-w-0 bg-white p-4 dark:bg-gray-900 dark:text-gray-200 sm:p-6 lg:p-10">{content}</main>
      </div>
    </>
  );
}
