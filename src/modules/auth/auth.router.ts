import express, { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import authController from "./auth.controller";

const authRouter: Router = express.Router();

authRouter.route("/login").post(authController.login);
authRouter.route("/register").post(authController.register);
authRouter.route("/registeradmin").get(authController.registerAdmin);
authRouter.route("/me").post(authMiddleware.isAuthorized, authController.me);
authRouter.route("/update/password").post(authMiddleware.isAuthorized, authController.updatePassword);

// admin routes
authRouter.route("/admin/login").post(authController.loginAsAdmin);
authRouter
  .route("/admin/me")
  .post(authMiddleware.isAuthorizedAsAdmin, authController.me);

export default authRouter;
