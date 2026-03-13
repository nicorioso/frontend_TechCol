import crudService from "../generic/crud_services";
import { upsertIdentityProfile } from "../../utils/identityProfile";
import { storageGateway } from "../../utils/storageGateway";
import { logError, logInfo, logWarn } from "../../utils/logger";

class CustomerService extends crudService {
  constructor() {
    super("customers");
  }

  async register(customerData) {
    try {
      const response = await this.api.post("/auth/register", customerData, { skipAuth: true });
      logInfo("Cliente registrado:", response.data);
      return response.data;
    } catch (error) {
      logError("Error registrando cliente:", error);
      throw error;
    }
  }

  async login(email, password) {
    const start = performance.now();
    try {
      logInfo("Intentando login con:", email);
      const response = await this.api.post("/auth/login", { email, password }, { skipAuth: true });

      logInfo("Login inicial OK, server response:", response.data);
      return response.data;
    } catch (error) {
      logError(
        "Error en login:",
        error.response?.data ?? error.message,
        "status:",
        error.response?.status
      );
      throw error;
    } finally {
      const elapsed = Math.round(performance.now() - start);
      logInfo(`Tiempo /auth/login: ${elapsed}ms`);
    }
  }

  async verify(email, code) {
    const start = performance.now();
    try {
      logInfo("Verificando codigo para:", email);
      const response = await this.api.post("/auth/verify", { email, code }, { skipAuth: true });

      const { accessToken } = response.data;

      if (!accessToken) {
        logWarn("verify: accessToken no presente en la respuesta", response.data);
        return response.data;
      }

      storageGateway.set("access_token", accessToken);
      if (response.data.user) {
        const normalizedUser = upsertIdentityProfile(response.data.user, email);
        storageGateway.setJson("user", normalizedUser);
      }

      logInfo("Verificacion exitosa, token guardado");
      return response.data;
    } catch (error) {
      logError(
        "Error en verify:",
        error.response?.data ?? error.message,
        "status:",
        error.response?.status
      );
      throw error;
    } finally {
      const elapsed = Math.round(performance.now() - start);
      logInfo(`Tiempo /auth/verify: ${elapsed}ms`);
    }
  }

  logout() {
    storageGateway.remove("access_token");
    storageGateway.remove("user");
    logInfo("Logout exitoso");
  }

  async logoutRemote() {
    try {
      await this.api.post("/auth/logout", {}, { skipAuth: true });
    } catch (error) {
      logWarn("logoutRemote: error al cerrar sesion remota", error?.response?.data ?? error?.message);
    }
  }

  getCurrentUser() {
    return storageGateway.getJson("user", null);
  }

  isAuthenticated() {
    return !!storageGateway.get("access_token");
  }
}

export default new CustomerService();
