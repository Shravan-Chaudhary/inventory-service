import mongoose from "mongoose";
import { IAttributes, ICategory, IPriceConfiguration } from "./types";

const attributeSchema = new mongoose.Schema<IAttributes>({
    name: {
        type: String,
        required: true
    },
    widgetType: {
        type: String,
        enum: ["switch", "radio"],
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
        enum: ["base", "additional"],
        required: true
    },
    availableOptions: {
        type: [String],
        required: true
    }
});

const categorySchema = new mongoose.Schema<ICategory>({
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
});

const Category = mongoose.model<ICategory>("Category", categorySchema);
export default Category;
