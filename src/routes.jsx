import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';

const LoginLayout = lazy(() => import('./layouts/auth/login/login_form'));
const RegisterLayout = lazy(() => import('./layouts/auth/register/register_form'));
const AdminProfile = lazy(() => import('./components/dashboard/adminProfile'));
const UserProfile = lazy(() => import('./layouts/dashboard/userProfile'));
const UserSettings = lazy(() => import('./layouts/dashboard/userSettings'));
const UserEntities = lazy(() => import('./layouts/dashboard/userEntities'));
const CatalogLayout = lazy(() => import('./layouts/catalog/catalog'));
const CartView = lazy(() => import('./layouts/cart/cart'));
const CheckoutPage = lazy(() => import('./layouts/checkout/checkout'));

const withSuspense = (node) => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center bg-white text-slate-700 dark:bg-gray-900 dark:text-gray-200">
        Cargando...
      </div>
    }
  >
    {node}
  </Suspense>
);

const getToken = () => localStorage.getItem('access_token');

const parseJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

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

const getRoleFromToken = () => {
  const token = getToken();
  if (!token) return '';

  const payload = parseJwtPayload(token);
  return String(payload?.role ?? '').toUpperCase();
};

function RequireAuth({ children }) {
  const token = getToken();
  if (!token) return <Navigate to="/auth/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const role = getRoleFromToken();
  if (!role.includes('ADMIN')) return <Navigate to="/user/profile" replace />;
  return children;
}

function RequireUser({ children }) {
  const role = getRoleFromToken();
  if (role.includes('ADMIN')) return <Navigate to="/admin/profile" replace />;
  return children;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/products',
    element: withSuspense(<CatalogLayout />),
  },
  {
    path: '/cart',
    element: withSuspense(<CartView />),
  },
  {
    path: '/checkout',
    element: withSuspense(<CheckoutPage />),
  },
  {
    path: '/auth/login',
    element: withSuspense(<LoginLayout />),
  },
  {
    path: '/auth/register',
    element: withSuspense(<RegisterLayout />),
  },

  {
    path: '/admin/profile',
    element: (
      <RequireAuth>
        <RequireAdmin>{withSuspense(<AdminProfile />)}</RequireAdmin>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/settings',
    element: (
      <RequireAuth>
        <RequireAdmin>{withSuspense(<UserSettings />)}</RequireAdmin>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/entities',
    element: (
      <RequireAuth>
        <RequireAdmin>{withSuspense(<UserEntities />)}</RequireAdmin>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/entities/:entity',
    element: (
      <RequireAuth>
        <RequireAdmin>{withSuspense(<UserEntities />)}</RequireAdmin>
      </RequireAuth>
    ),
  },

  {
    path: '/user/profile',
    element: (
      <RequireAuth>
        <RequireUser>{withSuspense(<UserProfile />)}</RequireUser>
      </RequireAuth>
    ),
  },
  {
    path: '/user/settings',
    element: (
      <RequireAuth>
        <RequireUser>{withSuspense(<UserSettings />)}</RequireUser>
      </RequireAuth>
    ),
  },
  {
    path: '/user/entities',
    element: (
      <RequireAuth>
        <RequireUser>{withSuspense(<UserEntities />)}</RequireUser>
      </RequireAuth>
    ),
  },
  {
    path: '/user/entities/:entity',
    element: (
      <RequireAuth>
        <RequireUser>{withSuspense(<UserEntities />)}</RequireUser>
      </RequireAuth>
    ),
  },
]);
