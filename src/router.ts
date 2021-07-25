import express, { NextFunction, Request, Response } from "express";
import authRouter from "./modules/auth/auth.router";
import membershipRouter from "./modules/membership/membership.router";
import userRouter from "./modules/user/user.router";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/membership", membershipRouter);
router.use("/user", userRouter);

export default router;
