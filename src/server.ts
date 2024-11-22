import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config/env.js";
import { errorHandler, notFound, rateLimitByIp } from "@middleware/index.js";
import apiRouter from "./routes.js";

const port = config.PORT || 3000;

const app = express();

// Rate Limiter
app.use(rateLimitByIp);

// Help secure Express apps by setting HTTP response headers.
app.use(helmet());

// Request body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Request logger
app.use(morgan("combined"));

// Register Routes
app.use("/api", apiRouter);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

app
  .listen(port, () => {
    console.log(`Ready on PORT ${port}`);
  })
  .on("error", (err) => console.log(err));
