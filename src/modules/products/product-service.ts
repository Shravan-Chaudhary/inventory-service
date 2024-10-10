import { CreateHttpError } from "../../common/http";
import paginationLables from "../../config/pagination";
import ProductModel from "./product-model";
import { IFilters, IPaginateQueries, IProduct } from "./types";

export class ProductService {
    public async create(productData: IProduct) {
        try {
            return (await ProductModel.create(productData)) as IProduct;
        } catch (error) {
            if (error instanceof Error) {
                const err = CreateHttpError.InternalServerError(error.message);
                throw err;
            }
            return;
        }
    }

    public async update(id: string, product: IProduct) {
        const updatedProduct = (await ProductModel.findOneAndUpdate(
            { _id: id },
            { $set: product },
            { new: true }
        ).lean()) as IProduct | null;
        if (!updatedProduct) {
            throw CreateHttpError.NotFoundError("Product not found");
        }
        return updatedProduct;
    }

    public async getProductImage(id: string | undefined) {
        const product = (await ProductModel.findById(id).lean()) as IProduct | null;
        if (!product) {
            const err = CreateHttpError.NotFoundError("Product not found");
            throw err;
        }
        return product.image;
    }

    public async getProducts(q: string, filters: IFilters, paginateQueries: IPaginateQueries) {
        const searchQueryRegExp = new RegExp(q, "i");

        const matchQuery = {
            ...filters,
            name: searchQueryRegExp
        };

        const aggregate = ProductModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$category"
            }
        ]);

        return ProductModel.aggregatePaginate(aggregate, {
            ...paginateQueries,
            customLabels: paginationLables
        });

        // const products = await aggregate.exec();
        // return products as IProduct[];
    }
}
