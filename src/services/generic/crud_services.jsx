
import { axiosInstance } from "../api/axios";
import { setupInterceptors } from "../api/interceptors";

class crudService {
  constructor(resource) {
    if (!resource) {
      throw new Error('El parámetro "resource" es obligatorio');
    }

    this.api = axiosInstance;
    this.resource = resource;

    // Aplicar interceptores
    setupInterceptors(this.api);
  }

  /**
   * Obtener todos los registros
   */
    async getAll(params = {}) {
        try {
            // Cambiar de: `/api/${this.resource}`
            // A:
            const response = await this.api.get(`/${this.resource}`, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

  /**
   * Obtener registro por ID
   * ERROR ORIGINAL: Usaba POST en lugar de GET
   */
  async getById(id) {
    try {
      const response = await this.api.get(`/${this.resource}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo ${this.resource}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear nuevo registro
   */
  async create(data) {
    try {
      const response = await this.api.post(`/${this.resource}`, data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error creando ${this.resource}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar registro
   * ERROR ORIGINAL: Faltaba parámetro 'data'
   */
  async update(id, data) {
    try {
      const response = await this.api.put(`/${this.resource}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando ${this.resource}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Actualización parcial
   */
  async patch(id, data) {
    try {
      const response = await this.api.patch(`/${this.resource}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error en PATCH ${this.resource}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar registro
   * ERROR ORIGINAL: Faltaba 'await'
   */
  async delete(id) {
    try {
      const response = await this.api.delete(`/${this.resource}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error eliminando ${this.resource}/${id}:`, error);
      throw error;
    }
  }
}

export default crudService;