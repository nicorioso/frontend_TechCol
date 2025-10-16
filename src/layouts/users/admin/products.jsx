// Products.jsx
import React, { useState } from 'react';
import Pagination from './pagination.jsx';

// --- Datos de Ejemplo (Alineados con la tabla 'product' de tu BD) ---
const productsData = [
  { 
    productId: 101, 
    productName: "Laptop Gamer X-500", 
    productDescription: "Potente portátil para juegos con RTX 4070.", 
    productPrice: 1850.00, 
    productStock: 15 
  },
  { 
    productId: 102, 
    productName: "Monitor Curvo 4K", 
    productDescription: "Monitor de 32 pulgadas, 144Hz, ideal para diseño.", 
    productPrice: 699.99, 
    productStock: 50 
  },
  { 
    productId: 103, 
    productName: "Teclado Mecánico RGB", 
    productDescription: "Teclado con switches Cherry Brown y retroiluminación personalizable.", 
    productPrice: 120.50, 
    productStock: 120 
  },
  { 
    productId: 104, 
    productName: "Mouse Inalámbrico Ergonómico", 
    productDescription: "Mouse ligero con sensor de alta precisión para zurdos y diestros.", 
    productPrice: 45.99, 
    productStock: 80 
  },
];

// -----------------------------------------
// 1. MODAL DE CREACIÓN DE PRODUCTO
// -----------------------------------------
const CreateProductModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        productName: '',
        productDescription: '',
        productPrice: 0.00,
        productStock: 0,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? parseFloat(value) : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Generar un ID temporal
        const maxId = Math.max(...productsData.map(p => p.productId), 0);
        const newProductId = maxId > 0 ? maxId + 1 : 1; 
        
        onSave({ ...formData, productId: newProductId });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Crear Nuevo Producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Campo Nombre */}
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-300">Nombre del Producto</label>
                        <input type="text" name="productName" id="productName" value={formData.productName} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" required />
                    </div>
                    
                    {/* Campo Descripción */}
                    <div>
                        <label htmlFor="productDescription" className="block text-sm font-medium text-gray-300">Descripción</label>
                        <textarea name="productDescription" id="productDescription" value={formData.productDescription} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" rows="3" required></textarea>
                    </div>
                    
                    {/* Campo Precio */}
                    <div>
                        <label htmlFor="productPrice" className="block text-sm font-medium text-gray-300">Precio ($)</label>
                        <input type="number" name="productPrice" id="productPrice" value={formData.productPrice} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" min="0" step="0.01" required />
                    </div>
                    
                    {/* Campo Stock */}
                    <div>
                        <label htmlFor="productStock" className="block text-sm font-medium text-gray-300">Stock Inicial</label>
                        <input type="number" name="productStock" id="productStock" value={formData.productStock} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" min="0" required />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition duration-150">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150">
                            Crear Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// -----------------------------------------
// 2. MODAL DE EDICIÓN DE PRODUCTO
// -----------------------------------------
const EditProductModal = ({ product, onClose, onSave }) => {
    // Inicializa el estado del formulario con los datos del producto
    const [formData, setFormData] = useState({
        productName: product.productName,
        productDescription: product.productDescription,
        productPrice: product.productPrice,
        productStock: product.productStock,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? parseFloat(value) : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Llama a la función onSave con el ID y los nuevos datos
        onSave(product.productId, formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Editar Producto ID: {product.productId}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Campo Nombre */}
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-300">Nombre del Producto</label>
                        <input type="text" name="productName" id="productName" value={formData.productName} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" required />
                    </div>
                    
                    {/* Campo Descripción */}
                    <div>
                        <label htmlFor="productDescription" className="block text-sm font-medium text-gray-300">Descripción</label>
                        <textarea name="productDescription" id="productDescription" value={formData.productDescription} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" rows="3" required></textarea>
                    </div>
                    
                    {/* Campo Precio */}
                    <div>
                        <label htmlFor="productPrice" className="block text-sm font-medium text-gray-300">Precio ($)</label>
                        <input type="number" name="productPrice" id="productPrice" value={formData.productPrice} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" min="0" step="0.01" required />
                    </div>
                    
                    {/* Campo Stock */}
                    <div>
                        <label htmlFor="productStock" className="block text-sm font-medium text-gray-300">Stock</label>
                        <input type="number" name="productStock" id="productStock" value={formData.productStock} onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white" min="0" required />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition duration-150">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition duration-150">
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
const DeleteConfirmationModal = ({ product, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-white">Confirmar Eliminación</h2>
                <p className="text-gray-300 mb-6">
                    ¿Estás seguro de que deseas eliminar el producto **{product.productName} (ID: {product.productId})**? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition duration-150">
                        Cancelar
                    </button>
                    <button onClick={() => onConfirm(product.productId)}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-150">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------
// 4. COMPONENTE PRINCIPAL PRODUCTS
// -----------------------------------------
const Products = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState(productsData); // Usamos un estado para poder modificar los datos
    const [editingProduct, setEditingProduct] = useState(null); // Producto seleccionado para editar
    const [deletingProduct, setDeletingProduct] = useState(null); // Producto seleccionado para eliminar
    const [isCreating, setIsCreating] = useState(false); // Estado para el modal de creación

    // Lógica para filtrar los productos basada en el término de búsqueda
    const filteredProducts = products.filter(product =>
        Object.values(product).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // --- Funciones de CRUD ---

    const handleCreate = (newProduct) => {
        // Simulación de API POST
        setProducts([...products, newProduct]);
        alert(`Producto ${newProduct.productName} (ID: ${newProduct.productId}) creado con éxito.`);
    };

    const handleSaveEdit = (id, newFormData) => {
        // Simulación de API PUT/PATCH
        setProducts(products.map(product => 
            product.productId === id ? { ...product, ...newFormData } : product
        ));
        alert(`Producto ${id} actualizado con éxito.`);
        setEditingProduct(null);
    };

    const handleConfirmDelete = (id) => {
        // Simulación de API DELETE
        setProducts(products.filter(product => product.productId !== id));
        alert(`Producto ${id} eliminado.`);
        setDeletingProduct(null);
    };

    return (
        <div className="p-6 bg-gray-800 min-h-screen text-white">
            <h1 className="text-4xl font-bold mb-6 border-b border-gray-600 pb-3">Gestión de Productos 📦</h1>
            
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
                        placeholder="Buscar por nombre, descripción, etc."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                {/* Botón de Crear Nuevo Producto (AZUL) */}
                <button 
                    onClick={() => setIsCreating(true)}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md whitespace-nowrap"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Nuevo Producto
                </button>
            </div>

            <div className="bg-gray-700 rounded-lg shadow-xl overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    {/* Encabezados de la Tabla */}
                    <thead className="text-xs uppercase bg-gray-600">
                        <tr>
                            <th scope="col" className="px-4 py-3">ID</th>
                            <th scope="col" className="px-4 py-3">Nombre</th>
                            <th scope="col" className="px-4 py-3">Descripción</th>
                            <th scope="col" className="px-4 py-3">Precio</th>
                            <th scope="col" className="px-4 py-3">Stock</th>
                            <th scope="col" className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    
                    {/* Cuerpo de la Tabla */}
                    <tbody>
                        {filteredProducts.map((product, index) => (
                            <tr 
                                key={product.productId} 
                                className={index % 2 === 0 ? "bg-gray-700 border-b border-gray-600" : "bg-gray-800 border-b border-gray-600"}
                            >
                                <td className="px-4 py-3 font-medium text-gray-100">{product.productId}</td>
                                <td className="px-4 py-3 font-semibold">{product.productName}</td>
                                <td className="px-4 py-3 max-w-xs truncate text-gray-400">{product.productDescription}</td>
                                <td className="px-4 py-3 text-green-400">${product.productPrice.toFixed(2)}</td>
                                <td className="px-4 py-3">{product.productStock} uds</td>
                                
                                {/* Columna de Acciones */}
                                <td className="px-4 py-3 text-center space-x-2 whitespace-nowrap">
                                    
                                    {/* Botón de Editar (Amarillo) */}
                                    <button 
                                        onClick={() => setEditingProduct(product)}
                                        className="inline-flex items-center justify-center p-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition duration-150 shadow-md"
                                        title="Editar Producto"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>
                                    
                                    {/* Botón de Eliminar (Rojo) */}
                                    <button
                                        onClick={() => setDeletingProduct(product)}
                                        className="inline-flex items-center justify-center p-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
                                        title="Eliminar Producto"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- COMPONENTE DE PAGINACIÓN AÑADIDO --- */}
            <Pagination 
                currentPage={1} // Valores simulados
                totalPages={4}
                pageSize={5}
                totalItems={products.length}
                onPageChange={() => {}} 
                onPageSizeChange={() => {}}
            />

            {/* Renderizado de Modales */}

            {/* Modal de Creación */}
            {isCreating && (
                <CreateProductModal
                    onClose={() => setIsCreating(false)}
                    onSave={handleCreate}
                />
            )}

            {/* Modal de Edición */}
            {editingProduct && (
                <EditProductModal 
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSave={handleSaveEdit}
                />
            )}

            {/* Modal de Confirmación de Eliminación */}
            {deletingProduct && (
                <DeleteConfirmationModal
                    product={deletingProduct}
                    onClose={() => setDeletingProduct(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default Products;