import crudService from "../generic/crud_services";

class CustomerService extends crudService {
  constructor() {
    super('customers');
  }

  /**
   * Registrar nuevo cliente
   */
  async register(customerData) {
    try {
      const response = await this.api.post('/auth/register', customerData);
      console.log('✅ Cliente registrado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error registrando cliente:', error);
      throw error;
    }
  }

  /**
   * Login - Autenticar usuario
   */
  async login(email, password) {
    try {
      console.log('🔐 Intentando login con:', email);
      const response = await this.api.post('/auth/login', {
        email,
        password
      });

      // El backend en este proyecto envía un mensaje indicando que se
      // ha enviado un código de verificación en vez de devolver tokens.
      // Devolvemos la respuesta tal cual y no guardamos tokens aquí.
      console.log('ℹ️ Login inicial OK, server response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error.response?.data ?? error.message, 'status:', error.response?.status);
      throw error;
    }
  }

  /**
   * Verificar código enviado por email y obtener tokens
   */
  async verify(email, code) {
    try {
      console.log('🔎 Verificando código para:', email);
      const response = await this.api.post('/auth/verify', { email, code });

      // El backend devuelve un AuthResponse con el access token
      const { accessToken } = response.data;

      if (!accessToken) {
        console.warn('⚠️ verify: accessToken no presente en la respuesta', response.data);
        return response.data;
      }

      // Guardar token (y opcionalmente información del usuario si la API la devuelve)
      localStorage.setItem('access_token', accessToken);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      console.log('✅ Verificación exitosa, token guardado');
      return response.data;
    } catch (error) {
      console.error('❌ Error en verify:', error.response?.data ?? error.message, 'status:', error.response?.status);
      throw error;
    }
  }

  /**
   * Logout - Cerrar sesión
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    console.log('✅ Logout exitoso');
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') return null;
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
}

export default new CustomerService();