export function errorHandler(status, errorData = null) {
  switch (status) {
    case 400:
      console.log('❌ Solicitud inválida');
      break;

    case 401:
      console.log('🔐 Sesión expirada, redirigiendo al login...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      break;

    case 403:
      console.log('⛔ Acceso denegado');
      break;

    case 404:
      console.log('🔍 Recurso no encontrado');
      break;

    case 409:
      console.log('⚠️ Conflicto - el recurso ya existe');
      break;

    case 422:
      console.log('📋 Datos inválidos');
      console.log('Errores de validación:', errorData);
      break;

    case 500:
      console.log('💥 Error interno del servidor');
      break;

    case 502:
      console.log('🌐 Puerta de enlace incorrecta');
      break;

    case 503:
      console.log('🔧 Servicio no disponible');
      break;

    default:
      console.log(`⚠️ Error HTTP ${status || 'Desconocido'}`);
  }
}

/**
 * Obtener mensaje de error para mostrar al usuario
 */
export function getErrorMessage(status) {
  const messages = {
    400: 'Solicitud inválida',
    401: 'Sesión expirada. Por favor inicia sesión nuevamente.',
    403: 'No tienes permisos para acceder a este recurso.',
    404: 'El recurso solicitado no fue encontrado.',
    409: 'El recurso ya existe.',
    422: 'Los datos enviados son inválidos.',
    500: 'Error interno del servidor. Intenta más tarde.',
    502: 'Error de conexión. Intenta más tarde.',
    503: 'El servicio no está disponible. Intenta más tarde.'
  };

  return messages[status] || `Error HTTP ${status}`;
}
