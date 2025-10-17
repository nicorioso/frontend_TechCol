import Button from '../../IU/forms/button';
import { Input, InputLink } from "../../IU/forms/input";
import { LinkTo, LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";

export default function LoginForm() {

    return (
        <CardForm
        content={
            <>
                <form className="space-y-4">
                    <Input
                        type="email"
                        name="customerEmail"
                        label="Correo Electrónico"
                        placeholder="Ingresa tu correo electrónico"
                    />
                    <InputLink
                        type="password"
                        name="customerPassword"
                        label="Contraseña"
                        pathname="/auth/register"
                        placeholder="Ingresa tu contraseña"
                        linkPlaceholder="¿Olvidaste tu contraseña?"
                    />
                    <Button placeholder="Inicia sesión" />
                </form>
                <LabelLinkTo
                    label={"¿No tienes una cuenta?"} 
                    linkPlaceholder={"Registrate"} 
                    pathname={"/auth/register"}
                />
            </>
        }
    />
)}