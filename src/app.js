import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
app.use(express.static("/.public"));

import healthcheckRouter from "./routes/healthcheck.routes.js";
import registerUserRouter from "./routes/user.routes.js";
import loginUserRouter from "./routes/user.routes.js";
<<<<<<< HEAD
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", registerUserRouter);
app.use("/api/v1/users", loginUserRouter);
=======
import logOutUserRouter from "./routes/user.routes.js";
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", registerUserRouter);
app.use("/api/v1/users", loginUserRouter);
app.use("/api/v1/users", logOutUserRouter);
>>>>>>> 167f0ff (Create Login and LogOut)

export { app };
