let NODE_ENV = process.env.NODE_ENV ?? "development";
if (process.env.NODE_ENVIRONMENT) {
  NODE_ENV = process.env.NODE_ENVIRONMENT;
}

export const CONFIG = {
  IS_DEVELOPMENT: NODE_ENV === "development",
  IS_PRODUCTION: NODE_ENV === "production",
  IS_UAT: NODE_ENV === "uat",
  LIMIT: 50,
  NODE_ENV: NODE_ENV,
};
