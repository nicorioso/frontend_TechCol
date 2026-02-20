import Button from '../../IU/forms/button';
import { Input, InputLink } from "../../IU/forms/input";
import { LinkTo, LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";
import useLoginForm from '../../../hooks/auth/useLoginHook';
import { GoogleLogin } from '@react-oauth/google';
import VerifyCodeModal from '../../IU/modal/VerifyCodeModal';

/**
 * LoginForm - Componente de presentación
 * Solo renderiza UI, la lógica está en useLoginForm (S - Single Responsibility)
 * Inyección de dependencias a través de props
 */
export default function LoginForm() {
  const {
    formData,
    loading,
    error,
    successMessage,
    handleInputChange,
    handleSubmit,
    isAuthenticated,
    verify
  } = useLoginForm();

  // Si ya está autenticado, igual mostramos el formulario

  return (
    <CardForm
      content={
        <>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center mb-4">
              <GoogleLogin
                onSuccess={credentialResponse => {
                  // Aquí puedes enviar credentialResponse.credential a tu backend
                  console.log('Google credential:', credentialResponse);
                }}
                onError={() => {
                  console.log('Login con Google falló');
                }}
                width="100%"
              />
              <span className="text-gray-400 text-sm mt-2 mb-2">o ingresa con tu correo</span>
            </div>
            
            {/* Mensajes de error */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Mensajes de éxito */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {successMessage}
              </div>
            )}

            {/* Email Input */}
            <Input
              type="email"
              name="customerEmail"
              label="Correo Electrónico"
              placeholder="Ingresa tu correo electrónico"
              value={formData.customerEmail}
              onChange={handleInputChange}
              disabled={loading}
              required
            />

            {/* Password Input */}
            <InputLink
              type="password"
              name="customerPassword"
              label="Contraseña"
              pathname="/auth/passwordRecovery"
              placeholder="Ingresa tu contraseña"
              linkPlaceholder="¿Olvidaste tu contraseña?"
              value={formData.customerPassword}
              onChange={handleInputChange}
              disabled={loading}
              required
            />

            {/* Submit Button */}
            <Button 
              variant="primary" 
              size="sm"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Inicia Sesión'}
            </Button>
          </form>

          <VerifyCodeModal
            isOpen={verify.open}
            email={verify.email}
            originalPassword={verify.password}
            onClose={() => verify.setOpen(false)}
            onVerified={verify.onVerified}
          />

          {/* Link to Register */}
          <LabelLinkTo
            label={"¿No tienes una cuenta?"} 
            linkPlaceholder={"Regístrate"} 
            pathname={"/auth/register"}
          />
        </>
      }
    />
  );
}