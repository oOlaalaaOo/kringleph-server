import { Request, Response, NextFunction } from "express";
import MembershipModel from "../../models/membership.model";
import MembershipPlanModel from "../../models/membership-plan.model";
import ActivityLogModel from "../../models/activity-log.model";
import request from "request";
import { v4 as uuidv4 } from "uuid";

const addMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const membershipPlan = await MembershipPlanModel.findById(
      data.membershipPlanId
    ).exec();

    request.get(
      `https://blockchain.info/tobtc?currency=USD&value=${
        membershipPlan !== null ? membershipPlan.price : 0
      }`,
      async function (error, response, body) {
        const membership = await MembershipModel.create({
          user: data.userId,
          referralCode: uuidv4(),
          referrerCode: data.referrerCode || "leader",
          adminBtcWallet: data.adminBtcWallet,
          transactionHash: data.transactionHash,
          membershipPlan: data.membershipPlanId,
          membershipPlanPrice:
            membershipPlan !== null ? membershipPlan.price : 0,
          currentBtcValue: body,
          referralPoints: 0,
          status: "pending",
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
        });

        res.status(200).json({
          message: "Successfully created membership.",
          success: true,
          membership: membership,
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      error: {
        message: "Something went wrong on the server.",
        code: "SERVER_ERROR",
        error: err,
      },
      success: false,
    });
  }
};

const checkReferrerCodeIfExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const membership = await MembershipModel.findOne({
      referralCode: data.referrerCode,
    }).exec();

    if (!membership || membership === null) {
      res.status(200).json({
        error: {
          message: "Referrer code does not exists.",
          code: "REFERRER_CODE_NOT_FOUND",
        },
        success: false,
      });

      return;
    }

    res.status(200).json({
      message: "Successfully get membership.",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: {
        message: "Something went wrong on the server.",
        code: "SERVER_ERROR",
        error: err,
      },
      success: false,
    });
  }
};

const checkTransactionHashIfExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const membership = await MembershipModel.findOne({
      transactionHash: data.transactionHash,
    }).exec();

    if (!membership || membership === null) {
      res.status(200).json({
        message: "Transaction hash is valid.",
        success: true,
      });

      return;
    }

    res.status(200).json({
      error: {
        message: "Transaction hash already exists.",
        code: "TRANSACTION_HASH_EXISTS",
      },
      success: false,
    });
  } catch (err) {
    res.status(500).json({
      error: {
        message: "Something went wrong on the server.",
        code: "SERVER_ERROR",
        error: err,
      },
      success: false,
    });
  }
};

const prefillMembershipPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plans = [
      { name: "bronze", price: 100.0 },
      { name: "silver", price: 200.0 },
      { name: "gold", price: 500.0 },
      { name: "diamond", price: 1000.0 },
    ];

    await Promise.all(
      plans.map(async (plan) => {
        await MembershipPlanModel.create({
          name: plan.name,
          price: plan.price,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
        });
      })
    );

    res.status(200).json({
      message: "Successfully prefilled membership plans.",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: {
        message: "Something went wrong on the server.",
        code: "SERVER_ERROR",
        error: err,
      },
      success: false,
    });
  }
};

const getMembershipPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const membershipPlans = await MembershipPlanModel.find({}).exec();

    res.status(200).json({
      message: "Successfully get membership plans.",
      success: true,
      membershipPlans: membershipPlans,
    });
  } catch (err) {
    res.status(500).json({
      error: {
        message: "Something went wrong on the server.",
        code: "SERVER_ERROR",
        error: err,
      },
      success: false,
    });
  }
};

const getMembershipPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const membershipPlan = await MembershipPlanModel.findById(
      req.params.id
    ).exec();

    res.status(200).json({
      message: "Successfully get membership plans.",
      success: true,
      membershipPlan: membershipPlan,
    });
  } catch (err) {
    res.status(500).json({
      error: {
        message: "Something went wrong on the server.",
        code: "SERVER_ERROR",
        error: err,
      },
      success: false,
    });
  }
};

const getMembershipsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberships = await MembershipModel.find({ user: req.params.userId })
      .populate("membershipPlan")
      .exec();

    res.status(200).json({
      message: "Successfully get membership plans.",
      success: true,
      memberships: memberships,
    });
  } catch (err) {
    res.status(500).json({
      error: {
        message: "Something went wrong on the server.",
        code: "SERVER_ERROR",
        error: err,
      },
      success: false,
    });
  }
};

const getMembershipsByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = req.params;

    let status = params.status;

    if (status === "all") {
      const memberships = await MembershipModel.find({})
        .populate("membershipPlan user")
        .exec();

      res.status(200).json({
        message: "Successfully get membership plans.",
        success: true,
        memberships: memberships,
      });
    } else {
      const memberships = await MembershipModel.find({ status: status })
        .populate("membershipPlan user")
        .exec();

      res.status(200).json({
        message: "Successfully get membership plans.",
        success: true,
        memberships: memberships,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: {
        message: "Something went wrong on the server.",
        code: "SERVER_ERROR",
        error: err,
      },
      success: false,
    });
  }
};

const confirmMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const updatedMembership = await MembershipModel.findOneAndUpdate(
      { _id: data.membershipId, status: "pending" },
      { status: "confirmed" }
    ).exec();

    if (!updatedMembership || updatedMembership === null) {
      res.status(404).json({
        error: {
          message: "No updated membership.",
          code: "SERVER_ERROR",
        },
      });

      return;
    }

    const referrerMembership = await MembershipModel.findOne({
      referralCode: updatedMembership.referrerCode,
      status: "confirmed",
    }).exec();

    if (!referrerMembership || referrerMembership === null) {
      res.status(404).json({
        error: {
          message: "No referrer.",
          code: "SERVER_ERROR",
        },
      });

      return;
    }

    const referralPoints = Number(referrerMembership.referralPoints) + 10;

    await MembershipModel.findOneAndUpdate(
      {
        _id: referrerMembership._id,
      },
      {
        referralPoints: referralPoints,
      }
    );

    await ActivityLogModel.create({
      referredMembership: updatedMembership._id,
      referrerMembership: referrerMembership._id,
      referralPoints: referralPoints,
      description: "added referral points",
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    });

    res.status(200).json({
      message: "Successfully updated membership.",
      success: true,
      membership: updatedMembership,
    });
  } catch (err) {
    res.status(500).json({
      error: {
        message: "Something went wrong on the server.",
        code: "SERVER_ERROR",
        error: err,
      },
      success: false,
    });
  }
};

const getMembershipsByReferrerCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = req.params;

    const memberships = await MembershipModel.find({
      referrerCode: params.referrerCode,
    })
      .populate("membershipPlan user")
      .exec();

    res.status(200).json({
      message: "Successfully get membership downlines.",
      success: true,
      memberships: memberships,
    });
  } catch (err) {
    res.status(500).json({
      error: {
        message: "Something went wrong on the server.",
        code: "SERVER_ERROR",
        error: err,
      },
      success: false,
    });
  }
};

const getMembershipsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const membership = await MembershipModel.findById(req.params.membershipId)
      .populate("membershipPlan")
      .exec();

    res.status(200).json({
      message: "Successfully get membership plans.",
      success: true,
      membership: membership,
    });
  } catch (err) {
    res.status(500).json({
      error: {
        message: "Something went wrong on the server.",
        code: "SERVER_ERROR",
        error: err,
      },
      success: false,
    });
  }
};

export default {
  addMembership,
  checkReferrerCodeIfExists,
  checkTransactionHashIfExists,
  prefillMembershipPlans,
  getMembershipPlans,
  getMembershipPlanById,
  getMembershipsByStatus,
  getMembershipsByUserId,
  confirmMembership,
  getMembershipsByReferrerCode,
  getMembershipsById,
};
