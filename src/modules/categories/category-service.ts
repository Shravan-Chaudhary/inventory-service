import { ICategory } from "./types";
import CategoryModel from "./category-model";

export class CategoryService {
    async create(categoryData: ICategory) {
        try {
            const category = new CategoryModel(categoryData);
            const savedCategory = await category.save();
            return savedCategory;
        } catch (error) {
            if (error instanceof Error) throw error;
            return;
        }
    }

    async findAll() {
        try {
            const categories = await CategoryModel.find();
            return categories as ICategory[];
        } catch (error) {
            if (error instanceof Error) throw error;
            return;
        }
    }
}
