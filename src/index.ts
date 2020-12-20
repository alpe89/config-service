import express from "express";
import chalk from "chalk";

const app = express();
const PORT = 3456;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(PORT, () => {
    console.log(
        `⚡️ ${chalk.cyan(
            "[Config-Service]:"
        )} Service is running on port ${chalk.magenta(PORT)}`
    );
});
