import { CONFIG } from "#config.js";
import { IGetAllExtendedBase } from "#types/models/common.js";

import { Prisma } from "../../generated/prisma";
import { BaseModel } from "./BaseModel";

interface IGetAllOrderProductMapQueryParams {
  customSortBy?: Prisma.OrderProductMapOrderByWithRelationInput | Prisma.OrderProductMapOrderByWithRelationInput[];
}

class OrderProductMapModel extends BaseModel {
  _buildWhereCondition = (params: Prisma.OrderProductMapWhereInput) => {
    const whereCondition: Prisma.OrderProductMapWhereInput = { ...params };

    return whereCondition;
  };

  create = async (data: Prisma.OrderProductMapUncheckedCreateInput) => {
    return await this.prisma.orderProductMap.create({ data });
  };

  createMany = async (data: Prisma.OrderProductMapUncheckedCreateInput[]) => {
    return await this.prisma.orderProductMap.createMany({ data });
  };

  delete = async (id: number) => {
    return await this.prisma.orderProductMap.delete({ where: { id } });
  };

  deleteMany = async (params: Prisma.OrderProductMapWhereInput) => {
    return await this.prisma.orderProductMap.deleteMany({ where: params });
  };

  getAll = async (
    queryParams: IGetAllExtendedBase & IGetAllOrderProductMapQueryParams,
    whereParams: Prisma.OrderProductMapWhereInput,
  ) => {
    const whereCondition = this._buildWhereCondition(whereParams);

    const skip =
      queryParams.activePage && queryParams.activePage > 1 && queryParams.limit
        ? (queryParams.activePage - 1) * queryParams.limit
        : 0;

    const take = queryParams.limit ? (queryParams.limit === -1 ? undefined : queryParams.limit) : CONFIG.LIMIT;
    const sortByColumn = queryParams.sortBy ?? "id";
    const sortOrder = queryParams.sortOrder ?? Prisma.SortOrder.desc;
    const orderBy = queryParams.customSortBy ?? {
      [sortByColumn]: sortOrder,
    };

    return await this.prisma.orderProductMap.findMany({
      orderBy: orderBy,
      skip,
      take,
      where: whereCondition,
    });
  };

  getByParams = async (params: Prisma.OrderProductMapWhereInput = {}) => {
    const whereCondition = this._buildWhereCondition(params);

    return await this.prisma.orderProductMap.findFirst({
      orderBy: {
        id: "desc",
      },
      where: whereCondition,
    });
  };

  update = async (id: number, data: Prisma.OrderProductMapUncheckedUpdateInput) => {
    return await this.prisma.orderProductMap.update({ data, where: { id } });
  };
}

export default OrderProductMapModel;
