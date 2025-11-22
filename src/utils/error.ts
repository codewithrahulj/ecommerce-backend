import { AppError } from "#errors/AppError.js";

import logger from "./logger/logger";

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error || error instanceof AppError) return error.message;

  const errorObj = error as Error;

  if (errorObj.message) return errorObj.message;

  return String(error);
};

export const getErrorStack = (error: unknown) => {
  if (error instanceof Error) return error.stack ?? error.toString();
  return String(error);
};

export const consoleSystemError = (error: unknown, prefix = "SYSTEM ERROR") => {
  logger.error(error, prefix);
};
