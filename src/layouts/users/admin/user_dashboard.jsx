// UserDashboard.jsx
import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// --- Datos de Gráficos (se mantienen) ---
const salesData = [
  { month: "Ene", ventas: 4000 },
  { month: "Feb", ventas: 3000 },
  { month: "Mar", ventas: 5000 },
  { month: "Abr", ventas: 4000 },
];

const visitsData = [
  { day: "Lun", visitas: 120 },
  { day: "Mar", visitas: 200 },
  { day: "Mie", visitas: 150 },
  { day: "Jue", visitas: 250 },
  { day: "Vie", visitas: 300 },
];

const pieData = [
  { name: "Producto A", value: 400 },
  { name: "Producto B", value: 300 },
  { name: "Producto C", value: 300 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

// --- Datos para Tablas (Alineados con la Base de Datos) ---
const customerData = [
  { customerId: 1, customerName: "Nicolas", customerLastName: "Perez", customerEmail: "nicolas@ejemplo.com" },
  { customerId: 2, customerName: "Ana", customerLastName: "Gomez", customerEmail: "ana@ejemplo.com" },
];
const orderData = [
  { orderId: 101, orderPrice: 125.50, orderDate: "2025-10-01", customerId: 1 },
  { orderId: 102, orderPrice: 340.00, orderDate: "2025-10-02", customerId: 2 },
];
const productData = [
  { productId: 1, productName: "Laptop X1", productPrice: 1200.00, productStock: 15 },
  { productId: 2, productName: "Monitor Ultra", productPrice: 350.99, productStock: 50 },
];

/**
 * Componente de Tabla de Datos Reutilizable
 */
function DataTable({ data, headers, href }) {
  return (
    <>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-gray-600">
            {headers.map((header, index) => (
              <th key={index} className="px-2 py-1">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-700" : "bg-gray-600"}>
              {headers.map((headerKey, keyIndex) => (
                <td key={keyIndex} className="px-2 py-1">
                  {/* Se usa la clave para acceder al valor, si existe */}
                  {row[headerKey] !== undefined ? row[headerKey] : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 text-right">
        {/* Botón de "Leer Más" */}
        <a 
          href={href || "#"} 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded transition duration-200"
        >
          Leer más →
        </a>
      </div>
    </>
  );
}

export default function UserDashboard() {
  const userName = "Nicolas";
  const profileImageUrl = "https://via.placeholder.com/300?text=Tu+Foto+Aquí"; 
  
  // Datos de usuario para censurar
  const userEmail = "nicola***@eje***.com";
  const userPhone = "(55) ***-2345";
  const userAddress = "Av. Principal #12***, Col. C***entral";

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Bienvenido, {userName} 👋</h1>

      {/* --- Tarjetas de Perfil y Configuración --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Tarjeta de Perfil/Imagen - (2 columnas de ancho) */}
        <div className="md:col-span-2 bg-gray-700 p-6 rounded-lg shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-3">Mi Perfil</h2>
          {/* Imagen de perfil grande */}
          <img
            src={profileImageUrl}
            alt="Foto de Perfil"
            className="w-36 h-36 object-cover rounded-full border-4 border-blue-500 mb-3"
          />
          <p className="text-lg font-medium">{userName} Pérez</p>
          <p className="text-sm text-gray-400">Administrador de Datos</p>
        </div>

        {/* Tarjeta de Configuración (Settings) - MODIFICADA */}
        <div className="md:col-span-2 bg-gray-700 p-6 rounded-lg shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Configuración de Usuario</h2>
            
            {/* Información de usuario censurada */}
            <div className="space-y-2 mb-4 text-sm">
                <p>
                    <span className="font-semibold text-gray-400">Email:</span> 
                    <span className="ml-2">{userEmail}</span>
                </p>
                <p>
                    <span className="font-semibold text-gray-400">Teléfono:</span> 
                    <span className="ml-2">{userPhone}</span>
                </p>
                <p>
                    <span className="font-semibold text-gray-400">Dirección:</span> 
                    <span className="ml-2">{userAddress}</span>
                </p>
            </div>
            <p className="text-gray-300 text-sm italic">
                Haz clic en el botón para ver o modificar tus datos completos.
            </p>
          </div>
          <a 
            href="/settings" // Redirecciona a la ruta 'settings'
            className="w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200 mt-4"
          >
            Cambiar Datos de Usuario
          </a>
        </div>
      </div>
      
      <hr className="border-gray-600" />

      {/* --- Tarjetas con tablas de datos --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tablas (sin cambios) */}
        <div className="bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Últimos Clientes</h2>
          <DataTable data={customerData} headers={["customerId", "customerName", "customerEmail"]} href="/dashboard/clientes"/>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Pedidos Recientes</h2>
          <DataTable data={orderData} headers={["orderId", "orderPrice", "orderDate"]} href="/dashboard/pedidos"/>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Stock de Productos</h2>
          <DataTable data={productData} headers={["productId", "productName", "productStock"]} href="/dashboard/productos"/>
        </div>
      </div>

      <hr className="border-gray-600" />
      
      {/* --- Estadísticas y Gráficos (Altura 300) --- */}
      <h2 className="text-2xl font-bold pt-2">Estadísticas Clave 📈</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Gráficos (sin cambios en datos o altura) */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Ventas por mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="month" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Distribución de productos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} fill="#82ca9d" label>
                {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Visitas al sitio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitsData}>
              <XAxis dataKey="day" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visitas" stroke="#ffc658" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}