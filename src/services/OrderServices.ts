import { CONFIG } from "#config.js";
import { AppError } from "#errors/AppError.js";
import OrderProductMapModel from "#models/OrderProductMapModel.js";
import OrdersModel from "#models/OrdersModel.js";
import ProductsModel from "#models/ProductModel.js";
import { ICreateOrders } from "#types/routes/orders.js";

import { Prisma } from "../../generated/prisma";
import { Orders } from "../../generated/prisma";

export default class AuthServices {
  private orderProductMapModel = new OrderProductMapModel();
  private ordersModel = new OrdersModel();
  private productsModel = new ProductsModel();

  /**
   * Create Order
   *
   * @param postData
   * @returns order created response
   */
  createOrder = async (postData: ICreateOrders) => {
    try {
      // validate input data
      for (const productId of postData.productIds) {
        const productsObj = await this.productsModel.getByParams({
          id: productId,
        });

        if (!productsObj) {
          throw new Error("Invalid product ids.");
        }
      }

      // insert order data with product mapping
      const orderData: Prisma.OrdersUncheckedCreateInput = {
        isDeleted: false,
        orderDescription: postData.orderDescription,
        orderProductMaps: {
          create: postData.productIds.map((productId) => ({
            productId,
          })),
        },
      };

      const orderRecord = await this.ordersModel.create(orderData);

      // get created order response
      const records = (await this.ordersModel.getByParams(
        {
          id: orderRecord.id,
          isDeleted: false,
        },
        {
          _count: {
            select: { orderProductMaps: true },
          },
        },
      )) as { _count: { orderProductMaps: number } } & Orders;

      return { order: this.getFormattedOrderObj(records) };
    } catch (error) {
      const message = error instanceof AppError ? error.message : "Error in creating order.";

      throw new AppError(message);
    }
  };

  /**
   * Delete Order
   *
   * @param orderId
   * @returns void
   */
  deleteOrder = async (orderId: number) => {
    try {
      // validate orderId
      const ordersObj = await this.ordersModel.getByParams({
        id: orderId,
      });

      if (!ordersObj) {
        throw new Error("Invalid order id.");
      }

      // mark order as deleted
      await this.ordersModel.update(orderId, { isDeleted: true });
    } catch (error) {
      const message = error instanceof AppError ? error.message : "Error deleting order.";

      throw new AppError(message);
    }
  };

  getAllOrders = async (searchText: string, activePage = 1, limit: null | number = null) => {
    const orders: {
      createdAt: string;
      orderDescription: string;
      orderId: number;
      productCount: number;
    }[] = [];

    const records = await this.ordersModel.getAll(
      {
        activePage: activePage,
        limit: limit ?? CONFIG.LIMIT,
      },
      {
        isDeleted: false,
      },
      {
        searchText,
      },
    );

    const totalRecords = await this.ordersModel.getAllCount(
      {
        isDeleted: false,
      },
      {
        searchText,
      },
    );

    records.forEach((record: { _count: { orderProductMaps: number } } & Orders) => {
      orders.push(this.getFormattedOrderObj(record));
    });

    return {
      orders,
      totalRecords,
    };
  };

  getOrderById = async (orderId: number) => {
    const records = await this.ordersModel.getByParams({
      id: orderId,
      isDeleted: false,
    });

    if (!records) {
      throw new AppError("Order not found");
    }

    const order: {
      createdAt: string;
      orderDescription: string;
      orderId: number;
    } = {
      createdAt: records.createdAt.toISOString(),
      orderDescription: records.orderDescription,
      orderId: records.id,
    };

    return {
      order,
    };
  };

  /**
   * Update Order
   *
   * @param orderId
   * @param postData
   * @returns order updated response
   */
  updateOrder = async (orderId: number, postData: ICreateOrders) => {
    try {
      // validate input data
      for (const productId of postData.productIds) {
        const productsObj = await this.productsModel.getByParams({
          id: productId,
        });

        if (!productsObj) {
          throw new Error("Invalid product ids.");
        }
      }

      // mark existing order product maps as deleted
      await this.orderProductMapModel.deleteMany({
        orderId,
      });

      // insert order product mapping
      const orderProductMappingData: Prisma.OrderProductMapUncheckedCreateInput[] = postData.productIds.map(
        (productId) => ({
          orderId,
          productId,
        }),
      );

      await this.orderProductMapModel.createMany(orderProductMappingData);

      // get updated order response
      const records = (await this.ordersModel.getByParams(
        {
          id: orderId,
          isDeleted: false,
        },
        {
          _count: {
            select: { orderProductMaps: true },
          },
        },
      )) as { _count: { orderProductMaps: number } } & Orders;

      return { order: this.getFormattedOrderObj(records) };
    } catch (error) {
      const message = error instanceof AppError ? error.message : "Error in updating order.";

      throw new AppError(message);
    }
  };

  private getFormattedOrderObj = (record: { _count: { orderProductMaps: number } } & Orders) => {
    return {
      createdAt: record.createdAt.toISOString(),
      orderDescription: record.orderDescription,
      orderId: record.id,
      productCount: record._count.orderProductMaps,
    };
  };
}
