// Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange }) => {
    // Valores de ejemplo para simular el estado de paginación en el front-end
    const internalCurrentPage = 1;
    const internalTotalPages = 4;
    const internalPageSize = 5;
    
    // Opciones para el selector "Show X"
    const pageSizeOptions = [5, 10, 20, 50];

    // Función simulada para cambiar el tamaño de página
    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        // En una aplicación real, aquí llamarías a una función para recargar los datos
        console.log(`Cambiando tamaño de página a: ${newSize}`);
        // onPageSizeChange(newSize); // Si tuvieras la función real
    };

    // Función simulada para cambiar de página
    const handlePageChange = (newPage) => {
        // En una aplicación real, aquí llamarías a una función para recargar la nueva página
        console.log(`Cambiando a la página: ${newPage}`);
        // onPageChange(newPage); // Si tuvieras la función real
    };

    const buttonClass = (isActive = true) => 
        `px-3 py-2 text-sm font-medium ${
            isActive 
            ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
            : 'text-gray-500 bg-gray-800 cursor-not-allowed'
        } border border-gray-600 transition duration-150`;

    return (
        <div className="flex items-center justify-between mt-4">
            
            {/* Parte Izquierda: Estado de la Página y Selector de Tamaño */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="whitespace-nowrap">
                    Página {internalCurrentPage} de {internalTotalPages}
                </span>

                <div className="relative">
                    <select
                        value={internalPageSize}
                        onChange={handlePageSizeChange}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none cursor-pointer"
                    >
                        {pageSizeOptions.map(size => (
                            <option key={size} value={size}>Mostrar {size}</option>
                        ))}
                    </select>
                    {/* Icono de flecha (para replicar el estilo de la imagen) */}
                    <svg className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            {/* Parte Derecha: Controles de Navegación */}
            <div className="inline-flex rounded-lg shadow-md overflow-hidden">
                {/* Primer Página (<<) */}
                <button 
                    onClick={() => handlePageChange(1)}
                    disabled={internalCurrentPage === 1}
                    className={`${buttonClass(internalCurrentPage !== 1)} rounded-l-lg`}
                >
                    &laquo;
                </button>
                {/* Página Anterior (<) */}
                <button 
                    onClick={() => handlePageChange(internalCurrentPage - 1)}
                    disabled={internalCurrentPage === 1}
                    className={buttonClass(internalCurrentPage !== 1)}
                >
                    &lsaquo;
                </button>
                {/* Página Siguiente (>) */}
                <button 
                    onClick={() => handlePageChange(internalCurrentPage + 1)}
                    disabled={internalCurrentPage === internalTotalPages}
                    className={buttonClass(internalCurrentPage !== internalTotalPages)}
                >
                    &rsaquo;
                </button>
                {/* Última Página (>>) */}
                <button 
                    onClick={() => handlePageChange(internalTotalPages)}
                    disabled={internalCurrentPage === internalTotalPages}
                    className={`${buttonClass(internalCurrentPage !== internalTotalPages)} rounded-r-lg`}
                >
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default Pagination;