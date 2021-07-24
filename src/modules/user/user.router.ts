import express, { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import userController from "./user.controller";

const userRouter: Router = express.Router();

// admin routes
userRouter
  .route("/")
  .get(authMiddleware.isAuthorizedAsAdmin, userController.getUsers);

userRouter
  .route("/:userId")
  .get(authMiddleware.isAuthorized, userController.getUser);

userRouter
  .route("/update")
  .post(authMiddleware.isAuthorized, userController.updateUser);

export default userRouter;
