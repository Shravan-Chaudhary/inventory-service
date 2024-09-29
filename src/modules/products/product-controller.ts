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

export class ProductController {
    constructor(
        private productService: ProductService,
        private storageService: IStorageService,
        private logger: Logger
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
        const imageName = uuidv4();
        await this.storageService.upload({
            fileName: imageName,
            fileData: (req.files!.image as unknown as UploadedFile).data.buffer
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
        };

        const product = await this.productService.create(productData);

        httpResponse(req, res, HttpStatus.CREATED, ResponseMessage.CREATED, { id: product?._id });
    }
}
