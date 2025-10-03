// Users.jsx
import React, { useState } from 'react';
<<<<<<< HEAD
import {BrowserRouter as Router, Routes, Rsoute} from 'react-router-dom';
=======
import router from 'next/react'
>>>>>>> 461345ad1dc803cdced39bde24759ee12cb299a1
import Pagination from './pagination.jsx';

// --- Datos de Ejemplo (Alineados con la tabla 'customer' de tu BD) ---
// CAMBIO: Renombramos la variable a usersData para evitar conflicto con la función setUsers
const initialUsersData = [
  { 
    customerId: 1, 
    customerName: "Jane", 
    customerLastName: "Cooper", 
    customerEmail: "jane.cooper@example.com", 
    customerPhoneNumber: "555-1234", 
    roleId: "Admin" 
  },
  { 
    customerId: 2, 
    customerName: "Cody", 
    customerLastName: "Fisher", 
    customerEmail: "cody.fisher@example.com", 
    customerPhoneNumber: "555-5678", 
    roleId: "Owner" 
  },
  { 
    customerId: 3, 
    customerName: "Esther", 
    customerLastName: "Howard", 
    customerEmail: "esther.howard@example.com", 
    customerPhoneNumber: "555-9012", 
    roleId: "Member" 
  },
  { 
    customerId: 4, 
    customerName: "Jenny", 
    customerLastName: "Wilson", 
    customerEmail: "jenny.wilson@example.com", 
    customerPhoneNumber: "555-3456", 
    roleId: "Member" 
  },
  { 
    customerId: 5, 
    customerName: "Kristin", 
    customerLastName: "Watson", 
    customerEmail: "kristin.watson@example.com", 
    customerPhoneNumber: "555-7890", 
    roleId: "Admin" 
  },
];

// -----------------------------------------
// 1. MODAL DE CREACIÓN DE USUARIO
// -----------------------------------------
const CreateUserModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerLastName: '',
        customerEmail: '',
        customerPhoneNumber: '',
        roleId: 'Member', // Valor por defecto
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // NOTA: Para generar el ID correctamente, necesitamos acceder a la lista actual. 
        // En este ejemplo, usaremos un valor grande para simular la generación.
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Crear Nuevo Usuario</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Campos de entrada para la creación */}
                    <div>
                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-300">Nombre</label>
                        <input type="text" name="customerName" id="customerName" value={formData.customerName} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" required />
                    </div>
                    <div>
                        <label htmlFor="customerLastName" className="block text-sm font-medium text-gray-300">Apellido</label>
                        <input type="text" name="customerLastName" id="customerLastName" value={formData.customerLastName} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" required />
                    </div>
                    <div>
                        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-300">Email</label>
                        <input type="email" name="customerEmail" id="customerEmail" value={formData.customerEmail} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" required />
                    </div>
                    <div>
                        <label htmlFor="customerPhoneNumber" className="block text-sm font-medium text-gray-300">Teléfono</label>
                        <input type="text" name="customerPhoneNumber" id="customerPhoneNumber" value={formData.customerPhoneNumber} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" />
                    </div>
                    <div>
                        <label htmlFor="roleId" className="block text-sm font-medium text-gray-300">Rol ID</label>
                        <select name="roleId" id="roleId" value={formData.roleId} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" required>
                            <option value="Admin">Admin</option>
                            <option value="Owner">Owner</option>
                            <option value="Member">Member</option>
                        </select>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition duration-150">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150">
                            Crear Usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// -----------------------------------------
// 2. MODAL DE EDICIÓN
// -----------------------------------------
const EditUserModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        customerName: user.customerName,
        customerLastName: user.customerLastName,
        customerEmail: user.customerEmail,
        customerPhoneNumber: user.customerPhoneNumber,
        roleId: user.roleId,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(user.customerId, formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Editar Usuario ID: {user.customerId}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-300">Nombre</label>
                        <input type="text" name="customerName" id="customerName" value={formData.customerName} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" required />
                    </div>
                    <div>
                        <label htmlFor="customerLastName" className="block text-sm font-medium text-gray-300">Apellido</label>
                        <input type="text" name="customerLastName" id="customerLastName" value={formData.customerLastName} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" required />
                    </div>
                    <div>
                        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-300">Email</label>
                        <input type="email" name="customerEmail" id="customerEmail" value={formData.customerEmail} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" required />
                    </div>
                    <div>
                        <label htmlFor="customerPhoneNumber" className="block text-sm font-medium text-gray-300">Teléfono</label>
                        <input type="text" name="customerPhoneNumber" id="customerPhoneNumber" value={formData.customerPhoneNumber} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" />
                    </div>
                    <div>
                        <label htmlFor="roleId" className="block text-sm font-medium text-gray-300">Rol ID</label>
                        <select name="roleId" id="roleId" value={formData.roleId} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" required>
                            <option value="Admin">Admin</option>
                            <option value="Owner">Owner</option>
                            <option value="Member">Member</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition duration-150">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// -----------------------------------------
// 3. MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
// -----------------------------------------
const DeleteConfirmationModal = ({ user, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-white">Confirmar Eliminación</h2>
                <p className="text-gray-300 mb-6">
                    ¿Estás seguro de que deseas eliminar al usuario **{user.customerName} {user.customerLastName} (ID: {user.customerId})**? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition duration-150">
                        Cancelar
                    </button>
                    <button onClick={() => onConfirm(user.customerId)}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-150">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------
// 4. COMPONENTE PRINCIPAL USERS
// -----------------------------------------
// CAMBIO: La función se llama Users, no UsersTable
const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');
    // CORRECCIÓN: Usamos initialUsersData para inicializar 'users'
    const [users, setUsers] = useState(initialUsersData); 
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [isCreating, setIsCreating] = useState(false); 

    // Lógica para filtrar los usuarios
    const filteredUsers = users.filter(user =>
        Object.values(user).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // --- Funciones de CRUD ---

    const handleCreate = (newUserData) => {
        // CORRECCIÓN: Generamos el ID a partir del estado 'users'
        const newUserId = Math.max(...users.map(u => u.customerId), 0) + 1;
        const newUser = { ...newUserData, customerId: newUserId };
        
        // En un entorno real, aquí se haría la llamada a la API (POST)
        setUsers([...users, newUser]);
        alert(`Usuario ${newUser.customerName} creado con éxito (ID: ${newUser.customerId}).`);
        setIsCreating(false); // Cierra el modal después de crear
    };

    // como puedo invocar este metodo getUsers() para que me traiga los usuarios de la base de datos y no los de initialUsersData?
    // Podrías usar useEffect para llamar a getUsers() cuando el componente se monte.
    // Ejemplo:
    /*
    useEffect(() => { 


    const handleSaveEdit = (id, newFormData) => {
        setUsers(users.map(user => 
            user.customerId === id ? { ...user, ...newFormData } : user
        ));
        alert(`Usuario ${id} actualizado con éxito.`);
        setEditingUser(null); // Cierra el modal de edición
    };

    const handleConfirmDelete = (id) => {
        setUsers(users.filter(user => user.customerId !== id));
        alert(`Usuario ${id} eliminado.`);
        setDeletingUser(null);
    };

    return (
        <div className="p-6 bg-gray-800 min-h-screen text-white">
            <h1 className="text-4xl font-bold mb-6 border-b border-gray-600 pb-3">Gestión de Usuarios 🧑‍💻</h1>
            
            {/* Contenedor de Búsqueda y Botón */}
            <div className="flex items-center justify-between mb-4 space-x-4">
                {/* Barra de Búsqueda */}
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full p-2 pl-10 text-sm text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                        placeholder="Buscar por nombre, email, etc."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                {/* Botón de Crear Nuevo Usuario (AZUL) */}
                <button 
                    onClick={() => setIsCreating(true)}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md whitespace-nowrap"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Nuevo Usuario
                </button>
            </div>

            <div className="bg-gray-700 rounded-lg shadow-xl overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase bg-gray-600">
                        <tr>
                            <th scope="col" className="px-4 py-3">ID</th>
                            <th scope="col" className="px-4 py-3">Nombre</th>
                            <th scope="col" className="px-4 py-3">Apellido</th>
                            <th scope="col" className="px-4 py-3">Email</th>
                            <th scope="col" className="px-4 py-3">Teléfono</th>
                            <th scope="col" className="px-4 py-3">Rol</th>
                            <th scope="col" className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr 
                                key={user.customerId} 
                                className={index % 2 === 0 ? "bg-gray-700 border-b border-gray-600" : "bg-gray-800 border-b border-gray-600"}
                            >
                                <td className="px-4 py-3 font-medium text-gray-100">{user.customerId}</td>
                                <td className="px-4 py-3">{user.customerName}</td>
                                <td className="px-4 py-3">{user.customerLastName}</td>
                                <td className="px-4 py-3">{user.customerEmail}</td>
                                <td className="px-4 py-3">{user.customerPhoneNumber}</td>
                                <td className="px-4 py-3">{user.roleId}</td>
                                
                                <td className="px-4 py-3 text-center space-x-2 whitespace-nowrap">
                                    
                                    {/* Botón de Editar (Amarillo) */}
                                    <button 
                                        onClick={() => setEditingUser(user)}
                                        className="inline-flex items-center justify-center p-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition duration-150 shadow-md"
                                        title="Editar Usuario"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>
                                    
                                    {/* Botón de Eliminar (Rojo) */}
                                    <button
                                        onClick={() => setDeletingUser(user)}
                                        className="inline-flex items-center justify-center p-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
                                        title="Eliminar Usuario"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Componente de Paginación */}
            <Pagination 
                currentPage={1} 
                totalPages={Math.ceil(users.length / 5)} // Cálculo simulado de totalPages
                pageSize={5}
                totalItems={users.length}
                onPageChange={() => {}} 
                onPageSizeChange={() => {}}
            />

            {/* MODALES */}

            {/* Modal de Creación */}
            {isCreating && (
                <CreateUserModal
                    onClose={() => setIsCreating(false)}
                    onSave={handleCreate}
                />
            )}

            {/* Modal de Edición */}
            {editingUser && (
                <EditUserModal 
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSaveEdit}
                />
            )}

            {/* Modal de Confirmación de Eliminación */}
            {deletingUser && (
                <DeleteConfirmationModal
                    user={deletingUser}
                    onClose={() => setDeletingUser(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

// CORRECCIÓN: Exportamos el componente funcional Users, no la tabla de datos.
export default Users;