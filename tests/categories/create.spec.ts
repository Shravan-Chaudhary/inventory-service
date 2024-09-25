import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import initDb from "../../src/config/db";
import CategoryModel from "../../src/modules/categories/category-model";

describe("POST /categories", () => {
    let connection: mongoose.Connection;
    const API_URL = "/api/v1/categories";

    beforeAll(async () => {
        connection = await initDb();
    });

    beforeEach(async () => {
        const collections = await connection.db!.collections();
        for (let collection of collections!) {
            await collection.deleteMany({});
        }
        // Sync the indexes if any
    });

    afterAll(async () => {
        // Close the database connection
        await connection.close();
        await mongoose.disconnect();
    });

    // Happy Path
    describe("Given all fields", () => {
        it("should return 201 status code", async () => {
            // Arrange
            const categoryData = {
                name: "Pizza",
                priceConfiguration: {
                    Size: {
                        priceType: "base",
                        availableOptions: ["Small", "Medium", "Large"]
                    },
                    Crust: {
                        priceType: "additional",
                        availableOptions: ["Thin", "Thick"]
                    }
                },
                attributes: [
                    {
                        name: "isHit",
                        widgetType: "switch",
                        defaultValue: "No",
                        availableOptions: ["Yes", "No"]
                    },
                    {
                        name: "Spiciness",
                        widgetType: "radio",
                        defaultValue: "Medium",
                        availableOptions: ["Less", "Medium", "Hot"]
                    }
                ]
            };
            // Act
            const resposne = await request(app).post(API_URL).send(categoryData);
            // Assert
            expect(resposne.statusCode).toBe(201);
        });
        it("should save the category in database", async () => {
            // Arrange
            const categoryData = {
                name: "Pizza",
                priceConfiguration: {
                    Size: {
                        priceType: "base",
                        availableOptions: ["Small", "Medium", "Large"]
                    },
                    Crust: {
                        priceType: "additional",
                        availableOptions: ["Thin", "Thick"]
                    }
                },
                attributes: [
                    {
                        name: "isHit",
                        widgetType: "switch",
                        defaultValue: "No",
                        availableOptions: ["Yes", "No"]
                    },
                    {
                        name: "Spiciness",
                        widgetType: "radio",
                        defaultValue: "Medium",
                        availableOptions: ["Less", "Medium", "Hot"]
                    }
                ]
            };
            // Act
            await request(app).post(API_URL).send(categoryData);
            const categoryCollection = await CategoryModel.find();

            // Assert
            expect(categoryCollection).toHaveLength(1);
            expect(categoryCollection[0].name).toBe(categoryData.name);
        });
    });

    // Sad Path
    describe("", () => {});
});
