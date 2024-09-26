import mongoose from "mongoose";
import { IAttributes, ICategory, IPriceConfiguration, EWidgetType } from "./types";
import { EPricetype } from "../../constants";

const attributeSchema = new mongoose.Schema<IAttributes>({
    name: {
        type: String,
        required: true
    },
    widgetType: {
        type: String,
        enum: [EWidgetType.SWITCH, EWidgetType.RADIO],
        required: true
    },
    defaultValue: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    availableOptions: {
        type: [String],
        required: true
    }
});

const priceConfigurationSchema = new mongoose.Schema<IPriceConfiguration>({
    priceType: {
        type: String,
        enum: [EPricetype.BASE, EPricetype.ADDITIONAL],
        required: true
    },
    availableOptions: {
        type: [String],
        required: true
    }
});

const categorySchema = new mongoose.Schema<ICategory>(
    {
        name: {
            type: String,
            required: true
        },
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSchema,
            required: true
        },
        attributes: {
            type: [attributeSchema],
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<ICategory>("Category", categorySchema);
