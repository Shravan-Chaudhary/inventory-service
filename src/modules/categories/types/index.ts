import { EPricetype } from "../../../constants";

export enum EWidgetType {
    SWITCH = "switch",
    RADIO = "radio"
}

export interface IAttributes {
    name: string;
    widgetType: EWidgetType.SWITCH | EWidgetType.RADIO;
    defaultValue: string;
    availableOptions: string[];
}

export interface IPriceConfiguration {
    [key: string]: {
        priceType: EPricetype.BASE | EPricetype.ADDITIONAL;
        availableOptions: string[];
    };
}

export interface ICategory {
    name: string;
    priceConfiguration: IPriceConfiguration;
    attributes: IAttributes[];
}
