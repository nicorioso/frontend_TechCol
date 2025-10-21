import Button from '../../IU/forms/button';
import { Input, InputDouble } from "../../IU/forms/input";
import { LinkTo, LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";

export default function RegisterForm() {

    return (
        <CardForm
        content={
            <>
                <form className="space-y-4">
                    <InputDouble
                        label_1="Nombre"
                        type_1="text"
                        name_1="name"
                        placeholder_1="Nombre"

                        label_2="Apellido"
                        type_2="text"
                        name_2="apellido"
                        placeholder_2="Apellido"
                    />
                    <Input
                        type="email"
                        name="customerEmail"
                        label="Correo Electrónico"
                        placeholder="Ingresa tu correo electrónico"
                    />
                    <Input
                        type="tel"
                        name="customerPhoneNumber"
                        label="Número telefonico"
                        placeholder="+57 304-224-1681"
                    />
                    <InputDouble
                        label_1="Contraseña"
                        type_1="customerPassword"
                        name_1="password"
                        placeholder_1="Contraseña"

                        label_2="Confirmar contraseña"
                        type_2="password"
                        name_2="confirmPassword"
                        placeholder_2="Confirmar contraseña"
                    />
                    <Button placeholder="Inicia sesión" />
                </form>
                <LabelLinkTo
                    label={"¿Ya tienes una cuenta?"} 
                    linkPlaceholder={"Iniciar Sesión"} 
                    pathname={"/auth/login"}
                />
            </>
        }
    />
)}