import { AppError } from "#errors/AppError.js";
import { ExpressValidatorError } from "#errors/ExpressValidatorError.js";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  const throwErrorMessage =
    error instanceof ExpressValidatorError
      ? error.errors
      : error instanceof AppError
        ? error.message
        : "Error occured while processing the request";

  res.status(422).send({ error: throwErrorMessage, success: "error" });
};
