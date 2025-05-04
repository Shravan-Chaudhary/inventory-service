import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Logger } from "winston";
import { ProductService } from "./product-service";
// import { validationResult } from "express-validator";
import { UploadedFile } from "express-fileupload";
import mongoose from "mongoose";
import ResponseMessage from "../../common/constants/responseMessage";
import { httpResponse, HttpStatus } from "../../common/http";
import { MessageProducerBroker } from "../../types/broker";
import { IStorageService } from "../../types/storage";
import { mapToObject } from "../../utils";
import { IAttributes, IFilters, IPriceConfiguration, IProduct, IProductRequest } from "./types";
import { EProductEvents } from "../../constants";

//TODO: Check product access by tenant
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly storageService: IStorageService,
        private readonly logger: Logger,
        private readonly broker: MessageProducerBroker
    ) {}

    async create(req: Request, res: Response) {
        this.logger.info("CONTROLLER_REQUEST", {
            meta: req.body as unknown
        });

        // validation
        // const result = validationResult(req);
        // if (!result.isEmpty()) {
        //     const err = CreateHttpError.BadRequestError(result.array()[0].msg as string);
        //     throw err;
        // }
        // Image upload
        const image = req.files!.image as UploadedFile;
        const imageName = uuidv4();
        await this.storageService.upload({
            fileName: imageName,
            fileData: image.data.buffer
        });
        const { name, description, attributes, categoryId, priceConfiguration, tenantId, isPublished } =
            req.body as IProductRequest;

        let parsedAttributes: IAttributes[];
        let parsedPriceConfiguration: IPriceConfiguration;

        try {
            parsedAttributes = JSON.parse(attributes) as IAttributes[];
        } catch (error) {
            this.logger.error("Invalid attributes format", {
                error: error
            });
            throw new Error("Invalid attributes format");
        }

        try {
            parsedPriceConfiguration = JSON.parse(priceConfiguration) as IPriceConfiguration;
        } catch (error) {
            this.logger.error("Invalid attributes format", {
                error: error
            });
            throw new Error("Invalid price configuration format");
        }

        const productData = {
            name,
            description,
            attributes: parsedAttributes,
            categoryId,
            image: imageName,
            priceConfiguration: parsedPriceConfiguration,
            tenantId,
            isPublished
        } as IProduct;
        this.logger.info("Parsed data:", productData);
        const product = await this.productService.create(productData);

        if (product) {
            // Send message to Kafka
            await this.broker.sendMessage(
                "product",
                JSON.stringify({
                    event_type: EProductEvents.PRODUCT_CREATE,
                    data: {
                        _id: product._id,
                        priceConfiguration: mapToObject(product.priceConfiguration as unknown as Map<string, any>)
                    }
                })
            );
        }

        httpResponse(req, res, HttpStatus.CREATED, ResponseMessage.CREATED, { id: product?._id });
    }

    public async update(req: Request, res: Response) {
        this.logger.info("CONTROLLER_REQUEST", {
            meta: req.body as unknown
        });

        //TODO: validation
        const { id: productId } = req.params;

        let imageName: string | undefined;
        let oldImageName: string | undefined;

        if (req.files?.image) {
            const oldImageName = await this.productService.getProductImage(productId);

            const image = req.files?.image as UploadedFile;

            // Image upload
            imageName = uuidv4();
            await this.storageService.upload({
                fileName: imageName,
                fileData: image.data.buffer
            });

            // Delete old image
            await this.storageService.delete(oldImageName);
        }

        const { name, description, attributes, categoryId, priceConfiguration, tenantId, isPublished } =
            req.body as IProductRequest;

        const parsedAttributes = JSON.parse(attributes) as IAttributes[];
        const parsedPriceConfiguration = JSON.parse(priceConfiguration) as IPriceConfiguration;

        const productData = {
            name,
            description,
            attributes: parsedAttributes,
            categoryId,
            image: imageName ?? (oldImageName as string),
            priceConfiguration: parsedPriceConfiguration,
            tenantId,
            isPublished
        } as IProduct;

        const updatedProduct = await this.productService.update(productId, productData);

        if (updatedProduct) {
            // Send message to Kafka
            await this.broker.sendMessage(
                "product",
                JSON.stringify({
                    event_type: EProductEvents.PRODUCT_CREATE,
                    data: {
                        _id: updatedProduct._id,

                        priceConfiguration: updatedProduct.priceConfiguration
                    }
                })
            );
        }

        httpResponse(req, res, HttpStatus.OK, ResponseMessage.UPDATED, { id: updatedProduct?._id });
    }

    public async index(req: Request, res: Response) {
        this.logger.info("CONTROLLER_REQUEST", {
            meta: req.body as unknown
        });

        const { q, tenantId, categoryId, isPublished } = req.query;

        const filters: IFilters = {};
        const paginateQueries = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10
        };

        if (isPublished == "true") filters.isPublished = true;

        if (tenantId) {
            filters.tenantId = tenantId as string;
        }

        if (categoryId && mongoose.Types.ObjectId.isValid(categoryId as string)) {
            filters.categoryId = new mongoose.Types.ObjectId(categoryId as string);
        }

        const products = await this.productService.getProducts(q as string, filters, paginateQueries);

        const finalProducts = (products.docs as IProduct[]).map((product: IProduct) => {
            return {
                ...product,
                image: this.storageService.getObjectUrl(product.image)
            };
        });

        const result = {
            docs: finalProducts,
            totaldocs: products.totalDocs,
            pageSize: products.limit,
            curentPage: products.page
        };

        httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, result);
    }
}
