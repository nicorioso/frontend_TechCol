import React, { useState } from "react";
import Button from '../../IU/forms/button';
import { Input, InputDouble } from "../../IU/forms/input";
import { LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";
import useRegister from '../../../hooks/auth/useRegisterHook';
import Alert from "../../IU/alerts/Alerts";
import { GoogleLogin } from '@react-oauth/google';

export default function RegisterForm() {
  const { 
    formData,
    loading,
    handleInputChange,
    errorMessage,
    successMessage,
    registerCustomer
  } = useRegister();

  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (formData.customerPassword !== formData.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    
    // Resetear el error si las contraseñas coinciden
    setPasswordMismatch(false);
    
    // Llamar al hook
    await registerCustomer(e);
  };

  return (
    <CardForm
      content={
        <>
          <div className="flex flex-col items-center mb-4">
            <GoogleLogin
              onSuccess={credentialResponse => {
                // Aquí puedes enviar credentialResponse.credential a tu backend
                console.log('Google credential:', credentialResponse);
              }}
              onError={() => {
                console.log('Registro con Google falló');
              }}
              width="100%"
            />
            <span className="text-gray-400 text-sm mt-2 mb-2">o regístrate con tu correo</span>
          </div>
          {successMessage && (
            <Alert
              type='success'
              message='Bien'
          
            />
          )}

          {errorMessage && (
            <Alert
              type='error'
              message='Mal'
            />
          )}

          {passwordMismatch && (
            <Alert
              type='error'
              message='Las contraseñas no coinciden'
            />
          )}


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

            {/* Email */}
            <Input
              type="email"
              name="customerEmail"
              label="Correo Electrónico"
              placeholder="Ingresa tu correo electrónico"
              value={formData.customerEmail}
              onChange={handleInputChange}
            />

            {/* Teléfono */}
            <Input
              type="tel"
              name="customerPhoneNumber"
              label="Número telefónico"
              placeholder="+57 304-224-1681"
              value={formData.customerPhoneNumber}
              onChange={handleInputChange}
            />

            {/* Contraseña y Confirmar */}
            <InputDouble
              label_1="Contraseña"
              type_1="password"
              name_1="customerPassword"
              placeholder_1="Contraseña"
              value_1={formData.customerPassword}
              onChange_1={handleInputChange}

              label_2="Confirmar contraseña"
              type_2="password"
              name_2="confirmPassword"
              placeholder_2="Confirmar contraseña"
              value_2={formData.confirmPassword}
              onChange_2={
                (handleInputChange)
              }
            />

            {/* Botón de Envío */}
            <Button 
              variant="primary" 
              size="sm"
              placeholder={loading ? 'Registrando...' : 'Registrarse'}
              disabled={loading}
              >
              Comienza ahora
            </Button>
          </form>

          {/* Enlace a Login */}
          <LabelLinkTo
            label="¿Ya tienes una cuenta?" 
            linkPlaceholder="Iniciar Sesión" 
            pathname="/auth/login"
          />
        </>
      }
    />
  );
}
