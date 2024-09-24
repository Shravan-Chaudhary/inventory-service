import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { CreateHttpError, httpResponse, HttpStatus } from "../../common/http";
import createHttpError from "http-errors";
import { ICategory } from "./types";
import { CategoryService } from "./category-service";
import ResponseMessage from "../../common/constants/responseMessage";
import { Logger } from "winston";

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger
    ) {}

    async create(req: Request, res: Response, next: NextFunction) {
        this.logger.info("CONTROLLER_REQUEST", {
            meta: req.body as ICategory
        });
        try {
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

            httpResponse(req, res, HttpStatus.CREATED, ResponseMessage.CREATED, category);
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(CreateHttpError.InternalServerError());
            return;
        }
    }
}
