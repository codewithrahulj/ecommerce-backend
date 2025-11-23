import { CONFIG } from "#config.js";
import { IGetAllExtendedBase } from "#types/models/common.js";
import { IOrdersExtendedSearch } from "#types/models/orders.js";

import { Prisma } from "../../generated/prisma";
import { BaseModel } from "./BaseModel";

interface IGetAllOrdersQueryParams {
  customSortBy?: Prisma.OrdersOrderByWithRelationInput | Prisma.OrdersOrderByWithRelationInput[];
}

class OrdersModel extends BaseModel {
  _buildIncludeCondition = (params?: Prisma.OrdersInclude) => {
    const includeCondition: Prisma.OrdersInclude = { ...params };

    return includeCondition;
  };

  _buildWhereCondition = (params: Prisma.OrdersWhereInput, _extendedWhereParams?: IOrdersExtendedSearch) => {
    const whereCondition: Prisma.OrdersWhereInput = { ...params };

    if (_extendedWhereParams && _extendedWhereParams.searchText) {
      whereCondition.orderDescription = {
        contains: _extendedWhereParams.searchText,
      };
    }

    return whereCondition;
  };

  create = async (data: Prisma.OrdersUncheckedCreateInput) => {
    return await this.prisma.orders.create({ data });
  };

  delete = async (id: number) => {
    return await this.prisma.orders.delete({ where: { id } });
  };

  deleteMany = async (data: Prisma.OrdersWhereInput) => {
    return await this.prisma.orders.deleteMany({ where: data });
  };

  getAll = async (
    queryParams: IGetAllExtendedBase & IGetAllOrdersQueryParams,
    whereParams: Prisma.OrdersWhereInput,
    extendedWhereParams?: IOrdersExtendedSearch,
  ) => {
    const whereCondition = this._buildWhereCondition(whereParams, extendedWhereParams);

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

    return await this.prisma.orders.findMany({
      include: {
        _count: {
          select: { orderProductMaps: true },
        },
      },
      orderBy: orderBy,
      skip,
      take,
      where: whereCondition,
    });
  };

  getAllCount = async (params: Prisma.OrdersWhereInput, extendedWhereParams?: IOrdersExtendedSearch) => {
    const whereCondition = this._buildWhereCondition(params, extendedWhereParams);

    return await this.prisma.orders.aggregate({
      _count: true,
      where: whereCondition,
    });
  };

  getByParams = async (params: Prisma.OrdersWhereInput = {}, includeParams?: Prisma.OrdersInclude) => {
    const whereCondition = this._buildWhereCondition(params);
    const includeCondition = this._buildIncludeCondition(includeParams);

    return await this.prisma.orders.findFirst({
      include: includeCondition,
      orderBy: {
        id: "desc",
      },
      where: whereCondition,
    });
  };

  update = async (id: number, data: Prisma.OrdersUncheckedUpdateInput) => {
    return await this.prisma.orders.update({ data, where: { id } });
  };
}

export default OrdersModel;
