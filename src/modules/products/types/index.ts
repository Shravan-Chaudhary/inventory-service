import mongoose from "mongoose";
import { EPricetype } from "../../../constants";

export interface IPriceConfiguration {
    [key: string]: {
        priceType: EPricetype.BASE | EPricetype.ADDITIONAL;
        availableOptions: string[];
    };
}

export interface IProduct {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description: string;
    image: string;
    priceConfiguration: string;
    attributes: string;
    tenantId: string;
    categoryId: string;
    isPublished?: boolean;
}

export interface IFilters {
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublished?: boolean;
}

export interface IPaginateQueries {
    page: number;
    limit: number;
}
