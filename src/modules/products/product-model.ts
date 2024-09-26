import mongoose from "mongoose";
import { EPricetype } from "../../constants";

const attributeSchema = new mongoose.Schema({
    name: {
        type: String
    },
    value: {
        type: mongoose.Schema.Types.Mixed
    }
});

const priceConfigurationSchema = new mongoose.Schema({
    priceType: {
        type: String,
        enum: [EPricetype.ADDITIONAL, EPricetype.BASE]
    },
    availableOptions: {
        type: Map,
        of: Number
    }
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSchema
        },
        attributes: [attributeSchema],
        tenantId: {
            type: String,
            required: true
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        isPublished: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
