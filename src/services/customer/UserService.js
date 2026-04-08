import { axiosInstance } from "../api";
import { normalizePhoneToE164 } from "../../utils/phone";

const UserService = {
  getProfile: async (id) => {
    const res = await axiosInstance.get(`/customers/${id}`);
    return res.data;
  },

  patchProfile: async (id, data) => {
    const payload = { ...data };
    if (typeof payload.customerPhoneNumber === "string" && payload.customerPhoneNumber.trim()) {
      const normalizedPhone = normalizePhoneToE164(payload.customerPhoneNumber, {
        defaultCountryCode: "+57",
      });
      if (!normalizedPhone) {
        throw new Error("Telefono invalido. Usa formato internacional E.164, ejemplo +573001234567.");
      }
      payload.customerPhoneNumber = normalizedPhone;
    }
    const res = await axiosInstance.patch(`/customers/${id}`, payload);
    return res.data;
  },

  deleteAccount: async (id) => {
    const res = await axiosInstance.delete(`/customers/${id}`);
    return res.data;
  },

  requestAuthenticatedPasswordChange: async (channel) => {
    const res = await axiosInstance.post(
      "/auth/password-change/request",
      { channel },
      { preserveSessionOnAuthError: true }
    );
    return res.data;
  },

  verifyAuthenticatedPasswordChange: async (channel, code) => {
    const res = await axiosInstance.post(
      "/auth/password-change/verify",
      { channel, code },
      { preserveSessionOnAuthError: true }
    );
    return res.data;
  },

  confirmAuthenticatedPasswordChange: async (newPassword) => {
    const res = await axiosInstance.post(
      "/auth/password-change/confirm",
      { newPassword },
      { preserveSessionOnAuthError: true }
    );
    return res.data;
  },

  startPasswordChange: async (email, password) => {
    const res = await axiosInstance.post("/auth/changePasswordAuthen", { email, password });
    return res.data;
  },

  requestPasswordRecovery: async (identifier, channel, recaptchaToken) => {
    const normalizedIdentifier =
      String(channel || "").toUpperCase() === "SMS"
        ? normalizePhoneToE164(identifier, { defaultCountryCode: "+57" }) || identifier
        : identifier;
    const res = await axiosInstance.post(
      "/auth/forgot-password",
      {
        identifier: normalizedIdentifier,
        channel,
        "g-recaptcha-response": recaptchaToken,
      },
      { skipAuth: true }
    );
    return res.data;
  },

  verifyPasswordRecoveryCodeByChannel: async (identifier, channel, code) => {
    const normalizedIdentifier =
      String(channel || "").toUpperCase() === "SMS"
        ? normalizePhoneToE164(identifier, { defaultCountryCode: "+57" }) || identifier
        : identifier;
    const res = await axiosInstance.post(
      "/auth/password-recovery/verify",
      { identifier: normalizedIdentifier, channel, code },
      { skipAuth: true }
    );
    return res.data;
  },

  resetPasswordByRecovery: async (identifier, channel, newPassword, recaptchaToken) => {
    const normalizedIdentifier =
      String(channel || "").toUpperCase() === "SMS"
        ? normalizePhoneToE164(identifier, { defaultCountryCode: "+57" }) || identifier
        : identifier;
    const res = await axiosInstance.post(
      "/auth/reset-password",
      {
        identifier: normalizedIdentifier,
        channel,
        newPassword,
        "g-recaptcha-response": recaptchaToken,
      },
      { skipAuth: true }
    );
    return res.data;
  },

  verifyPasswordChangeCode: async (email, code) => {
    const res = await axiosInstance.post("/auth/changePasswordVerifiCode", { email, code });
    return res.data;
  },

  changePassword: async (email, newPassword) => {
    const res = await axiosInstance.post("/auth/changePassword", { email, newPassword });
    return res.data;
  },

  setGooglePassword: async (newPassword) => {
    const res = await axiosInstance.post("/auth/google/set-password", { newPassword });
    return res.data;
  },
};

export default UserService;
