import config from "../config/config";

const canLog = config.debug || import.meta.env.DEV;

export const logInfo = (...args) => {
  if (canLog) console.info(...args);
};

export const logWarn = (...args) => {
  if (canLog) console.warn(...args);
};

export const logError = (...args) => {
  if (canLog) console.error(...args);
};
