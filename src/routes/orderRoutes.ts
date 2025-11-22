import { expressValidatorErrorHandler } from "#middlewares/expressValidatorErrorHandler.js";
import OrderServices from "#services/OrderServices.js";
import express, { Request, Response } from "express";
import { body, param, query } from "express-validator";

import { ICreateOrders } from "../types/routes/orders";

const router = express.Router();

/**
 * Get All Orders
 */
router.get(
  "/order",
  [
    query("page", "Page number is invalid").optional().isInt({ min: 1 }),
    query("limit", "Limit is invalid").optional().isInt({ max: 100, min: 1 }),
    query("search", "Search Text is invalid").optional().isString(),
  ],
  expressValidatorErrorHandler,
  async (req: Request, res: Response) => {
    const page: string | undefined = req.query.page as string | undefined;
    const limit: string | undefined = req.query.limit as string | undefined;
    const search: string | undefined = req.query.search as string | undefined;
    const activePage = parseInt(page ?? "1");

    const orderServicesObj = new OrderServices();
    const response = await orderServicesObj.getAllOrders(search ?? "", activePage, limit ? parseInt(limit) : undefined);

    res.send({ success: "ok", ...response });
  },
);

/**
 * Get Order By ID
 */
router.get(
  "/order/:orderId",
  [param("orderId", "Order ID is invalid").isInt({ min: 1 })],
  expressValidatorErrorHandler,
  async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.orderId);

    const orderServicesObj = new OrderServices();
    const response = await orderServicesObj.getOrderById(orderId);

    res.send({ success: "ok", ...response });
  },
);

/**
 * Create An Order
 */
router.post(
  "/orders",
  [
    body("orderDescription", "Order Description is required").trim().notEmpty(),
    body("productIds").isArray().withMessage("Numbers must be an array"),

    // Iterate through the array and validate each element as a number
    body("productIds.*") // This wildcard targets each element of the 'productIds' array
      .isNumeric()
      .withMessage("Each element in productIds must be a number"),
  ],
  expressValidatorErrorHandler,
  async (req: Request, res: Response) => {
    const { orderDescription, productIds } = req.body as ICreateOrders;

    const orderServicesObj = new OrderServices();
    const response = await orderServicesObj.createOrder({
      orderDescription,
      productIds,
    });

    res.send({ success: "ok", ...response });
  },
);

/**
 * Update An Order
 */
router.put(
  "/orders/:orderId",
  [
    param("orderId", "Order ID is invalid").isInt({ min: 1 }),
    body("orderDescription", "Order Description is required").trim().notEmpty(),
    body("productIds").isArray().withMessage("Numbers must be an array"),

    // Iterate through the array and validate each element as a number
    body("productIds.*") // This wildcard targets each element of the 'productIds' array
      .isNumeric()
      .withMessage("Each element in productIds must be a number"),
  ],
  expressValidatorErrorHandler,
  async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.orderId);
    const { orderDescription, productIds } = req.body as ICreateOrders;

    const orderServicesObj = new OrderServices();
    const response = await orderServicesObj.updateOrder(orderId, {
      orderDescription,
      productIds,
    });

    res.send({ success: "ok", ...response });
  },
);

/**
 * Delete An Order
 */
router.delete(
  "/orders/:orderId",
  [param("orderId", "Order ID is invalid").isInt({ min: 1 })],
  expressValidatorErrorHandler,
  async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.orderId);

    const orderServicesObj = new OrderServices();
    await orderServicesObj.deleteOrder(orderId);

    res.send({ success: "ok" });
  },
);

export default router;
