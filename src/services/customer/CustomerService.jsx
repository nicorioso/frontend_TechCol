import crudService from '../generic/crud_services';

class CustomerService extends crudService {
  constructor() {
    super('customers');
  }

  async register(customerData) {
    try {
      const response = await this.api.post('/auth/register', customerData, { skipAuth: true });
      console.log('Cliente registrado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error registrando cliente:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      console.log('Intentando login con:', email);
      const response = await this.api.post('/auth/login', { email, password }, { skipAuth: true });

      console.log('Login inicial OK, server response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en login:', error.response?.data ?? error.message, 'status:', error.response?.status);
      throw error;
    }
  }

  async verify(email, code) {
    try {
      console.log('Verificando codigo para:', email);
      const response = await this.api.post('/auth/verify', { email, code }, { skipAuth: true });

      const { accessToken } = response.data;

      if (!accessToken) {
        console.warn('verify: accessToken no presente en la respuesta', response.data);
        return response.data;
      }

      localStorage.setItem('access_token', accessToken);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      console.log('Verificacion exitosa, token guardado');
      return response.data;
    } catch (error) {
      console.error('Error en verify:', error.response?.data ?? error.message, 'status:', error.response?.status);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    console.log('Logout exitoso');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') return null;
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
}

export default new CustomerService();
