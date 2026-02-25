import Sidebar from "./sidebar";
import AvatarUpload from "../IU/image/AvatarUpload";
import { Input, InputDouble, InputLink } from "../IU/forms/input";
import Button from "../IU/forms/button";
import UserService from "../../services/customer/UserService";
import CustomerService from "../../services/customer/CustomerService";
import { useState, useEffect, useRef } from "react";

export default function Settings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const initialProfileRef = useRef({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoutPassword, setLogoutPassword] = useState("");

  function handleAvatarChange(file) {
    setAvatarFile(file);
  }

  useEffect(() => {
    (async () => {
      try {
        const current = CustomerService.getCurrentUser();
        const id = current?.customerId || current?.id || current?.userId || current?.customer_id;
        const profile = id ? await UserService.getProfile(id) : null;
        const p = profile?.customer || profile || {};
        setFirstName(p.firstName || p.name || "");
        setLastName(p.lastName || "");
        setEmail(p.email || "");
        setUsername(p.username || p.userName || p.customerName || "");
        setPhone(p.phone || p.telefono || p.customerPhoneNumber || "");
        initialProfileRef.current = {
          firstName: p.firstName || p.name || p.customerName || "",
          lastName: p.lastName || "" || p.customerLastName || "",
          email: p.email || p.customerEmail || "",
          username: p.username || p.userName || p.customerName || "",
          phone: p.phone || p.telefono || p.customerPhoneNumber || "",
        };
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
  const [isLoggingOutSessions, setIsLoggingOutSessions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function persistProfile() {
    setIsSaving(true);
    try {
      const delta = {};
      const init = initialProfileRef.current || {};
      if (firstName !== init.firstName) delta.customerName = firstName;
      if (lastName !== init.lastName) delta.customerLastName = lastName;
      if (email !== init.email) delta.customerEmail = email;
      if (phone !== init.phone) delta.customerPhoneNumber = phone;

      if (Object.keys(delta).length === 0 && !avatarFile) {
        alert("No hay cambios para guardar");
        setIsSaving(false);
        return;
      }

      const current = CustomerService.getCurrentUser();
      const id = current?.customerId || current?.id || current?.userId || current?.customer_id;
      if (!id) throw new Error("Usuario no autenticado");
      const result = await UserService.patchProfile(id, delta);
      if (result?.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }
      alert("Perfil guardado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al guardar el perfil");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("La nueva contrasena y la confirmacion no coinciden");
      return;
    }
    setIsChangingPassword(true);
    try {
      const current = CustomerService.getCurrentUser();
      const id = current?.customerId || current?.id || current?.userId || current?.customer_id;
      if (!id) throw new Error("Usuario no autenticado");
      await UserService.patchProfile(id, { customerPassword: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Contrasena actualizada");
    } catch (err) {
      console.error(err);
      alert("Error cambiando la contrasena");
    } finally {
      setIsChangingPassword(false);
    }
  }

  function handleLogoutOtherSessions(e) {
    e.preventDefault();
    (async () => {
      setIsLoggingOutSessions(true);
      try {
        alert("Cerrar otras sesiones no esta implementado en el backend.");
      } catch (err) {
        console.error(err);
        alert("Error cerrando otras sesiones");
      } finally {
        setIsLoggingOutSessions(false);
      }
    })();
  }

  function handleDeleteAccount() {
    const ok = window.confirm("Esta accion no se puede deshacer. Deseas eliminar tu cuenta?");
    if (!ok) return;
    (async () => {
      setIsDeleting(true);
      try {
        const current = CustomerService.getCurrentUser();
        const id = current?.customerId || current?.id || current?.userId || current?.customer_id;
        if (!id) throw new Error("Usuario no autenticado");
        await UserService.deleteAccount(id);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        alert("Cuenta eliminada");
        window.location.href = "/";
      } catch (err) {
        console.error(err);
        alert("Error eliminando la cuenta");
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="mb-4 flex items-center gap-6">
                    <AvatarUpload initialSrc="https://i.pravatar.cc/150" onChange={handleAvatarChange} />
                  </div>

                  <InputDouble
                    label_1="Nombre"
                    label_2="Apellido"
                    type_1="text"
                    type_2="text"
                    name_1="firstName"
                    name_2="lastName"
                    placeholder_1="Nombre"
                    placeholder_2="Apellido"
                    value_1={firstName}
                    value_2={lastName}
                    onChange_1={(e) => setFirstName(e.target.value)}
                    onChange_2={(e) => setLastName(e.target.value)}
                  />

                  <Input
                    type="email"
                    name="email"
                    label="Correo electronico"
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <InputLink
                    type="text"
                    name="username"
                    label="Nombre de usuario"
                    placeholder="janesmith"
                    linkPlaceholder="example.com/"
                    pathname={username}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <Input
                    type="tel"
                    name="phone"
                    label="Numero de telefono"
                    placeholder="+57 300 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <div>
                    <Button disabled={isSaving}>{isSaving ? "Guardando..." : "Guardar"}</Button>
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
                    <Button disabled={isChangingPassword}>
                      {isChangingPassword ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="col-span-3 mt-12">
                <h2 className="text-lg font-semibold">Cerrar otras sesiones</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Por favor ingresa tu contrasena para confirmar que deseas cerrar tus otras sesiones en
                  todos tus dispositivos.
                </p>
              </div>

              <div className="col-span-9 mt-12">
                <form onSubmit={handleLogoutOtherSessions} className="space-y-6">
                  <Input
                    type="password"
                    name="logoutPassword"
                    label="Tu contrasena"
                    placeholder="Tu contrasena"
                    value={logoutPassword}
                    onChange={(e) => setLogoutPassword(e.target.value)}
                  />

                  <div>
                    <Button disabled={isLoggingOutSessions}>
                      {isLoggingOutSessions ? "Cerrando..." : "Cerrar otras sesiones"}
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
