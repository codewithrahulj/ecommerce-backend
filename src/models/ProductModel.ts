import { CONFIG } from "#config.js";
import { IGetAllExtendedBase } from "#types/models/common.js";

import { Prisma } from "../../generated/prisma";
import { BaseModel } from "./BaseModel";

interface IGetAllProductsQueryParams {
  customSortBy?: Prisma.ProductsOrderByWithRelationInput | Prisma.ProductsOrderByWithRelationInput[];
}

class ProductsModel extends BaseModel {
  _buildWhereCondition = (params: Prisma.ProductsWhereInput) => {
    const whereCondition: Prisma.ProductsWhereInput = { ...params };

    return whereCondition;
  };

  create = async (data: Prisma.ProductsUncheckedCreateInput) => {
    return await this.prisma.products.create({ data });
  };

  delete = async (id: number) => {
    return await this.prisma.products.delete({ where: { id } });
  };

  getAll = async (
    queryParams: IGetAllExtendedBase & IGetAllProductsQueryParams,
    whereParams: Prisma.ProductsWhereInput,
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

    return await this.prisma.products.findMany({
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

  getByParams = async (params: Prisma.ProductsWhereInput = {}) => {
    const whereCondition = this._buildWhereCondition(params);

    return await this.prisma.products.findFirst({
      orderBy: {
        id: "desc",
      },
      where: whereCondition,
    });
  };

  update = async (id: number, data: Prisma.ProductsUncheckedUpdateInput) => {
    return await this.prisma.products.update({ data, where: { id } });
  };
}

export default ProductsModel;