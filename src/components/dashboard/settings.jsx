import Sidebar from "./sidebar";
import AvatarUpload from "../IU/image/AvatarUpload";
import { Input, InputDouble, InputLink } from "../IU/forms/input";
import Button from "../IU/forms/button";
import UserService from "../../services/customer/UserService";
import CustomerService from "../../services/customer/CustomerService";
import { useState, useEffect, useRef } from "react";

export default function Settings() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const initialProfileRef = useRef({});
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [logoutPassword, setLogoutPassword] = useState('');

    function handleAvatarChange(file) {
        setAvatarFile(file);
    }

    useEffect(() => {
        // Cargar perfil inicial
        (async () => {
            try {
                const current = CustomerService.getCurrentUser();
                const id = current?.customerId || current?.id || current?.userId || current?.customer_id;
                const profile = id ? await UserService.getProfile(id) : null;
                // Mapear propiedades si existen
                const p = profile?.customer || profile || {};
                setFirstName(p.firstName || p.name || '');
                setLastName(p.lastName || '');
                setEmail(p.email || '');
                setUsername(p.username || p.userName || p.customerName || '');
                setPhone(p.phone || p.telefono || p.customerPhoneNumber || '');
                // guardar referencia inicial para comparar cambios
                initialProfileRef.current = {
                    firstName: p.firstName || p.name || p.customerName || '',
                    lastName: p.lastName || '' || p.customerLastName || '',
                    email: p.email || p.customerEmail || '',
                    username: p.username || p.userName || p.customerName || '',
                    phone: p.phone || p.telefono || p.customerPhoneNumber || '',
                };
            } catch (err) {
                // si falla, ignorar
                console.error('No se pudo cargar el perfil inicial', err);
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
            // Enviar sólo campos que han cambiado respecto al perfil inicial
            const delta = {};
            const init = initialProfileRef.current || {};
            // mapear a los campos que espera el backend
            if (firstName !== init.firstName) delta.customerName = firstName;
            if (lastName !== init.lastName) delta.customerLastName = lastName;
            if (email !== init.email) delta.customerEmail = email;
            // username no existe en backend; ignorarlo o mapearlo a customerName si deseas
            if (phone !== init.phone) delta.customerPhoneNumber = phone;

            if (Object.keys(delta).length === 0 && !avatarFile) {
                alert('No hay cambios para guardar');
                setIsSaving(false);
                return;
            }

            // obtener id actual
            const current = CustomerService.getCurrentUser();
            const id = current?.customerId || current?.id || current?.userId || current?.customer_id;
            if (!id) throw new Error('Usuario no autenticado');
            const result = await UserService.patchProfile(id, delta);
            // If server returns updated user, save to localStorage
            if (result?.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
            }
            alert('Perfil guardado correctamente');
        } catch (err) {
            console.error(err);
            alert('Error al guardar el perfil');
        } finally {
            setIsSaving(false);
        }
    }

    async function handlePasswordSubmit(e) {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('La nueva contraseña y la confirmación no coinciden');
            return;
        }
        setIsChangingPassword(true);
        try {
            const current = CustomerService.getCurrentUser();
            const id = current?.customerId || current?.id || current?.userId || current?.customer_id;
            if (!id) throw new Error('Usuario no autenticado');
            // El backend no expone un endpoint específico para cambio de contraseña,
            // usamos PATCH para actualizar el campo customerPassword.
            await UserService.patchProfile(id, { customerPassword: newPassword });
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
            alert('Contraseña actualizada');
        } catch (err) {
            console.error(err);
            alert('Error cambiando la contraseña');
        } finally {
            setIsChangingPassword(false);
        }
    }

    function handleLogoutOtherSessions(e) {
        e.preventDefault();
        (async () => {
            setIsLoggingOutSessions(true);
            try {
                // No hay endpoint en el backend para cerrar otras sesiones.
                // Marcar como no implementado: informar al usuario.
                alert('Cerrar otras sesiones no está implementado en el backend.');
            } catch (err) {
                console.error(err);
                alert('Error cerrando otras sesiones');
            } finally {
                setIsLoggingOutSessions(false);
            }
        })();
    }

    function handleDeleteAccount() {
        const ok = window.confirm('Esta acción no se puede deshacer. ¿Eliminar tu cuenta?');
        if (!ok) return;
        (async () => {
            setIsDeleting(true);
            try {
                const current = CustomerService.getCurrentUser();
                const id = current?.customerId || current?.id || current?.userId || current?.customer_id;
                if (!id) throw new Error('Usuario no autenticado');
                await UserService.deleteAccount(id);
                // limpiar sesión y redirigir
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                alert('Cuenta eliminada');
                window.location.href = '/';
            } catch (err) {
                console.error(err);
                alert('Error eliminando la cuenta');
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
                                <h2 className="text-lg font-semibold">Información personal</h2>
                                <p className="mt-2 text-sm text-gray-500">Usa una dirección permanente donde puedas recibir correo.</p>
                            </div>

                            <div className="col-span-9">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex items-center gap-6 mb-4">
                                        <AvatarUpload initialSrc="https://i.pravatar.cc/150" onChange={handleAvatarChange} />
                                    </div>

                                    <InputDouble
                                        label_1="First name"
                                        label_2="Last name"
                                        type_1="text"
                                        type_2="text"
                                        name_1="firstName"
                                        name_2="lastName"
                                        placeholder_1="First name"
                                        placeholder_2="Last name"
                                        value_1={firstName}
                                        value_2={lastName}
                                        onChange_1={(e) => setFirstName(e.target.value)}
                                        onChange_2={(e) => setLastName(e.target.value)}
                                    />

                                    <Input
                                        type="email"
                                        name="email"
                                        label="Correo electrónico"
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
                                        label="Número de teléfono"
                                        placeholder="+57 300 000 0000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />

                                    <div>
                                        <Button disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
                                    </div>
                                </form>

                            </div>

                            {/* Change password section - aligned with the grid above */}
                            <div className="col-span-3 mt-12">
                                <h2 className="text-lg font-semibold">Cambiar contraseña</h2>
                                <p className="mt-2 text-sm text-gray-500">Actualiza la contraseña asociada a tu cuenta.</p>
                            </div>

                            <div className="col-span-9 mt-12">
                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    <Input
                                        type="password"
                                        name="currentPassword"
                                        label="Contraseña actual"
                                        placeholder="Contraseña actual"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />

                                    <Input
                                        type="password"
                                        name="newPassword"
                                        label="Nueva contraseña"
                                        placeholder="Nueva contraseña"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />

                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        label="Confirmar contraseña"
                                        placeholder="Confirmar contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />

                                    <div>
                                        <Button disabled={isChangingPassword}>{isChangingPassword ? 'Guardando...' : 'Guardar'}</Button>
                                    </div>
                                </form>
                            </div>

                            {/* Log out other sessions */}
                            <div className="col-span-3 mt-12">
                                        <h2 className="text-lg font-semibold">Cerrar otras sesiones</h2>
                                        <p className="mt-2 text-sm text-gray-500">Por favor ingresa tu contraseña para confirmar que deseas cerrar tus otras sesiones en todos tus dispositivos.</p>
                            </div>

                            <div className="col-span-9 mt-12">
                                <form onSubmit={handleLogoutOtherSessions} className="space-y-6">
                                        <Input
                                        type="password"
                                        name="logoutPassword"
                                        label="Tu contraseña"
                                        placeholder="Tu contraseña"
                                        value={logoutPassword}
                                        onChange={(e) => setLogoutPassword(e.target.value)}
                                    />

                                    <div>
                                        <Button disabled={isLoggingOutSessions}>{isLoggingOutSessions ? 'Cerrando...' : 'Cerrar otras sesiones'}</Button>
                                    </div>
                                </form>
                            </div>

                            {/* Delete account */}
                            <div className="col-span-3 mt-12">
                                <h2 className="text-lg font-semibold">Eliminar cuenta</h2>
                                <p className="mt-2 text-sm text-gray-500">¿Ya no quieres usar nuestro servicio? Puedes eliminar tu cuenta aquí. Esta acción no es reversible. Toda la información relacionada con esta cuenta será eliminada permanentemente.</p>
                            </div>

                            <div className="col-span-9 mt-12">
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting}
                                        className={`px-4 py-2 ${isDeleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white rounded-md`}
                                    >
                                        {isDeleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
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
