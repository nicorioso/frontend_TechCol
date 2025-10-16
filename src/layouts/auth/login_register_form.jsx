import { useState } from "react";
import { Send } from "lucide-react";
import api from "../../api/axios";

export function LoginRegisterForms() {
  const [loginData, setLoginData] = useState({
    customerEmail: "",
    customerPassword: "",
  });

  const [registerData, setRegisterData] = useState({
    customerName: "",
    customerLastName: "",
    customerEmail: "",
    customerPassword: "",
    confirmPassword: "",
    customerPhoneNumber: "",
    roleId: 1,
  });

  const [mensaje, setMensaje] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };
  
  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/Customer`);
      const user = res.data.find(
        (c) =>
          c.customerEmail === loginData.customerEmail &&
          c.customerPassword === loginData.customerPassword
      );
      if (user) {
        setMensaje("Login exitoso ✅");
      } else {
        setMensaje("Credenciales inválidas ❌");
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error al iniciar sesión");
    }
  };
  
  const register = async (e) => {
    e.preventDefault();
    if (registerData.customerPassword !== registerData.confirmPassword) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }
    try {
      const { confirmPassword, ...dataToSend } = registerData;
      
      const res = await api.post("/Customer", dataToSend);
      setMensaje("Usuario registrado con éxito ✅ ID: " + res.data.customerId);
      
      // Opcional: Cambiar a la pestaña de login después de un registro exitoso
      setActiveTab("login");

    } catch (err) {
      console.error(err);
      setMensaje("Error al registrar ❌");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-md shadow-lg p-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto mb-10 h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-200">
          {activeTab === "login" ? "Inicia sesión" : "Crea una cuenta"}
        </h2>

        <div className="mt-6">
          {/* LOGIN FORM */}
          {activeTab === "login" && (
            <form onSubmit={login} className="space-y-4">
              {/* Correo */}
              <label className="block text-sm/6 font-medium text-gray-400" htmlFor="customerEmail">Correo Eléctronico</label>
              <input
                type="email"
                name="customerEmail"
                value={loginData.customerEmail}
                onChange={handleLoginChange}
                required
                className="block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />

              {/* Contraseña */}
              <label className="block text-sm/6 font-medium text-gray-400" htmlFor="customerPassword">Contraseña</label>
              <input
                type="password"
                name="customerPassword"
                value={loginData.customerPassword}
                onChange={handleLoginChange}
                required
                className="block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Iniciar sesión
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === "register" && (
            <form onSubmit={register} className="space-y-4">
              {/* Fila 1: Nombre y Apellido (2 Columnas) */}
              <div className="grid grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="flex flex-col">
                  <label className="block text-sm/6 font-medium text-gray-400" htmlFor="customerName">Nombre</label>
                  <input
                    type="text"
                    name="customerName"
                    value={registerData.customerName}
                    onChange={handleRegisterChange}
                    required
                    className="block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Apellido */}
                <div className="flex flex-col">
                  <label className="block text-sm/6 font-medium text-gray-400" htmlFor="customerLastName">Apellido</label>
                  <input
                    type="text"
                    name="customerLastName"
                    value={registerData.customerLastName}
                    onChange={handleRegisterChange}
                    required
                    className="block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Fila 2: Correo Electrónico (1 Columna) */}
              <div className="flex w-full flex-col">
                <label className="block text-sm/6 font-medium text-gray-400" htmlFor="customerEmail">Correo Eléctronico</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={registerData.customerEmail}
                  onChange={handleRegisterChange}
                  required
                  className="block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Fila 3: Teléfono (1 Columna) */}
              <div className="flex w-full flex-col">
                <label className="block text-sm/6 font-medium text-gray-400" htmlFor="customerPhoneNumber">Teléfono</label>
                <input
                  type="tel"
                  name="customerPhoneNumber"
                  value={registerData.customerPhoneNumber}
                  onChange={handleRegisterChange}
                  required
                  className="block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Fila 4: Contraseña y Confirmar (2 Columnas) */}
              <div className="grid grid-cols-2 gap-4">
                {/* Contraseña */}
                <div className="flex flex-col">
                  <label className="block text-sm/6 font-medium text-gray-400" htmlFor="customerPassword">Contraseña</label>
                  <input
                    type="password"
                    name="customerPassword"
                    value={registerData.customerPassword}
                    onChange={handleRegisterChange}
                    required
                    className="block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Confirmar Contraseña */}
                <div className="flex flex-col">
                  <label className="block text-sm/6 font-medium text-gray-400" htmlFor="confirmPassword">Confirmar contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                    className="block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Registrarse
              </button>
            </form>
          )}

          {mensaje && <p className="mt-4 text-center text-green-500">{mensaje}</p>}

          <p className="mt-6 text-center text-base text-gray-400">
            {activeTab === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <span
                  onClick={() => setActiveTab("register")}
                  className="cursor-pointer text-blue-400 font-semibold"
                >
                  Regístrate
                </span>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <span
                  onClick={() => setActiveTab("login")}
                  className="cursor-pointer text-blue-400 font-semibold"
                >
                  Inicia sesión
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginRegisterForms;