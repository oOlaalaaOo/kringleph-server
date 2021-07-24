import { Request, Response, NextFunction } from "express";
import bcryptService from "../../services/bcrypt.service";
import jwtService from "../../services/jwt.service";
import UserModel, { IUser } from "../../models/user.model";
import { formatUser } from "../../utils/data-transformer.util";
import AdminModel from "../../models/admin.model";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    // req.app.get('socketService').on('')

    const user = await UserModel.findOne({ username: data.username }).exec();

    console.log("user", user);

    if (!user || user == null) {
      res.status(403).json({
        error: {
          message: "User does not exists.",
          code: "USER_NOT_FOUND",
        },
        success: false,
      });
    }

    if (user && user.password) {
      if (!bcryptService.verifyHashString(data.password, user.password)) {
        res.status(403).json({
          error: {
            message: "Username and password did not matched.",
            code: "INVALID_CREDENTIALS",
          },
          success: false,
        });
      }
    }

    const jwtPayload = {
      _id: user?._id,
      isAdmin: false,
    };

    const accessToken = jwtService.signPayload(jwtPayload);

    res.status(200).json({
      message: "Successful authentication",
      success: true,
      accessToken: accessToken,
      user: formatUser(user),
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

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    const oldUser = await UserModel.findOne({ username: data.username }).exec();

    if (oldUser && oldUser !== null) {
      res.status(400).json({
        error: {
          message: "Username already exists.",
          code: "USERNAME_ALREADY_EXISTS",
        },
        success: false,
      });

      return;
    }

    const user = await UserModel.create({
      username: data.username,
      password: data.password,
      name: data.name,
      email: "",
      mobileNo: "",
      isActive: true,
      tbcWallet: "",
      btcWallet: "",
      isMobileNoVerified: true,
      isEmailVerified: true,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    });

    res.status(200).json({
      message: "Successfully created user.",
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

const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      message: "Successfully get user.",
      success: true,
      user: res.locals.authUser,
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

const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admin = await AdminModel.create({
      username: "admin",
      password: "qwerty",
      name: "redlion",
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    });

    res.status(200).json({
      message: "Successfully created admin.",
      success: true,
      admin: admin,
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

const loginAsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    // req.app.get('socketService').on('')

    const user = await AdminModel.findOne({ username: data.username }).exec();

    if (!user || user == null) {
      res.status(403).json({
        error: {
          message: "User does not exists.",
          code: "USER_NOT_FOUND",
        },
        success: false,
      });
    }

    if (user && user.password) {
      if (!bcryptService.verifyHashString(data.password, user.password)) {
        res.status(403).json({
          error: {
            message: "Username and password did not matched.",
            code: "INVALID_CREDENTIALS",
          },
          success: false,
        });
      }
    }

    const jwtPayload = {
      _id: user?._id,
      isAdmin: true,
    };

    const accessToken = jwtService.signPayload(jwtPayload);

    res.status(200).json({
      message: "Successful authentication",
      success: true,
      accessToken: accessToken,
      user: formatUser(user),
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

const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findById(req.body.userId).exec();

    if (user && user.password) {
      if (!bcryptService.verifyHashString(req.body.currentPassword, user.password)) {
        res.status(400).json({
          error: {
            message: "Current password did not matched.",
            code: "INVALID_CURRENT_PASSWORD",
          },
          success: false,
        });

        return;
      }
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.body.userId },
      {
        password: req.body.newPassword,
      }
    );

    res.status(200).json({
      message: "Successfully get user.",
      success: true,
      user: updatedUser,
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
  login,
  register,
  me,
  registerAdmin,
  loginAsAdmin,
  updatePassword,
};
