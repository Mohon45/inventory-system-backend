const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const config = require("./config");

const routes = require("./routes");
const { errorConverter, errorHandler } = require("./middleware/error");

const app = express();
app.use(helmet());

app.use(
    cors({
        origin: ["http://localhost:4000", "http://localhost:5173"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later",
    },
});
app.use(limiter);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(StatusCodes.OK).json({
        status: "ok",
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
    });
});

app.use("/api", routes);

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
