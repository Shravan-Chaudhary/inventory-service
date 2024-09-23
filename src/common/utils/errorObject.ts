import { Request } from "express";
import { HttpError } from "http-errors";
import config from "config";
import { EApplicationEnvoirnment } from "../constants/application";
import { THttpError } from "../http/httpTypes";
import logger from "../../config/logger";

const createErrorObject = (err: HttpError, req: Request): THttpError => {
    const errorObject: THttpError = {
        success: false,
        statusCode: err.statusCode ?? err.status ?? 500,
        request: {
            ip: req.ip ?? null,
            method: req.method,
            url: req.originalUrl
        },
        message: err.message,
        data: null,
        trace: { stack: err.stack }
    };

    // TODO: Log error
    logger.error("Controller_error", {
        meta: errorObject
    });

    // Remove IP,Trace if in production
    if (config.get("server.env") === EApplicationEnvoirnment.PRODUCTION) {
        delete errorObject.request.ip;
        delete errorObject.trace;
    }

    return errorObject;
};

export default createErrorObject;
