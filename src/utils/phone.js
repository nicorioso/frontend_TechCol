const E164_REGEX = /^\+[1-9]\d{7,14}$/;

export const KNOWN_DIAL_CODES = ["+57", "+52", "+56", "+54", "+51", "+34", "+1"];

const sanitizeCountryCode = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  return digits ? `+${digits}` : "";
};

export const normalizePhoneToE164 = (rawPhone = "", options = {}) => {
  const defaultCountryCode = sanitizeCountryCode(options.defaultCountryCode || "+57") || "+57";
  const input = String(rawPhone ?? "").trim();
  if (!input) return "";

  const hasPlusPrefix = input.startsWith("+");
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";

  let candidate = "";
  if (hasPlusPrefix) {
    candidate = `+${digits}`;
  } else if (digits.length === 10) {
    candidate = `${defaultCountryCode}${digits}`;
  } else if (digits.length >= 11 && digits.length <= 15) {
    candidate = `+${digits}`;
  } else {
    return "";
  }

  return E164_REGEX.test(candidate) ? candidate : "";
};

export const splitE164Phone = (rawPhone = "", options = {}) => {
  const defaultCountryCode = sanitizeCountryCode(options.defaultCountryCode || "+57") || "+57";
  const normalized = normalizePhoneToE164(rawPhone, { defaultCountryCode });
  if (!normalized) {
    return {
      code: defaultCountryCode,
      nationalNumber: String(rawPhone ?? "").replace(/[^\d]/g, ""),
      e164: "",
    };
  }

  const dialCode =
    [...KNOWN_DIAL_CODES]
      .sort((a, b) => b.length - a.length)
      .find((code) => normalized.startsWith(code)) || defaultCountryCode;

  return {
    code: dialCode,
    nationalNumber: normalized.slice(dialCode.length),
    e164: normalized,
  };
};

export const isValidE164Phone = (value = "") => E164_REGEX.test(String(value || "").trim());
