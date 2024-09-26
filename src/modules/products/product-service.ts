export class ProductService {
    async create(_productData: unknown) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return "product created";
    }
}
