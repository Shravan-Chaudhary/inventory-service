import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import initDb from "../../src/config/db";
import CategoryModel from "../../src/modules/categories/category-model";
import createJWKSMock, { JWKSMock } from "mock-jwks";
import { ERoles } from "../../src/constants";
import Config from "../../src/config";

describe("POST /categories", () => {
    let connection: mongoose.Connection;
    let jwks: JWKSMock;
    const API_URL = `${Config.BASE_URL}/categories`;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        connection = await initDb();
    });

    beforeEach(async () => {
        jwks.start();
        const collections = await connection.db!.collections();
        for (let collection of collections!) {
            await collection.deleteMany({});
        }
        // Sync the indexes if any
    });

    afterEach(async () => {
        jwks.stop();
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

            const adminToken = jwks.token({
                sub: "1",
                role: ERoles.ADMIN
            });

            // Act
            const resposne = await request(app)
                .post(API_URL)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(categoryData);

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
            const adminToken = jwks.token({
                sub: "1",
                role: ERoles.ADMIN
            });

            // Act
            await request(app)
                .post(API_URL)
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(categoryData);
            const categoryCollection = await CategoryModel.find();

            // Assert
            expect(categoryCollection).toHaveLength(1);
            expect(categoryCollection[0].name).toBe(categoryData.name);
        });
    });

    // Sad Path
    describe("", () => {});
});
