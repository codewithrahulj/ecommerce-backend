import { CONFIG } from "#config.js";
import { errorHandler } from "#middlewares/errorHandler.js";
import orderRoutes from "#routes/orderRoutes.js";
import productRoutes from "#routes/productRoutes.js";
import logger from "#utils/logger/logger.js";
import compression from "compression";
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import * as http from "http";

const app = express();
const port = process.env.PORT ?? "3000";

const server = new http.Server(app);

const corsOptions: cors.CorsOptions = {
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  origin:
    CONFIG.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://localhost:3001"]
      : ["https://ecommerce-frontend-six-gamma.vercel.app"],
};

app.set("trust proxy", true);
app.disable("x-powered-by");

// Express Middlewares
app.use(helmet());
app.use(compression({ br: true, threshold: 0 }));

// Middleware to parse JSON bodies and Cookies
app.use(express.json({ limit: "10mb" }));

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware to apply CORS
app.use(cors(corsOptions));

// /ping
app.get("/ping", (req: Request, res: Response) => {
  res.status(200).send("pong");
});

///
// Web Server Routes
//
app.use("/api", orderRoutes);
app.use("/api/product", productRoutes);

/**
 * Global Error handler
 */
app.use(errorHandler);

process.on("uncaughtException", function (err) {
  logger.fatal(err, "uncaught exception detected");

  // we can add mailer to send mail to dev team here
});

server.listen(port, () => {
  logger.info(`App listening on port ${port}`);
});
