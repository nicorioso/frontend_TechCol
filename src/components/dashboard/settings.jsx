import Sidebar from "./sidebar";
import { Input } from "../IU/forms/input";
import PhoneInput from "../IU/forms/phoneInput";
import Button from "../IU/forms/button";
import Alert from "../IU/alerts/Alerts";
import UserService from "../../services/customer/UserService";
import CustomerService from "../../services/customer/CustomerService";
import { useState, useEffect, useRef } from "react";
import { getEntityDefinition } from "../../services/entities/definitions";

const getCurrentCustomerId = () => {
  const current = CustomerService.getCurrentUser();
  return current?.customerId || current?.id || current?.userId || current?.customer_id;
};

const mapProfileToForm = (profile) => {
  const p = profile?.customer || profile || {};
  const phoneRaw = String(p.customerPhoneNumber || p.phone || "").trim();
  const phoneParts = phoneRaw.split(" ");
  const hasCode = phoneParts.length > 1 && phoneParts[0].startsWith("+");
  const code = hasCode ? phoneParts[0] : "+1";
  const phoneNumber = hasCode ? phoneParts.slice(1).join(" ") : phoneRaw;

  return {
    customer_name: p.customerName || p.name || "",
    customer_last_name: p.customerLastName || "",
    customer_email: p.customerEmail || p.email || "",
    customer_phone_number: phoneNumber || "",
    customer_country_code: code,
    customer_country: "US",
  };
};

export default function Settings() {
  const customersDefinition = getEntityDefinition("customers");
  const rawFields = customersDefinition?.formFields || [];
  const profileFields = rawFields.filter(
    (field) => field.name !== "role_id" && field.name !== "customer_password"
  );

  const [formValues, setFormValues] = useState({});
  const initialProfileRef = useRef({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoutPassword, setLogoutPassword] = useState("");
  const [alertState, setAlertState] = useState({ visible: false, type: "info", message: "" });

  const buildInitialValues = (fields = []) =>
    fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue ?? "";
      if (field.type === "phone") {
        acc[field.countryName || `${field.name}_country`] = field.defaultCountry || "US";
        acc[field.codeName || `${field.name}_country_code`] = field.defaultCode || "+1";
      }
      return acc;
    }, {});

  const handleFormChange = (event) => {
    const { name, type, files, value } = event.target;
    const newValue = type === "file" || type === "image" ? files[0] : value;
    setFormValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        const id = getCurrentCustomerId();
        const profile = id ? await UserService.getProfile(id) : null;
        const baseValues = buildInitialValues(profileFields);
        const mapped = mapProfileToForm(profile);
        const nextValues = { ...baseValues, ...mapped };
        setFormValues(nextValues);
        initialProfileRef.current = nextValues;
      } catch (err) {
        console.error("No se pudo cargar el perfil inicial", err);
      }
    })();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    persistProfile();
  }

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function persistProfile() {
    setIsSaving(true);
    try {
      const init = initialProfileRef.current || {};
      const hasChanges = profileFields.some((field) => {
        const key = field.name;
        const prev = init[key] ?? "";
        const next = formValues[key] ?? "";
        return String(prev) !== String(next);
      });

      if (!hasChanges) {
        setAlertState({
          visible: true,
          type: "info",
          message: "No hay cambios para guardar",
        });
        setIsSaving(false);
        return;
      }

      const id = getCurrentCustomerId();
      if (!id) throw new Error("Usuario no autenticado");
      const result = customersDefinition?.update
        ? await customersDefinition.update(id, formValues)
        : await UserService.patchProfile(id, formValues);
      const updatedUser = result?.user || result?.customer || result;
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        const baseValues = buildInitialValues(profileFields);
        const mapped = mapProfileToForm(updatedUser);
        const nextValues = { ...baseValues, ...mapped };
        initialProfileRef.current = nextValues;
        setFormValues(nextValues);
      }
      setAlertState({
        visible: true,
        type: "success",
        message: "Perfil guardado correctamente",
      });
    } catch (err) {
      console.error(err);
      setAlertState({
        visible: true,
        type: "error",
        message: "Error al guardar el perfil",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setAlertState({
        visible: true,
        type: "warning",
        message: "La nueva contrasena y la confirmacion no coinciden",
      });
      return;
    }
    setIsChangingPassword(true);
    try {
      const id = getCurrentCustomerId();
      if (!id) throw new Error("Usuario no autenticado");
      await UserService.patchProfile(id, { customerPassword: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setAlertState({
        visible: true,
        type: "success",
        message: "Contrasena actualizada",
      });
    } catch (err) {
      console.error(err);
      setAlertState({
        visible: true,
        type: "error",
        message: "Error cambiando la contrasena",
      });
    } finally {
      setIsChangingPassword(false);
    }
  }

  function handleDeleteAccount() {
    const ok = window.confirm("Esta accion no se puede deshacer. Deseas eliminar tu cuenta?");
    if (!ok) return;
    (async () => {
      setIsDeleting(true);
      try {
        const id = getCurrentCustomerId();
        if (!id) throw new Error("Usuario no autenticado");
        await UserService.deleteAccount(id);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setAlertState({
          visible: true,
          type: "success",
          message: "Cuenta eliminada",
        });
        window.location.href = "/";
      } catch (err) {
        console.error(err);
        setAlertState({
          visible: true,
          type: "error",
          message: "Error eliminando la cuenta",
        });
      } finally {
        setIsDeleting(false);
      }
    })();
  }

  return (
    <div className="flex">
      <Sidebar
        content={
          <div className="flex-1 p-10">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-3">
                <h2 className="text-lg font-semibold">Informacion personal</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Usa una direccion permanente donde puedas recibir correo.
                </p>
              </div>

              <div className="col-span-9">
                {alertState.visible && (
                  <Alert
                    type={alertState.type}
                    message={alertState.message}
                    onClose={() => setAlertState({ visible: false, type: "info", message: "" })}
                    duration={0}
                  />
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {profileFields.map((field) => (
                      <div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                          {field.label}
                        </label>

                        {field.type === "select" ? (
                          <select
                            name={field.name}
                            value={formValues[field.name] ?? ""}
                            onChange={handleFormChange}
                            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            required={field.required !== false}
                            disabled={field.disabled}
                          >
                            <option value="">Seleccionar...</option>
                            {(field.options || []).map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "phone" ? (
                          <PhoneInput
                            name={field.name}
                            codeName={field.codeName}
                            countryName={field.countryName}
                            value={formValues[field.name] ?? ""}
                            codeValue={formValues[field.codeName || `${field.name}_country_code`] ?? ""}
                            countryValue={
                              formValues[field.countryName || `${field.name}_country`] ?? field.defaultCountry
                            }
                            onChange={handleFormChange}
                            disabled={field.disabled}
                            placeholder={field.placeholder}
                          />
                        ) : (
                          <Input
                            type={field.type || "text"}
                            name={field.name}
                            label=""
                            placeholder={field.placeholder || ""}
                            value={formValues[field.name] ?? ""}
                            onChange={handleFormChange}
                            disabled={field.disabled}
                            required={field.required !== false}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="col-span-3 mt-12">
                <h2 className="text-lg font-semibold">Cambiar contrasena</h2>
                <p className="mt-2 text-sm text-gray-500">Actualiza la contrasena asociada a tu cuenta.</p>
              </div>

              <div className="col-span-9 mt-12">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <Input
                    type="password"
                    name="currentPassword"
                    label="Contrasena actual"
                    placeholder="Contrasena actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />

                  <Input
                    type="password"
                    name="newPassword"
                    label="Nueva contrasena"
                    placeholder="Nueva contrasena"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <Input
                    type="password"
                    name="confirmPassword"
                    label="Confirmar contrasena"
                    placeholder="Confirmar contrasena"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <div>
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="col-span-3 mt-12">
                <h2 className="text-lg font-semibold">Eliminar cuenta</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Ya no quieres usar nuestro servicio? Puedes eliminar tu cuenta aqui. Esta accion no es
                  reversible. Toda la informacion relacionada con esta cuenta sera eliminada permanentemente.
                </p>
              </div>

              <div className="col-span-9 mt-12">
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className={`px-4 py-2 ${
                      isDeleting ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                    } rounded-md text-white`}
                  >
                    {isDeleting ? "Eliminando..." : "Si, eliminar mi cuenta"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
