export interface IAttributes {
    name: string;
    widgetType: "switch" | "radio";
    defaultValue: string;
    availableOptions: string[];
}

export interface IPriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: string[];
    };
}

export interface ICategory {
    name: string;
    priceConfiguration: IPriceConfiguration;
    attributes: IAttributes[];
}
