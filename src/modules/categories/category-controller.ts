import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { CreateHttpError } from "../../common/http";
import createHttpError from "http-errors";

export class CategoryController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Promise.resolve(
                "Category created successfully"
            );
            const result = validationResult(req);
            if (!result.isEmpty()) {
                const err = CreateHttpError.BadRequestError(
                    result.array()[0].msg as string
                );
                throw err;
            }

            res.json({
                message: `Category created successfully${req.ip}, ${response}`
            });
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
