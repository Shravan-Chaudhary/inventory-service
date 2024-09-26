import { Logger } from "winston";
import { ProductService } from "./product-service";
import { Request, Response } from "express";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger
    ) {}

    async create(req: Request, res: Response) {
        this.logger.info("CONTROLLER_REQUEST", {
            meta: req.body as unknown
        });
        const respose = await this.productService.create(req.body);
        res.status(201).json({ message: "created", data: respose });
    }
}
