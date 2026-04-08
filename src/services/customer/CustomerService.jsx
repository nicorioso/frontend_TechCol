import crudService from "../generic/crud_services";
import { upsertIdentityProfile } from "../../utils/identityProfile";
import { storageGateway } from "../../utils/storageGateway";
import { normalizePhoneToE164 } from "../../utils/phone";
import { logError, logInfo, logWarn } from "../../utils/logger";

class CustomerService extends crudService {
  constructor() {
    super("customers");
  }

  normalizeIdentifier(identifier, channel = "EMAIL") {
    const normalizedChannel = String(channel || "EMAIL").toUpperCase();
    if (normalizedChannel === "SMS") {
      return normalizePhoneToE164(identifier, { defaultCountryCode: "+57" }) || String(identifier || "").trim();
    }

    return String(identifier || "").trim().toLowerCase();
  }

  async register(customerData, recaptchaToken) {
    const channel = String(customerData?.channel || "EMAIL").toUpperCase();

    try {
      const payload = {
        ...customerData,
        channel,
        recaptchaToken,
        "g-recaptcha-response": recaptchaToken,
      };

      if (payload.customerPhoneNumber) {
        payload.customerPhoneNumber =
          normalizePhoneToE164(payload.customerPhoneNumber, { defaultCountryCode: "+57" }) ||
          payload.customerPhoneNumber;
      }

      const response = await this.api.post("/auth/register", payload, { skipAuth: true });
      logInfo("Cliente registrado:", { channel, response: response.data });
      return response.data;
    } catch (error) {
      logError("Error registrando cliente:", error);
      throw error;
    }
  }

  async resendRegisterCode(identifier, channel, recaptchaToken) {
    const normalizedIdentifier = this.normalizeIdentifier(identifier, channel);
    const normalizedChannel = String(channel || "EMAIL").toUpperCase();

    const response = await this.api.post(
      "/auth/register/resend-code",
      {
        identifier: normalizedIdentifier,
        channel: normalizedChannel,
        "g-recaptcha-response": recaptchaToken,
      },
      { skipAuth: true }
    );

    return response.data;
  }

  async login(identifier, password, recaptchaToken, channel = "EMAIL") {
    const start = performance.now();
    const normalizedChannel = String(channel || "EMAIL").toUpperCase();
    const normalizedIdentifier = this.normalizeIdentifier(identifier, normalizedChannel);

    try {
      const payload = {
        identifier: normalizedIdentifier,
        password,
        channel: normalizedChannel,
        "g-recaptcha-response": recaptchaToken,
      };

      logInfo("Intentando login con:", {
        identifier: normalizedIdentifier,
        channel: normalizedChannel,
      });
      logInfo("Payload login preparado:", {
        identifier: normalizedIdentifier,
        channel: normalizedChannel,
        hasRecaptchaToken: Boolean(recaptchaToken),
      });

      const response = await this.api.post("/auth/login", payload, {
        skipAuth: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      logInfo("Login inicial OK, server response:", response.data);
      return response.data;
    } catch (error) {
      logError(
        "Error en login:",
        error.response?.data ?? error.message,
        "status:",
        error.response?.status
      );
      logWarn("Detalle login rechazado:", {
        identifier: normalizedIdentifier,
        channel: normalizedChannel,
        hasRecaptchaToken: Boolean(recaptchaToken),
        backendResponse: error.response?.data,
      });
      throw error;
    } finally {
      const elapsed = Math.round(performance.now() - start);
      logInfo(`Tiempo /auth/login: ${elapsed}ms`);
    }
  }

  async checkAccountExists(identifier, channel = "EMAIL") {
    const normalizedChannel = String(channel || "EMAIL").toUpperCase();
    const normalizedIdentifier = this.normalizeIdentifier(identifier, normalizedChannel);
    const response = await this.api.post(
      "/auth/account-exists",
      { identifier: normalizedIdentifier, channel: normalizedChannel },
      { skipAuth: true }
    );
    return response.data;
  }

  async verify(identifier, channelOrCode, maybeCode) {
    const start = performance.now();
    const code = maybeCode ?? channelOrCode;
    const channel =
      maybeCode === undefined
        ? String(identifier || "").includes("@")
          ? "EMAIL"
          : "SMS"
        : channelOrCode;
    const normalizedChannel = String(channel || "EMAIL").toUpperCase();
    const normalizedIdentifier = this.normalizeIdentifier(identifier, normalizedChannel);

    try {
      logInfo("Verificando codigo para:", {
        identifier: normalizedIdentifier,
        channel: normalizedChannel,
      });
      const response = await this.api.post(
        "/auth/verify",
        { identifier: normalizedIdentifier, channel: normalizedChannel, code },
        { skipAuth: true }
      );

      const { accessToken } = response.data;

      if (!accessToken) {
        logWarn("verify: accessToken no presente en la respuesta", response.data);
        return response.data;
      }

      storageGateway.set("access_token", accessToken);
      const normalizedUser = upsertIdentityProfile(
        response.data.user || {
          customerEmail: normalizedIdentifier,
          email: normalizedIdentifier,
        },
        normalizedIdentifier
      );
      storageGateway.setJson("user", normalizedUser);

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

  async verifyRegister(identifier, channel, code) {
    const normalizedChannel = String(channel || "EMAIL").toUpperCase();
    const normalizedIdentifier = this.normalizeIdentifier(identifier, normalizedChannel);
    const response = await this.api.post(
      "/auth/verifyRegister",
      { identifier: normalizedIdentifier, channel: normalizedChannel, code },
      { skipAuth: true }
    );
    return response.data;
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
