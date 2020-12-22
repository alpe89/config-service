import { Request, Response } from "express";
import { checkConfig } from "../../src/middleware/checkConfig.middleware";
import { ReqMock, ResMock } from "../mocks";

describe("Check Config Middleware", () => {
    let res: ResMock;
    let next;

    beforeEach(() => {
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        next = jest.fn();
    });

    test("The request should pass the req.is check", () => {
        const req: ReqMock = {
            is: jest.fn(() => false),
        };

        checkConfig(
            (req as unknown) as Request,
            (res as unknown) as Response,
            next
        );

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test("A request without the ConfigId parameter should be rejected", () => {
        const req: ReqMock = {
            params: {},
            is: jest.fn(() => true),
        };

        checkConfig(
            (req as unknown) as Request,
            (res as unknown) as Response,
            next
        );

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test("A request without the body should be rejected", () => {
        const req: ReqMock = {
            params: { configId: "pippo" },
            is: jest.fn(() => true),
        };

        checkConfig(
            (req as unknown) as Request,
            (res as unknown) as Response,
            next
        );

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test("A well formatted request should call next", () => {
        const req: ReqMock = {
            params: { configId: "pippo" },
            body: {
                id: "pippo",
                name: "test",
                value: [1, 2, 3],
            },
            is: jest.fn(() => true),
        };

        checkConfig(
            (req as unknown) as Request,
            (res as unknown) as Response,
            next
        );

        expect(next).toHaveBeenCalled();
    });
});
