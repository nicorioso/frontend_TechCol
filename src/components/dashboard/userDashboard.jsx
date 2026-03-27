import { useEffect, useMemo, useState } from "react";
import { useOrdersHook } from "../../hooks/useOrdersHook";
import UserService from "../../services/customer/UserService";
import { normalizePhoneToE164 } from "../../utils/phone";
import {
  SparklesIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronRightIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const DATE_FORMAT_OPTIONS = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

const STATUS_META = {
  delivered: {
    label: "Entregado",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    icon: CheckCircleIcon,
  },
  paid: {
    label: "En proceso",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    icon: ClockIcon,
  },
  pending: {
    label: "Pendiente",
    className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    icon: ShoppingBagIcon,
  },
  default: {
    label: "Desconocido",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
    icon: ShoppingBagIcon,
  },
};

const TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "ordenes", label: "Mis ordenes" },
  { id: "cuenta", label: "Mi cuenta" },
];

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const formatPrice = (price) => {
  const amount = Number.parseFloat(price ?? 0);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(Number.isNaN(amount) ? 0 : amount);
};

const formatDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("es-ES", DATE_FORMAT_OPTIONS);
};

const getOrderStatusMeta = (status) =>
  STATUS_META[String(status ?? "").toLowerCase()] || STATUS_META.default;

const getSafeString = (value) => String(value ?? "").trim();

function LoadingState() {
  return (
    <div className="flex justify-center py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-cyan-600"></div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
      {message}
    </div>
  );
}

function EmptyOrdersState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800/40">
      <ShoppingBagIcon className="mx-auto mb-3 h-12 w-12 text-slate-400" />
      <p className="text-slate-600 dark:text-slate-300">Aun no tienes ordenes registradas.</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sublabel }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mb-3 flex items-center gap-2 text-slate-500 dark:text-slate-300">
        <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      {sublabel ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sublabel}</p> : null}
    </div>
  );
}

function OrderCard({ order, index }) {
  const statusMeta = getOrderStatusMeta(order?.status);
  const StatusIcon = statusMeta.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <StatusIcon className="h-5 w-5 text-slate-400" />
            <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">
              Orden #{order?.orderId ?? index + 1}
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {formatDate(order?.orderDate ?? order?.createdAt)}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Rastreo: {order?.paypalOrderId ?? `TR${String(index + 1).padStart(10, "0")}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatPrice(order?.orderPrice)}</p>
          <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}>
            {statusMeta.label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const user = getUserFromStorage();
  const customerId = user?.customerId ?? user?.customer_id ?? null;
  const customerName = [user?.customerName, user?.customerLastName].filter(Boolean).join(" ").trim() || user?.name || "Usuario";
  const customerEmail = user?.customerEmail ?? user?.email ?? "";
  const joinDate = user?.createdAt ? formatDate(user.createdAt) : "Reciente";

  const { orders, summary, loading, error } = useOrdersHook(customerId);
  const [activeTab, setActiveTab] = useState("resumen");
  const [profileForm, setProfileForm] = useState({
    customerName: getSafeString(user?.customerName),
    customerLastName: getSafeString(user?.customerLastName),
    customerEmail: getSafeString(customerEmail),
    customerPhoneNumber: getSafeString(user?.customerPhoneNumber),
  });
  const [profileInitial, setProfileInitial] = useState(profileForm);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadProfile = async () => {
      if (!customerId) return;
      setProfileLoading(true);
      try {
        const profile = await UserService.getProfile(customerId);
        const source = profile?.customer || profile || {};
        const mapped = {
          customerName: getSafeString(source?.customerName ?? source?.name),
          customerLastName: getSafeString(source?.customerLastName),
          customerEmail: getSafeString(source?.customerEmail ?? source?.email),
          customerPhoneNumber: getSafeString(source?.customerPhoneNumber ?? source?.phone),
        };
        setProfileForm(mapped);
        setProfileInitial(mapped);
      } catch {
        setProfileMessage({ type: "error", text: "No se pudo cargar tu informacion de perfil." });
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [customerId]);

  const recentOrders = useMemo(() => {
    if (!orders.length) return [];
    return [...orders]
      .sort((a, b) => new Date(b.orderDate ?? b.createdAt) - new Date(a.orderDate ?? a.createdAt))
      .slice(0, 3);
  }, [orders]);

  const tabs = useMemo(
    () => TABS.map((tab) => (tab.id === "ordenes" ? { ...tab, badge: summary.totalOrders } : tab)),
    [summary.totalOrders]
  );

  const hasProfileChanges = useMemo(
    () =>
      Object.keys(profileInitial).some((key) => getSafeString(profileForm[key]) !== getSafeString(profileInitial[key])),
    [profileForm, profileInitial]
  );

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileMessage({ type: "", text: "" });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!customerId) {
      setProfileMessage({ type: "error", text: "No se pudo identificar al usuario actual." });
      return;
    }
    if (!hasProfileChanges) {
      setProfileMessage({ type: "info", text: "No hay cambios para guardar." });
      return;
    }

    setProfileSaving(true);
    try {
      const normalizedPhone = profileForm.customerPhoneNumber
        ? normalizePhoneToE164(profileForm.customerPhoneNumber, { defaultCountryCode: "+57" })
        : "";
      if (profileForm.customerPhoneNumber && !normalizedPhone) {
        setProfileMessage({
          type: "error",
          text: "El telefono debe estar en formato internacional E.164, por ejemplo +573001234567.",
        });
        setProfileSaving(false);
        return;
      }

      const payload = {
        customerName: getSafeString(profileForm.customerName),
        customerLastName: getSafeString(profileForm.customerLastName),
        customerEmail: getSafeString(profileForm.customerEmail),
        customerPhoneNumber: normalizedPhone,
      };

      const response = await UserService.patchProfile(customerId, payload);
      const source = response?.customer || response?.user || response || payload;
      const next = {
        customerName: getSafeString(source?.customerName ?? payload.customerName),
        customerLastName: getSafeString(source?.customerLastName ?? payload.customerLastName),
        customerEmail: getSafeString(source?.customerEmail ?? source?.email ?? payload.customerEmail),
        customerPhoneNumber: getSafeString(source?.customerPhoneNumber ?? source?.phone ?? payload.customerPhoneNumber),
      };

      setProfileForm(next);
      setProfileInitial(next);
      setProfileMessage({ type: "success", text: "Tu informacion se actualizo correctamente." });

      const currentRaw = localStorage.getItem("user");
      const currentParsed = currentRaw ? JSON.parse(currentRaw) : {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentParsed,
          customerName: next.customerName,
          customerLastName: next.customerLastName,
          customerEmail: next.customerEmail,
          email: next.customerEmail,
          customerPhoneNumber: next.customerPhoneNumber,
        })
      );
    } catch {
      setProfileMessage({ type: "error", text: "No se pudo guardar la informacion. Intenta nuevamente." });
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-100 via-slate-50 to-white px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 sm:px-8 lg:px-12">
      <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/60 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-300">
              <SparklesIcon className="h-4 w-4" />
              Panel cliente
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Hola, {customerName}</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Gestiona tus pedidos y datos de cuenta desde un solo lugar.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <p className="font-semibold">{customerEmail || "Sin correo"}</p>
            <p className="text-xs opacity-80">Miembro desde {joinDate}</p>
          </div>
        </div>
      </section>

      <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800/60">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
            {tab.badge > 0 ? <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{tab.badge}</span> : null}
          </button>
        ))}
      </div>

      {activeTab === "resumen" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total gastado" value={formatPrice(summary.totalSpent)} sublabel="Historial completo" icon={SparklesIcon} />
            <StatCard label="Ordenes" value={summary.totalOrders} sublabel="Pedidos realizados" icon={ShoppingBagIcon} />
            <StatCard label="Entregadas" value={summary.delivered} sublabel="Completadas" icon={CheckCircleIcon} />
            <StatCard label="Pendientes" value={summary.pending} sublabel="Aun en curso" icon={ClockIcon} />
          </div>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Ordenes recientes</h2>
              {summary.totalOrders > 3 ? (
                <button
                  type="button"
                  onClick={() => setActiveTab("ordenes")}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                >
                  Ver todas
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} />
            ) : recentOrders.length ? (
              <div className="grid gap-3">{recentOrders.map((order, index) => <OrderCard key={order.orderId ?? index} order={order} index={index} />)}</div>
            ) : (
              <EmptyOrdersState />
            )}
          </section>
        </div>
      ) : null}

      {activeTab === "ordenes" ? (
        <section className="space-y-4">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : orders.length ? (
            orders.map((order, index) => <OrderCard key={order.orderId ?? index} order={order} index={index} />)
          ) : (
            <EmptyOrdersState />
          )}
        </section>
      ) : null}

      {activeTab === "cuenta" ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 lg:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-cyan-100 p-2 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
              <UserCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Informacion personal</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">Actualiza tus datos de perfil.</p>
            </div>
          </div>

          {profileMessage.text ? (
            <div
              className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                profileMessage.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : profileMessage.type === "error"
                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                    : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
              }`}
            >
              {profileMessage.text}
            </div>
          ) : null}

          {profileLoading ? (
            <LoadingState />
          ) : (
            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Nombre</label>
                <input
                  type="text"
                  name="customerName"
                  value={profileForm.customerName}
                  onChange={handleProfileChange}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Apellido</label>
                <input
                  type="text"
                  name="customerLastName"
                  value={profileForm.customerLastName}
                  onChange={handleProfileChange}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-900"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Correo</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={profileForm.customerEmail}
                  onChange={handleProfileChange}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-900"
                  required
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Telefono</label>
                <input
                  type="tel"
                  name="customerPhoneNumber"
                  value={profileForm.customerPhoneNumber}
                  onChange={handleProfileChange}
                  placeholder="+57 300 123 4567"
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-900"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {profileSaving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </section>
      ) : null}
    </div>
  );
}
