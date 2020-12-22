import express, { Request, Response, NextFunction } from "express";
import chalk from "chalk";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
// In Local development we use the environment variables in the .env file
if (process.env.NODE_ENV === "local") {
    dotenv.config();
}

import { checkConfig } from "./middleware/checkConfig.middleware";
import { store } from "./data/store";

const app = express();
const PORT = 3456;
// Parse the body of the request as JSON and save it to req.body
app.use(bodyParser.json());

app.get("/", async (req, res) => {
    res.status(200).json({
        status: 200,
        message: "ok",
        data: await store.get(),
    });
});

app.get("/:configId", async (req, res) => {
    const resultSet = await store.get(req.params.configId);

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

app.post("/:configId", checkConfig, async (req, res) => {
    if (req.params.configId !== req.body.id) {
        return res.status(400).json({
            status: 400,
            message:
                "To insert a new configuration the endpoint must match the config's ID",
        });
    }

    const storeUpdated = await store.set(req.params.configId, req.body);

    if (storeUpdated) {
        res.status(200).json({ status: 200, message: "ok" });
    } else {
        res.status(400).json({
            status: 400,
            message: "Could not insert the configuration provided",
        });
    }
});

app.put("/:configId", checkConfig, async (req, res) => {
    const storeUpdated = await store.update(req.params.configId, req.body);

    if (storeUpdated) {
        res.status(200).json({ status: 200, message: "ok" });
    } else {
        res.status(400).json({
            status: 400,
            message: "Could not update the configuration provided",
        });
    }
});

app.delete("/:configId", async (req, res) => {
    const keyDeleted = await store.delete(req.params.configId);

    if (keyDeleted) {
        res.status(200).json({ status: 200, message: "ok" });
    } else {
        res.status(400).json({
            status: 400,
            message: `Could not delete the key ${req.params.configId}`,
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
