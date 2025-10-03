import { useState } from 'react'

function ContactForm() {
  const [count, setCount] = useState(0)

  return (

    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Registro
        </h2>

        <form className="space-y-5">
          {/* Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Tu nombre"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ejemplo@mail.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              className="mt-1 w-full rounded-lg border border-gray-300 px-1
              focus:outline-none focus:ring-2 focus:ring-blue-500"  
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg 
            hover:bg-blue-700 transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>

  )
}

export default ContactForm
