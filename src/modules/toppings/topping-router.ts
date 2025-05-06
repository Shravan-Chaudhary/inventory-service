import express from "express";
import { NextFunction, Request, Response } from "express";
import authenticate from "../../common/middlewares/authenticate";
import canAccess from "../../common/middlewares/canAccess";
import fileUpload from "express-fileupload";
import { CreateHttpError } from "../../common/http";
import { ERoles } from "../../constants";
import asyncHandler from "../../common/utils/asyncHandler";
import { ToppingService } from "./topping-service";
import { ToppingController } from "./topping-controller";
import { createMessageProducerBroker } from "../../common/factories/brokerFactory";
import { S3StorageService } from "../s3-storage/s3-storage-service";
import { CreateRequestBody } from "./topping-types";
import createToppingValidator from "./create-topping-validator";

const router = express.Router();

const toppingService = new ToppingService();
const broker = createMessageProducerBroker();
const s3Storage = new S3StorageService();
const toppingController = new ToppingController(s3Storage, toppingService, broker);

router.post(
    "/",
    authenticate,
    canAccess([ERoles.ADMIN, ERoles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500kb
        abortOnLimit: true,
        limitHandler: (_req, _res, next) => {
            const error = CreateHttpError.BadRequestError("File size exceeds the limit");
            next(error);
        }
    }),
    createToppingValidator,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await toppingController.create(req as unknown as Request<object, object, CreateRequestBody>, res, next);
    })
);

export default router;
