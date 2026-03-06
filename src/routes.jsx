import { createElement, lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { RequireAdmin, RequireAuth, RequireUser } from "./routes/guards";

const LoginLayout = lazy(() => import("./layouts/auth/login/login_form"));
const RegisterLayout = lazy(() => import("./layouts/auth/register/register_form"));
const AdminProfile = lazy(() => import("./components/dashboard/adminProfile"));
const UserProfile = lazy(() => import("./layouts/dashboard/userProfile"));
const UserSettings = lazy(() => import("./layouts/dashboard/userSettings"));
const UserEntities = lazy(() => import("./layouts/dashboard/userEntities"));
const CatalogLayout = lazy(() => import("./layouts/catalog/catalog"));
const ContactLayout = lazy(() => import("./layouts/contact_form"));
const CartView = lazy(() => import("./layouts/cart/cart"));
const CheckoutPage = lazy(() => import("./layouts/checkout/checkout"));

const ROUTE_LOADING_FALLBACK = (
  <div className="flex min-h-screen items-center justify-center bg-white text-slate-700 dark:bg-gray-900 dark:text-gray-200">
    Cargando...
  </div>
);

const withSuspense = (node) => <Suspense fallback={ROUTE_LOADING_FALLBACK}>{node}</Suspense>;

const renderGuardedRoute = (GuardComponent, PageComponent) => (
  <RequireAuth>
    {createElement(GuardComponent, null, withSuspense(createElement(PageComponent)))}
  </RequireAuth>
);

const getRoleRoutes = (rolePrefix, GuardComponent, ProfileComponent) => [
  {
    path: `/${rolePrefix}/profile`,
    element: renderGuardedRoute(GuardComponent, ProfileComponent),
  },
  {
    path: `/${rolePrefix}/settings`,
    element: renderGuardedRoute(GuardComponent, UserSettings),
  },
  {
    path: `/${rolePrefix}/entities`,
    element: renderGuardedRoute(GuardComponent, UserEntities),
  },
  {
    path: `/${rolePrefix}/entities/:entity`,
    element: renderGuardedRoute(GuardComponent, UserEntities),
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/products",
    element: withSuspense(<CatalogLayout />),
  },
  {
    path: "/contact",
    element: withSuspense(<ContactLayout />),
  },
  {
    path: "/cart",
    element: withSuspense(<CartView />),
  },
  {
    path: "/checkout",
    element: withSuspense(<CheckoutPage />),
  },
  {
    path: "/auth/login",
    element: withSuspense(<LoginLayout />),
  },
  {
    path: "/auth/register",
    element: withSuspense(<RegisterLayout />),
  },
  ...getRoleRoutes("admin", RequireAdmin, AdminProfile),
  ...getRoleRoutes("user", RequireUser, UserProfile),
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);