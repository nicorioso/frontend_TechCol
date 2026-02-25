export default function MainFooter() {
  return (
    <footer className="w-full bg-gradient-to-b from-slate-800 to-slate-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-xl font-bold text-white">TechCol</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Tu tienda de confianza para partes de computador
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 transition hover:text-cyan-400">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition hover:text-cyan-400">
                  Productos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Correo: info@techcol.com</li>
              <li>Telefono: +57 1 234 5678</li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-slate-700" />

        <div className="text-center text-sm text-gray-500">
          (c) 2026 TechCol. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
