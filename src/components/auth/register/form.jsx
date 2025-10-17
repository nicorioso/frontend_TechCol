import Button from '../../IU/forms/button';
import { Input } from "../../IU/forms/input";
import { LinkTo } from "../../IU/forms/link";

export default function RegisterForm() {

    return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
        <div className="w-full max-w-lg bg-gray-800 rounded-md shadow-lg p-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto mb-10 h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
            </div>
                <h2 className="text-center text-2xl font-bold text-gray-200">
                    Iniciar Sesión
                </h2>
            <div className="mt-6">
                {/* LOGIN FORM */}
                <form className="space-y-4">
                    {/* Fila 1: Nombre y Apellido (2 Columnas) */}
                    <div className="grid grid-cols-2 gap-4">

                        <Input
                            type="email"
                            name="customerEmail"
                            label="Correo Electrónico"
                            placeholder="Ingresa tu correo electrónico"
                        />

                        <Input
                            type="password"
                            name="customerPassword"
                            label="Contraseña"
                            placeholder="Ingresa tu contraseña"
                        />

                        <Input
                            type="password"
                            name="confirmCustomerPassword"
                            label="Confirmar Contraseña"
                            placeholder="Ingresa de nuevo tu contraseña"
                        />

                        <Button/>
                        <LinkTo/>

                    </div>
                </form>
            </div>
        </div>
    </div>
)}