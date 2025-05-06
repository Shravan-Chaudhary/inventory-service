import { NextFunction, Response, Request } from "express";
import { MessageProducerBroker } from "../../types/broker";
import { ToppingService } from "./topping-service";
import { CreateRequestBody, Topping, ToppingEvents } from "./topping-types";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";
import { CreateHttpError, httpResponse, HttpStatus } from "../../common/http";
import ResponseMessage from "../../common/constants/responseMessage";
import { IStorageService } from "../../types/storage";

export class ToppingController {
    constructor(
        private storage: IStorageService,
        private toppingService: ToppingService,
        private broker: MessageProducerBroker
    ) {}

    create = async (req: Request<object, object, CreateRequestBody>, res: Response, next: NextFunction) => {
        try {
            const image = req.files!.image as UploadedFile;
            const fileUuid = uuidv4();

            // TODO: add error handling
            await this.storage.upload({
                fileName: fileUuid,
                fileData: image.data.buffer
            });

            // TODO: Add error handling
            const savedTopping = await this.toppingService.create({
                ...req.body,
                image: fileUuid,
                tenantId: req.body.tenantId
            } as Topping);
            // TODO: add logging

            // TODO: move toping name to config
            await this.broker.sendMessage(
                "topping",
                JSON.stringify({
                    event_type: ToppingEvents.TOPPING_CREATE,
                    data: {
                        id: savedTopping._id,
                        price: savedTopping.price,
                        tenantId: savedTopping.tenantId
                    }
                })
            );

            httpResponse(req as unknown as Request, res, HttpStatus.CREATED, ResponseMessage.CREATED, {
                id: savedTopping._id
            });
        } catch (error) {
            if (error instanceof Error) {
                const err = CreateHttpError.InternalServerError(error.message);
                return next(err);
            }
        }
    };

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const toppings = await this.toppingService.getAll(req.query.tenantId as string);

            //    TODO: add error handling
            const readyToppings = toppings.map((topping) => {
                return {
                    id: topping._id,
                    name: topping.name,
                    price: topping.price,
                    tenantId: topping.tenantId,
                    image: this.storage.getObjectUrl(topping.image)
                };
            });
            httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, readyToppings);
        } catch (error) {
            if (error instanceof Error) {
                const err = CreateHttpError.InternalServerError(error.message);
                return next(err);
            }
        }
    };
}
