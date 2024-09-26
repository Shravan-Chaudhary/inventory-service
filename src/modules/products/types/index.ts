import { EPricetype } from "../../../constants";

export interface IPriceConfiguration {
    [key: string]: {
        priceType: EPricetype.BASE | EPricetype.ADDITIONAL;
        availableOptions: string[];
    };
}

export interface IProduct {
    name: string;
    description: string;
    image: string;
    priceConfiguration: string;
    attributes: string;
    tenantId: string;
    categoryId: string;
    isPublished?: boolean;
}
