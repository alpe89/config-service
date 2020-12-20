import { Request, Response } from "express";
import { checkConfig } from "../../src/middleware/checkConfig.middleware";

describe("Check Config Middleware", () => {
    test("A request without the Content-Type header should be rejected", () => {
        const next = jest.fn();
        const req: any = {
            is: jest.fn(() => false),
        };
        const res: any = {
            status: function () {
                return this;
            },
            json: jest.fn(),
        };

        checkConfig(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
    });
});
