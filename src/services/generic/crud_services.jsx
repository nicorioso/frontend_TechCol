/**
 * Instancia para todos los CRUD del proyecto
 * Incluye: GET(todos y por id), PUT, POST, PATCH y DELETE 
 */

import { axiosInstance } from "../api/axios";

import { setupInterceptors } from "../api/interceptors";

class crudService{
    constructor(resource){
        if (!resource) {
            throw new Error('El párametro "resource" es obligatorio');
        }

        this.api = axiosInstance;
        this.resource = resource;

        // Aplicar interceptores
        setupInterceptors(this.api);
    }

    async getAll(params = {}){
        try {
            const response = await this.api.get(`/api/${this.resource}`, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getById(id){
        try {
            const response = await this.api.post(`/api/${this.resource}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async create(data){
        try {
            const response = await this.api.post(`/api/${this.resource}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async update(id){
        try {
            const response = await this.api.put(`/api/${this.resource}/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async delete(id){
        try {
            const response = this.api.delete(`/api/${this.resource}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default crudService;