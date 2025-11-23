import ProductsModel from "#models/ProductModel.js";

export default class ProductServices {
  private productsModel = new ProductsModel();

  /**
   * Get All Products
   *
   * @returns all products response
   */
  getAllProducts = async () => {
    const products: {
      id: number;
      productDescription: string;
      productName: string;
    }[] = [];

    const records = await this.productsModel.getAll({}, {});

    records.forEach((record) => {
      products.push({
        id: record.id,
        productDescription: record.productDescription,
        productName: record.productName,
      });
    });

    return {
      products,
    };
  };
}
