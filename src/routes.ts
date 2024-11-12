import express from "express";
import userRoutes from "./modules/users/users.route.js";

const apiRouter = express.Router();

apiRouter.use("/healthcheck", (req, res) => {
  res.send({ message: "OK" });
});

apiRouter.use("/users", userRoutes);

export default apiRouter;
