import { Link } from "react-router-dom";
import { ShoppingCart } from 'lucide-react';
import ImageComponent from "../image";

export default function MainHeader() {
  return (
    <header className="sticky top-0 w-full z-10 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-2 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 text-2xl font-bold">
          <ImageComponent
            id="TechCol_logo" alttext="TechCol_logo" style="h-12"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-gray-200 hover:text-white transition">Inicio</a>
          <a href="#" className="text-gray-200 hover:text-white transition">Productos</a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <button className="text-gray-200 hover:text-white transition">
          <ShoppingCart
            color='#ffffffff'
          />
          </button>

          {/* Iniciar sesión Button */}
          <Link className="px-4 py-2 border-2 border-gray-400 text-gray-200 rounded hover:bg-gray-700 transition" to="/auth/login">
            Iniciar sesión
          </Link>

          {/* Registrarse Button */}
          <Link className="px-4 py-2 bg-cyan-400 text-slate-900 font-semibold rounded hover:bg-cyan-300 transition" to="/auth/register">
            Registrarse
          </Link>
        </div>

      </div>
    </header>
  );
}
