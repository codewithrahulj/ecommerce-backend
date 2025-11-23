import { expressValidatorErrorHandler } from "#middlewares/expressValidatorErrorHandler.js";
import ProductServices from "#services/ProductServices.js";
import express, { Request, Response } from "express";

const router = express.Router();

/**
 * Get All Products
 */
router.get("/get-all", expressValidatorErrorHandler, async (req: Request, res: Response) => {
  const productServicesObj = new ProductServices();
  const response = await productServicesObj.getAllProducts();

  res.send({ success: "ok", ...response });
});

export default router;
