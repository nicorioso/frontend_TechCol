export default function MainFooter() {
  return (
    <footer className="w-full bg-gradient-to-b from-slate-800 to-slate-900 text-gray-300">
      
      {/* Contenido principal del footer */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Sección 1: Información de la empresa */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">TechCol</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu tienda de confianza para partes de computador
            </p>
          </div>

          {/* Sección 2: Enlaces */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition">
                  Productos
                </a>
              </li>
            </ul>
          </div>

          {/* Sección 3: Contacto */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: info@techcol.com</li>
              <li>Teléfono: +57 1 234 5678</li>
            </ul>
          </div>

        </div>

        {/* Línea divisoria */}
        <hr className="border-slate-700 my-4" />

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          © 2026 TechCol. Todos los derechos reservados.
        </div>

      </div>

    </footer>
  );
}
