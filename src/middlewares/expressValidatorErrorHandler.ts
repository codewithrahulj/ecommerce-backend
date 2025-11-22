import { ExpressValidatorError } from "#errors/ExpressValidatorError.js";
import { NextFunction, Request, Response } from "express";
import { ResultFactory, validationResult } from "express-validator";

// Middleware for Express
export const expressValidatorErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = customValidationResult(req).array();

  if (errors.length) {
    const expressValidatorError = new ExpressValidatorError("Validation Error");
    expressValidatorError.errors = errors;
    next(expressValidatorError);
    return;
  }

  next();
};

const customValidationResult: ResultFactory<string> = validationResult.withDefaults({
  formatter: (error) => error.msg as string,
});
