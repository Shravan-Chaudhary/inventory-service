import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { CreateHttpError, httpResponse, HttpStatus } from "../../common/http";
import { ICategory } from "./types";
import { CategoryService } from "./category-service";
import ResponseMessage from "../../common/constants/responseMessage";
import { Logger } from "winston";

export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly logger: Logger
    ) {}

    public async create(req: Request, res: Response, _next: NextFunction) {
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

    public async findAll(req: Request, res: Response, _next: NextFunction) {
        this.logger.info("CONTROLLER_REQUEST", {
            meta: req.body as unknown
        });

        const categories = await this.categoryService.findAll();

        httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, categories);
    }
}
