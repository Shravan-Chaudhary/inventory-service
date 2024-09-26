import { Logger } from "winston";
import { ProductService } from "./product-service";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CreateHttpError, httpResponse, HttpStatus } from "../../common/http";
import { IProduct } from "./types";
import ResponseMessage from "../../common/constants/responseMessage";

export class ProductController {
    constructor(
        private productService: ProductService,
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

        const { name, description, attributes, categoryId, priceConfiguration, tenantId, isPublished } =
            req.body as unknown as IProduct;
        const productData = {
            name,
            description,
            attributes,
            categoryId,
            image: "imge.jpg",
            priceConfiguration,
            tenantId,
            isPublished
        };
        const product = await this.productService.create(productData);

        httpResponse(req, res, HttpStatus.CREATED, ResponseMessage.CREATED, product?._id);
    }
}
