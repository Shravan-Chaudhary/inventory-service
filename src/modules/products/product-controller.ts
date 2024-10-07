import { Logger } from "winston";
import { v4 as uuidv4 } from "uuid";
import { ProductService } from "./product-service";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CreateHttpError, httpResponse, HttpStatus } from "../../common/http";
import { IProduct } from "./types";
import ResponseMessage from "../../common/constants/responseMessage";
import { IStorageService } from "../../types/storage";
import { UploadedFile } from "express-fileupload";

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
            req.body as unknown as IProduct;

        const productData = {
            name,
            description,
            attributes: JSON.parse(attributes as unknown as string),
            categoryId,
            image: imageName,
            priceConfiguration: JSON.parse(priceConfiguration as unknown as string),
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
            req.body as unknown as IProduct;

        const productData = {
            name,
            description,
            attributes: JSON.parse(attributes as unknown as string),
            categoryId,
            image: imageName ?? (oldImageName as string),
            priceConfiguration: JSON.parse(priceConfiguration as unknown as string),
            tenantId,
            isPublished
        } as IProduct;

        const updatedProduct = await this.productService.update(productId, productData);
        httpResponse(req, res, HttpStatus.OK, ResponseMessage.UPDATED, { id: updatedProduct?._id });
    }
}
