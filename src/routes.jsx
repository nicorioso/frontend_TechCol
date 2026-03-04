import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';

import LoginLayout from './layouts/auth/login/login_form';
import RegisterLayout from './layouts/auth/register/register_form';
import UserProfile from './components/dashboard/profile';
import UserSettings from './layouts/dashboard/userSettings';
import UserEntities from './layouts/dashboard/userEntities';
import CatalogLayout from './layouts/catalog/catalog';

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
    element: <CatalogLayout />,
  },
  {
    path: '/auth/login',
    element: <LoginLayout />,
  },
  {
    path: '/auth/register',
    element: <RegisterLayout />,
  },

  {
    path: '/admin/profile',
    element: (
      <RequireAuth>
        <RequireAdmin>
          <UserProfile />
        </RequireAdmin>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/settings',
    element: (
      <RequireAuth>
        <RequireAdmin>
          <UserSettings />
        </RequireAdmin>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/entities',
    element: (
      <RequireAuth>
        <RequireAdmin>
          <UserEntities />
        </RequireAdmin>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/entities/:entity',
    element: (
      <RequireAuth>
        <RequireAdmin>
          <UserEntities />
        </RequireAdmin>
      </RequireAuth>
    ),
  },

  {
    path: '/user/profile',
    element: (
      <RequireAuth>
        <RequireUser>
          <UserProfile />
        </RequireUser>
      </RequireAuth>
    ),
  },
  {
    path: '/user/settings',
    element: (
      <RequireAuth>
        <RequireUser>
          <UserSettings />
        </RequireUser>
      </RequireAuth>
    ),
  },
  {
    path: '/user/entities',
    element: (
      <RequireAuth>
        <RequireUser>
          <UserEntities />
        </RequireUser>
      </RequireAuth>
    ),
  },
  {
    path: '/user/entities/:entity',
    element: (
      <RequireAuth>
        <RequireUser>
          <UserEntities />
        </RequireUser>
      </RequireAuth>
    ),
  },
]);
