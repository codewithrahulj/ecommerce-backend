export class AppError extends Error {
  constructor(message: string) {
    super(message); // Call the constructor of the base class `Error`

    this.name = "AppError"; // Set the error name to your custom error class name

    Error.captureStackTrace(this, AppError);
  }
}
