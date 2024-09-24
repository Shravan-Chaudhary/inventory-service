import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { CreateHttpError, httpResponse, HttpStatus } from "../../common/http";
import { ICategory } from "./types";
import { CategoryService } from "./category-service";
import ResponseMessage from "../../common/constants/responseMessage";
import { Logger } from "winston";

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger
    ) {}

    async create(req: Request, res: Response, _next: NextFunction) {
        this.logger.info("CONTROLLER_REQUEST", {
            meta: req.body as ICategory
        });

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = CreateHttpError.BadRequestError(result.array()[0].msg as string);
            throw err;
        }

        const { name, priceConfiguration, attributes } = req.body as ICategory;

        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes
        });

        httpResponse(req, res, HttpStatus.CREATED, ResponseMessage.CREATED, {
            id: category?._id,
            name: category?.name
        });
    }
}
