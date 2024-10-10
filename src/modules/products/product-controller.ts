import { Logger } from "winston";
import { v4 as uuidv4 } from "uuid";
import { ProductService } from "./product-service";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CreateHttpError, httpResponse, HttpStatus } from "../../common/http";
import { IAttributes, IFilters, IPriceConfiguration, IProduct, IProductRequest } from "./types";
import ResponseMessage from "../../common/constants/responseMessage";
import { IStorageService } from "../../types/storage";
import { UploadedFile } from "express-fileupload";
import mongoose from "mongoose";

//TODO: Check product access by tenant
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly storageService: IStorageService,
        private readonly logger: Logger
    ) {}

    async create(req: Request, res: Response) {
        this.logger.info("CONTROLLER_REQUEST", {
            meta: req.body as unknown
        });

        // validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = CreateHttpError.BadRequestError(result.array()[0].msg as string);
            throw err;
        }
        // Image upload
        const image = req.files!.image as UploadedFile;
        const imageName = uuidv4();
        await this.storageService.upload({
            fileName: imageName,
            fileData: image.data.buffer
        });
        const { name, description, attributes, categoryId, priceConfiguration, tenantId, isPublished } =
            req.body as IProductRequest;

        const parsedAttributes = JSON.parse(attributes) as IAttributes;
        const parsedPriceConfiguration = JSON.parse(priceConfiguration) as IPriceConfiguration;

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

        const product = await this.productService.create(productData);

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

        const parsedAttributes = JSON.parse(attributes) as IAttributes;
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

        httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, products);
    }
}
