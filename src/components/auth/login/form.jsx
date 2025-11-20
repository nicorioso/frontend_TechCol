import Button from '../../IU/forms/button';
import { Input, InputLink } from "../../IU/forms/input";
import { LinkTo, LabelLinkTo } from "../../IU/forms/link";
import CardForm from "../../IU/forms/card";
import useLoginForm from '../../../hooks/auth/useLoginHook';

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
    isAuthenticated
  } = useLoginForm();

  // Si ya está autenticado, redirigir
  if (isAuthenticated) {
    window.location.href = '/home';
    return null;
  }

  return (
    <CardForm
      content={
        <>
          <form className="space-y-5" onSubmit={handleSubmit}>
            
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