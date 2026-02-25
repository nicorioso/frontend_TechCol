import UserSidebar from '../IU/section/userSidebar';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

import {
  HomeIcon,
  Square2StackIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const getRolePathPrefix = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return 'user';

  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    const role = String(JSON.parse(json)?.role ?? '').toUpperCase();

    return role.includes('ADMIN') ? 'admin' : 'user';
  } catch {
    return 'user';
  }
};

export default function Sidebar({ content, onEntitySelect }) {
  const navigate = useNavigate();
  const setSelectedEntity = useStore((s) => s.setSelectedEntity);
  const pathPrefix = getRolePathPrefix();

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
      <div className="flex w-full min-w-0">
        <UserSidebar
          items={items}
          user={{
            name: 'Erica',
            image: 'https://i.pravatar.cc/40',
          }}
        />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">{content}</main>
      </div>
    </>
  );
}
