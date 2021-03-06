import { Request, Response, NextFunction } from "express";
/**
 * This middleware checks if the request is compatible with the
 * requested endpoint
 *
 * @param req Express's request Object
 * @param res Express's response Object
 * @param next Express's next function
 */
const checkConfig = (
    req: Request,
    res: Response,
    next: NextFunction
): Response<never> | void => {
    if (!req.is("json")) {
        return res.status(400).json({
            status: 400,
            message: "Content-Type header must be set to application/json",
        });
    }

    if (!req.params || !req.params.configId) {
        return res.status(400).json({
            status: 400,
            message: "A config ID must be provided",
        });
    }

    if (!req.body) {
        return res.status(400).json({
            status: 400,
            message: "You must provide a configuration",
        });
    }

    next();
};

export { checkConfig };
