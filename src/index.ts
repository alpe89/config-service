import express from "express";
import chalk from "chalk";
import bodyParser from "body-parser";

import { checkConfig } from "./middleware/checkConfig.middleware";

const app = express();
const PORT = 3456;
// Parse the body of the request as JSON and save it to req.body
app.use(bodyParser.json());

app.get("/", (req, res) =>
    res.send("Retrieving every configuration in memory.")
);

app.get("/:configId", (req, res) => {
    res.send("Serving config for " + req.params.configId);
});

app.post("/:configId", checkConfig, (req, res) => {
    res.send("Saving config for " + req.params.configId);
});

app.put("/:configId", checkConfig, (req, res) => {
    res.send("Updating config for " + req.params.configId);
});

app.use((req, res) => {
    res.status(404).json({ status: 404, message: "Endpoint not found" });
});

app.listen(PORT, () => {
    console.log(
        `⚡️ ${chalk.cyan(
            "[Config-Service]:"
        )} Service is running on port ${chalk.magenta(PORT)}`
    );
});
