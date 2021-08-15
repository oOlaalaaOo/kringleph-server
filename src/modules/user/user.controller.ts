import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/user.model";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find({}).exec();

    res.status(200).json({
      message: "Successfully get users.",
      success: true,
      users: users,
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

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.params.userId).exec();

    res.status(200).json({
      message: "Successfully get user.",
      success: true,
      user: user,
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

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: req.body.userId },
      {
        mobileNo: req.body.mobileNo,
        btcWallet: req.body.btcWallet,
        tbcWallet: req.body.tbcWallet,
        gcashNo: req.body.gcashNo,
        paymayaNo: req.body.paymayaNo,
      }
    );

    res.status(200).json({
      message: "Successfully get user.",
      success: true,
      user: user,
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

const checkUsernameIfExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const oldUser = await UserModel.findOne({ username: data.username }).exec();

    if (oldUser && oldUser !== null) {
      res.status(200).json({
        error: {
          message: "Username already exists.",
          code: "USERNAME_ALREADY_EXISTS",
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

export default {
  getUsers,
  getUser,
  updateUser,
  checkUsernameIfExists,
};
