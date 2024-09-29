import logger from "../../config/logger";
import ProductModel from "./product-model";
import { IProduct } from "./types";

export class ProductService {
    async create(productData: IProduct) {
        try {
            logger.info("PRODUCT_CREATION_SERVICE", { meta: productData });
            return await ProductModel.create(productData);
        } catch (error) {
            logger.error("PRODUCT_CREATION_ERROR", { meta: error });

            throw error;
        }
    }
}
