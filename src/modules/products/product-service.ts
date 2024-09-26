import ProductModel from "./product-model";
import { IProduct } from "./types";

export class ProductService {
    async create(productData: IProduct) {
        return await ProductModel.create(productData);
    }
}
