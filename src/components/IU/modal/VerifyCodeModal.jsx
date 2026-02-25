import { useState } from "react";
import Button from "../forms/button";
import CustomerService from "../../../services/customer/CustomerService";

const getVerifyErrorMessage = (err) => {
  const status = err?.response?.status;

  if (status === 403) {
    return "No autorizado para verificar. Reingresa y solicita un nuevo codigo.";
  }

  if (status === 401) {
    return "Sesion no valida. Inicia sesion de nuevo.";
  }

  if (status === 400) {
    return "Codigo invalido o expirado. Solicita uno nuevo.";
  }

  const dataMessage = typeof err?.response?.data === "string" ? err.response.data : "";
  return dataMessage || err?.message || "Codigo invalido";
};

export default function VerifyCodeModal({ isOpen, email, onClose, onVerified, originalPassword }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await CustomerService.verify(email, code);
      onVerified && onVerified(res);
      onClose && onClose();
    } catch (err) {
      console.error("Error verificando codigo:", err);
      setError(getVerifyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (!originalPassword) {
        setError("No se puede reenviar sin la contrasena original");
        return;
      }

      await CustomerService.login(email, originalPassword);
      alert("Codigo reenviado al correo");
    } catch (err) {
      console.error("Error reenviando codigo:", err);
      setError("No se pudo reenviar el codigo");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-lg font-semibold">Codigo de verificacion</h3>
        <p className="mb-4 text-sm text-gray-600">
          Ingresa el codigo que enviamos a <strong>{email}</strong>
        </p>

        {error && (
          <div className="mb-3 rounded border border-red-300 bg-red-100 px-3 py-2 text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            placeholder="000000"
            autoFocus
          />

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={handleResend}>
                Reenviar
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancelar
              </Button>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Verificando..." : "Verificar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
