import express, { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import membershipController from "./membership.controller";

const membershipRouter: Router = express.Router();

membershipRouter
  .route("/add")
  .post(authMiddleware.isAuthorized, membershipController.addMembership);

membershipRouter
  .route("/referrer-code/check")
  .post(
    authMiddleware.isAuthorized,
    membershipController.checkReferrerCodeIfExists
  );

membershipRouter
  .route("/transaction-hash/check")
  .post(
    authMiddleware.isAuthorized,
    membershipController.checkTransactionHashIfExists
  );

membershipRouter
  .route("/plan/prefill")
  .get(membershipController.prefillMembershipPlans);

membershipRouter
  .route("/plan")
  .get(authMiddleware.isAuthorized, membershipController.getMembershipPlans);

membershipRouter
  .route("/plan/:id")
  .get(authMiddleware.isAuthorized, membershipController.getMembershipPlanById);

membershipRouter
  .route("/user/:userId")
  .get(
    authMiddleware.isAuthorized,
    membershipController.getMembershipsByUserId
  );

membershipRouter
  .route("/downlines/:referrerCode")
  .get(
    authMiddleware.isAuthorized,
    membershipController.getMembershipsByReferrerCode
  );

membershipRouter
  .route("/:membershipId")
  .get(authMiddleware.isAuthorized, membershipController.getMembershipsById);

// admin routes
membershipRouter
  .route("/status/:status")
  .get(
    authMiddleware.isAuthorizedAsAdmin,
    membershipController.getMembershipsByStatus
  );

membershipRouter
  .route("/confirm")
  .post(
    authMiddleware.isAuthorizedAsAdmin,
    membershipController.confirmMembership
  );

export default membershipRouter;
