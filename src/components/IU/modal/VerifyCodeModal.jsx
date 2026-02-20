import { useState } from 'react';
import Button from '../forms/button';
import CustomerService from '../../../services/customer/CustomerService';

export default function VerifyCodeModal({ isOpen, email, onClose, onVerified, originalPassword }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await CustomerService.verify(email, code);
      // CustomerService.verify guarda el token en localStorage
      onVerified && onVerified(res);
      onClose && onClose();
    } catch (err) {
      console.error('Error verificando código:', err);
      setError(err?.response?.data || err?.message || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (!originalPassword) {
        setError('No se puede reenviar sin la contraseña original');
        return;
      }
      await CustomerService.login(email, originalPassword);
      alert('Código reenviado al correo');
    } catch (err) {
      console.error('Error reenviando código:', err);
      setError('No se pudo reenviar el código');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">Código de verificación</h3>
        <p className="text-sm text-gray-600 mb-4">Ingresa el código que enviamos a <strong>{email}</strong></p>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="000000"
            autoFocus
          />

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={handleResend}>Reenviar</Button>
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
            </div>

            <Button type="submit" disabled={loading}>{loading ? 'Verificando...' : 'Verificar'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
