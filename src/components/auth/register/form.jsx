import { useState } from "react";
import Button from "../../IU/forms/button";
import { Input, InputDouble } from "../../IU/forms/input";
import { LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";
import useRegister from "../../../hooks/auth/useRegisterHook";
import Alert from "../../IU/alerts/Alerts";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterForm() {
  const {
    formData,
    loading,
    handleInputChange,
    errorMessage,
    successMessage,
    registerCustomer,
  } = useRegister();

  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.customerPassword !== formData.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);
    await registerCustomer(e);
  };

  return (
    <CardForm
      content={
        <>
          <div className="mb-4 flex flex-col items-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("Google credential:", credentialResponse);
              }}
              onError={() => {
                console.log("Registro con Google fallo");
              }}
              width="100%"
            />
            <span className="mb-2 mt-2 text-sm text-gray-400">o registrate con tu correo</span>
          </div>

          {successMessage && <Alert type="success" message="Registro exitoso" />}

          {errorMessage && <Alert type="error" message={errorMessage} />}

          {passwordMismatch && <Alert type="error" message="Las contrasenas no coinciden" />}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputDouble
              label_1="Nombre"
              type_1="text"
              name_1="customerName"
              placeholder_1="Nombre"
              value_1={formData.customerName}
              onChange_1={handleInputChange}
              label_2="Apellido"
              type_2="text"
              name_2="customerLastName"
              placeholder_2="Apellido"
              value_2={formData.customerLastName}
              onChange_2={handleInputChange}
            />

            <Input
              type="email"
              name="customerEmail"
              label="Correo electronico"
              placeholder="Ingresa tu correo electronico"
              value={formData.customerEmail}
              onChange={handleInputChange}
            />

            <Input
              type="tel"
              name="customerPhoneNumber"
              label="Numero telefonico"
              placeholder="+57 3042241681"
              value={formData.customerPhoneNumber}
              onChange={handleInputChange}
            />

            <InputDouble
              label_1="Contrasena"
              type_1="password"
              name_1="customerPassword"
              placeholder_1="Contrasena"
              value_1={formData.customerPassword}
              onChange_1={handleInputChange}
              label_2="Confirmar contrasena"
              type_2="password"
              name_2="confirmPassword"
              placeholder_2="Confirmar contrasena"
              value_2={formData.confirmPassword}
              onChange_2={handleInputChange}
            />

            <Button variant="primary" size="sm" disabled={loading}>
              {loading ? "Registrando..." : "Comenzar ahora"}
            </Button>
          </form>

          <LabelLinkTo
            label="Ya tienes una cuenta?"
            linkPlaceholder="Iniciar sesion"
            pathname="/auth/login"
          />
        </>
      }
    />
  );
}
