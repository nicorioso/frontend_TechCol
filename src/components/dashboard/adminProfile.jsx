import Sidebar from "./sidebar";

export default function AdminProfile() {
  return (
    <>
      <div className="flex">
      <Sidebar
        content={
          <div className="flex-1 p-10">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Configuracion de usuario
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Esta es la vista original del perfil administrativo con acceso al UserSidebar.
            </p>
          </div>
        }
      />
      </div>
    </>
  );
}
