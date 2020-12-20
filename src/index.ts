import express, { Request, Response, NextFunction } from "express";
import chalk from "chalk";
import bodyParser from "body-parser";

import { checkConfig } from "./middleware/checkConfig.middleware";
import { store } from "./data/store";

const app = express();
const PORT = 3456;
// Parse the body of the request as JSON and save it to req.body
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.status(200).json({ status: 200, message: "ok", data: store.get() });
});

app.get("/:configId", (req, res) => {
    const resultSet = store.get(req.params.configId);

    if (Object.keys(resultSet).length === 0) {
        res.status(404).json({
            status: 404,
            message: `No configuration found for ${req.params.configId}`,
        });
    } else {
        res.status(200).json({
            status: 200,
            message: "ok",
            data: resultSet[req.params.configId],
        });
    }
});

app.post("/:configId", checkConfig, (req, res) => {
    const storeUpdated = store.set(req.params.configId, req.body);

    if (storeUpdated) {
        res.status(200).json({ status: 200, message: "ok" });
    } else {
        res.status(400).json({
            status: 400,
            message: "Could not insert the configuration provided",
        });
    }
});

app.put("/:configId", checkConfig, (req, res) => {
    const storeUpdated = store.update(req.params.configId, req.body);

    if (storeUpdated) {
        res.status(200).json({ status: 200, message: "ok" });
    } else {
        res.status(400).json({
            status: 400,
            message: "Could not update the configuration provided",
        });
    }
});

app.use((req, res) => {
    res.status(404).json({ status: 404, message: "Endpoint not found" });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.statusCode === 200) res.status(500);

    res.json({ status: res.statusCode, message: "ko", error: err.message });
});

app.listen(PORT, () => {
    console.log(
        `⚡️ ${chalk.cyan(
            "[Config-Service]:"
        )} Service is running on port ${chalk.magenta(PORT)}`
    );
});
