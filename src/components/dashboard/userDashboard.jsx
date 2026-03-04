import { useMemo, useState } from 'react';
import { useOrdersHook } from '../../hooks/useOrdersHook';
import {
  SparklesIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  MapPinIcon,
  HeartIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const DATE_FORMAT_OPTIONS = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

const STATUS_META = {
  delivered: {
    label: 'Entregado',
    className: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon,
  },
  paid: {
    label: 'En Proceso',
    className: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon,
  },
  pending: {
    label: 'Pendiente',
    className: 'bg-blue-100 text-blue-800',
    icon: ShoppingCartIcon,
  },
  default: {
    label: 'Desconocido',
    className: 'bg-gray-100 text-gray-800',
    icon: ShoppingCartIcon,
  },
};

const TABS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'ordenes', label: 'Mis Ordenes' },
  { id: 'cuenta', label: 'Mi Cuenta' },
];

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const formatPrice = (price) => {
  const amount = parseFloat(price ?? 0);
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date) => new Date(date).toLocaleDateString('es-ES', DATE_FORMAT_OPTIONS);

const getOrderStatusMeta = (status) =>
  STATUS_META[String(status ?? '').toLowerCase()] || STATUS_META.default;

function LoadingState() {
  return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg text-sm">
      Error: {message}
    </div>
  );
}

function EmptyOrdersState() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
      <ShoppingCartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <p className="text-gray-600 dark:text-gray-400">No tienes ordenes aun</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sublabel, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{label}</p>
          </div>
          <p className="text-3xl font-bold dark:text-white">{value}</p>
          {sublabel && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sublabel}</p>}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, index }) {
  const statusMeta = getOrderStatusMeta(order?.status);
  const StatusIcon = statusMeta.icon;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <StatusIcon className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Orden #{order?.orderId ?? index + 1}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-0.5">
            {formatDate(order?.orderDate ?? order?.createdAt)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Rastreo: {order?.paypalOrderId ?? `TR${String(index + 1).padStart(10, '0')}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(order?.orderPrice)}</p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusMeta.className}`}>
            {statusMeta.label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const user = getUserFromStorage();
  const customerId = user?.customerId ?? user?.customer_id;
  const customerName = user?.customerName ?? user?.name ?? 'Usuario';
  const customerEmail = user?.customerEmail ?? user?.email ?? '';
  const joinDate = user?.createdAt ? formatDate(user.createdAt) : '14/1/2024';

  const { orders, summary, loading, error } = useOrdersHook(customerId);
  const [activeTab, setActiveTab] = useState('resumen');

  const recentOrders = useMemo(() => {
    if (!orders.length) return [];
    return [...orders]
      .sort((a, b) => new Date(b.orderDate ?? b.createdAt) - new Date(a.orderDate ?? a.createdAt))
      .slice(0, 3);
  }, [orders]);

  const tabs = useMemo(
    () => TABS.map((tab) => (tab.id === 'ordenes' ? { ...tab, badge: summary.totalOrders } : tab)),
    [summary.totalOrders]
  );

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="bg-slate-800 text-white px-6 lg:px-12 py-8">
        <h1 className="text-3xl font-bold mb-1">Bienvenido, {customerName}</h1>
        <p className="text-blue-100 text-sm">Miembro desde {joinDate}</p>
      </div>

      <div className="px-6 lg:px-12 py-8">
        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 font-medium transition relative whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-600 dark:border-cyan-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="inline-block ml-2 px-2 py-0.5 text-xs bg-cyan-600 text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'resumen' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={SparklesIcon}
                label="Total Gastado"
                value={formatPrice(summary.totalSpent)}
                sublabel="En todas las compras"
                color="text-blue-600"
              />
              <StatCard
                icon={ShoppingCartIcon}
                label="Ordenes Totales"
                value={summary.totalOrders}
                sublabel="Pedidos realizados"
                color="text-purple-600"
              />
              <StatCard
                icon={CheckCircleIcon}
                label="Entregadas"
                value={summary.delivered}
                sublabel="Ordenes completadas"
                color="text-green-600"
              />
              <StatCard
                icon={ClockIcon}
                label="Pendientes"
                value={summary.pending}
                sublabel="En proceso"
                color="text-yellow-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ordenes Recientes</h2>
                {summary.totalOrders > 3 && (
                  <button
                    onClick={() => setActiveTab('ordenes')}
                    className="text-cyan-600 dark:text-cyan-400 hover:underline text-sm font-medium flex items-center gap-1"
                  >
                    Ver todas <ChevronRightIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState message={error} />
              ) : recentOrders.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {recentOrders.map((order, index) => (
                    <OrderCard key={order.orderId} order={order} index={index} />
                  ))}
                </div>
              ) : (
                <EmptyOrdersState />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition text-left group">
                <CreditCardIcon className="w-6 h-6 text-gray-400 mb-2 group-hover:text-cyan-600 transition" />
                <h3 className="font-semibold dark:text-white text-sm">Metodos de Pago</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Gestiona tus tarjetas</p>
              </button>

              <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition text-left group">
                <MapPinIcon className="w-6 h-6 text-gray-400 mb-2 group-hover:text-cyan-600 transition" />
                <h3 className="font-semibold dark:text-white text-sm">Direcciones</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Actualiza tus direcciones</p>
              </button>

              <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition text-left group">
                <HeartIcon className="w-6 h-6 text-gray-400 mb-2 group-hover:text-cyan-600 transition" />
                <h3 className="font-semibold dark:text-white text-sm">Favoritos</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Tus productos guardados</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'ordenes' && (
          <div className="space-y-4">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} />
            ) : orders.length > 0 ? (
              orders.map((order, index) => <OrderCard key={order.orderId} order={order} index={index} />)
            ) : (
              <EmptyOrdersState />
            )}
          </div>
        )}

        {activeTab === 'cuenta' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white mb-4">Informacion Personal</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre</label>
                  <p className="text-gray-900 dark:text-white mt-1">{customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white mt-1">{customerEmail}</p>
                </div>
                {customerId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ID Cliente</label>
                    <p className="text-gray-900 dark:text-white mt-1 font-mono text-sm">{customerId}</p>
                  </div>
                )}
              </div>
            </div>

            <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition">
              Editar Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
