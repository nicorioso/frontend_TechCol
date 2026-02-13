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
      
      const { access_token, user } = response.data;
      
      // Guardar token y datos del usuario
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('✅ Login exitoso:', user);
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error);
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