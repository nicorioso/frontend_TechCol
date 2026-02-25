import { axiosInstance } from '../api/axios';

class crudService {
  constructor(resource) {
    if (!resource) {
      throw new Error('El parametro "resource" es obligatorio');
    }

    this.api = axiosInstance;
    this.resource = resource;
  }

  async getAll(params = {}) {
    try {
      const response = await this.api.get(`/${this.resource}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const response = await this.api.get(`/${this.resource}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo ${this.resource}/${id}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const response = await this.api.post(`/${this.resource}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error creando ${this.resource}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const response = await this.api.put(`/${this.resource}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando ${this.resource}/${id}:`, error);
      throw error;
    }
  }

  async patch(id, data) {
    try {
      const response = await this.api.patch(`/${this.resource}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error en PATCH ${this.resource}/${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await this.api.delete(`/${this.resource}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando ${this.resource}/${id}:`, error);
      throw error;
    }
  }
}

export default crudService;
