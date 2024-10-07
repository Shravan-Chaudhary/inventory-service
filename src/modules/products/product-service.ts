import { CreateHttpError } from "../../common/http";
import logger from "../../config/logger";
import ProductModel from "./product-model";
import { IProduct } from "./types";

export class ProductService {
    public async create(productData: IProduct) {
        try {
            logger.info("PRODUCT_CREATION_SERVICE", { meta: productData });
            return await ProductModel.create(productData);
        } catch (error) {
            logger.error("PRODUCT_CREATION_ERROR", { meta: error });

            throw error;
        }
    }

    public async update(id: string, product: IProduct) {
        const updatedProduct = await ProductModel.findOneAndUpdate({ _id: id }, { $set: product }, { new: true });
        if (!updatedProduct) {
            throw CreateHttpError.NotFoundError("Product not found");
        }
        return updatedProduct;
    }

    public async getProductImage(id: string | undefined) {
        logger.info("PRODUCT_SERVICE_GET_IMAGE", { meta: id });
        const product = await ProductModel.findById(id);
        logger.info("PRODUCT_SERVICE_GET_IMAGE", { meta: product });
        if (!product) {
            const err = CreateHttpError.NotFoundError("Product not found");
            throw err;
        }
        return product.image;
    }
}
