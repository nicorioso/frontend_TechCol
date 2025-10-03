import { useState } from "react";

export default function Example() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      {/* Card */}
      <div className="w-full max-w-lg bg-gray-100 rounded-xl shadow-md p-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {activeTab === "login" ? "Inicia sesión" : "Crea una cuenta"}
          </h2>
        </div>

        <div className="mt-8">
          {activeTab === "login" && (
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-900">
                  Correo Electronico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full rounded-md border px-4 py-2 text-lg text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-base font-medium text-gray-900">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full rounded-md border px-4 py-2 text-lg text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-indigo-600"
                />
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                Sign in
              </button>
            </form>
          )}

          {activeTab === "register" && (
            <form className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-900">Nombre</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-md border px-4 py-2 text-lg text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-900">Correo Electronico</label>
                <input
                  type="email"
                  required
                  className="block w-full rounded-md border px-4 py-2 text-lg text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-900">Telefono</label>
                <input
                  type="tel"
                  required
                  className="block w-full rounded-md border px-4 py-2 text-lg text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-900">Contraseña</label>
                <input
                  type="password"
                  required
                  className="block w-full rounded-md border px-4 py-2 text-lg text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-900">Confirmar Contraseña</label>
                <input
                  type="password"
                  required
                  className="block w-full rounded-md border px-4 py-2 text-lg text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-indigo-600"
                />
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                Register
              </button>
            </form>
          )}

          {/* Texto clickable para cambiar entre pestañas */}
          <p className="mt-6 text-center text-base text-gray-600">
            {activeTab === "login" ? (
              <>
                ¿No tienes una cuenta?{" "}
                <span
                  onClick={() => setActiveTab("register")}
                  className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Crea una
                </span>
              </>
            ) : (
              <>
                ¿Ya tienes una cuenta?{" "}
                <span
                  onClick={() => setActiveTab("login")}
                  className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Inicia Sesión
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
