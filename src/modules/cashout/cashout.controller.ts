import { Request, Response, NextFunction } from "express";
import CashoutModel from "../../models/cashout.model";
import { formatUser } from "../../utils/data-transformer.util";

const cashoutReferral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    // check transaction hash
    const cashout = await CashoutModel.findOne({
      transactionHash: data.transactionHash,
    }).exec();

    if (!cashout || cashout === null) {
      const newCashout = await CashoutModel.create({
        user: data.userId,
        membership: data.membershipId,
        referralPoints: data.referralPoints,
        btcWallet: data.btcWallet,
        tbcWallet: data.tbcWallet,
        currentBtcValue: data.currentBtcValue,
        transactionHash: data.transactionHash,
        cashoutType: "referral",
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      });

      console.log("cashout", cashout);

      res.status(200).json({
        message: "Successfully created cashout.",
        success: true,
        cashout: newCashout,
      });
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

export default {
  cashoutReferral,
};
