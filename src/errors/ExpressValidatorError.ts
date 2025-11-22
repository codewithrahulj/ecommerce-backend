export class ExpressValidatorError extends Error {
  public errors: string[];

  constructor(message = "Validation Error") {
    super(message);

    this.name = "ExpressValidatorError";

    Error.captureStackTrace(this, ExpressValidatorError);

    this.errors = [];
  }
}
