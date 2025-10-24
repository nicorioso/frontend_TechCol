const status = error.response?.status;

switch (status) {
    case 400:
        console.log('Solicitud invalida');
        break;

    case 401:
        console.log('Sesion expirada, redirigiendo al login');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        break;

    case 403:
        console.log('Acceso denegado');
        break;

    case 404:
        console.log('Recurso no encontrado');
        break;

    case 409:
        console.log('Conflicto - el recurso ya existe');
        break;

    case 422:
        console.log('Datos invalidos');
        break;

    case 500:
        console.log('Puerta de enlace encontrada');
        break;
    case 502:
        console.log('Servicio no disponible');
        break;

    case 503:
        console.log('Servicio no disponible');
        break;

    default:
        console.log(`⚠️ Error HTTP ${status}`);
        break;
}