import { useState } from "react";
import { Home, UserRound, Folder, Calendar, FileText, BarChart } from "lucide-react";
import UserDashboard from "../pages/user_dashboard.jsx";
import Users from "../pages/users.jsx";
import Products from "../pages/products.jsx";
// import Pedidos from "../pages/orders.jsx";
// import Carrito from "../pages/cart.jsx";
// import Configuraciones from "../pages/settings.jsx";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-gray-900 text-gray-100">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 text-indigo-400 font-bold text-lg">
          <span className="text-2xl">🌊</span>
          <span className="ml-2">TechCop</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center px-3 py-2 rounded-lg w-full text-left ${
              activeTab === "dashboard" ? "bg-gray-800 text-white" : "hover:bg-gray-800"
            }`}
          >
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("usuarios")}
            className={`flex items-center px-3 py-2 rounded-lg w-full text-left ${
              activeTab === "usuarios" ? "bg-gray-800 text-white" : "hover:bg-gray-800"
            }`}
          >
            <UserRound className="h-5 w-5 mr-3" />
            Usuarios
          </button>

          <button
            onClick={() => setActiveTab("productos")}
            className={`flex items-center px-3 py-2 rounded-lg w-full text-left ${
              activeTab === "productos" ? "bg-gray-800 text-white" : "hover:bg-gray-800"
            }`}
          >
            <Folder className="h-5 w-5 mr-3" />
            Productos
          </button>

          <button
            onClick={() => setActiveTab("pedidos")}
            className={`flex items-center px-3 py-2 rounded-lg w-full text-left ${
              activeTab === "pedidos" ? "bg-gray-800 text-white" : "hover:bg-gray-800"
            }`}
          >
            <Calendar className="h-5 w-5 mr-3" />
            Pedidos
          </button>

          <button
            onClick={() => setActiveTab("carrito")}
            className={`flex items-center px-3 py-2 rounded-lg w-full text-left ${
              activeTab === "carrito" ? "bg-gray-800 text-white" : "hover:bg-gray-800"
            }`}
          >
            <BarChart className="h-5 w-5 mr-3" />
            Carrito
          </button>

          <button
            onClick={() => setActiveTab("configuraciones")}
            className={`flex items-center px-3 py-2 rounded-lg w-full text-left ${
              activeTab === "configuraciones" ? "bg-gray-800 text-white" : "hover:bg-gray-800"
            }`}
          >
            <FileText className="h-5 w-5 mr-3" />
            Configuraciones
          </button>
        </nav>

        {/* User */}
        <div className="mt-auto flex items-center p-4 border-t border-gray-800">
          <img
            className="h-10 w-10 rounded-full"
            src="https://i.pravatar.cc/40"
            alt="User"
          />
          <div className="ml-3">
            <p className="text-sm font-medium">Nicolas</p>
            <p className="text-xs text-gray-400">Usuario</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-800 p-6 text-white">
        <div className="h-full border border-dashed border-gray-700 rounded-lg p-4 overflow-y-auto">
          {activeTab === "dashboard" && <UserDashboard />}
          {activeTab === "usuarios" && <Users />}
          {activeTab === "productos" && <Products />}
          {activeTab === "pedidos" && <Pedidos />}
          {activeTab === "carrito" && <Carrito />}
          {activeTab === "configuraciones" && <Configuraciones />}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
