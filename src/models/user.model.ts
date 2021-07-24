import { Schema, model, Document, HookNextFunction } from "mongoose";
import bcryptService from "../services/bcrypt.service";
import { validAlpha } from "../helpers/validator.helper";

export interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  email?: string;
  mobileNo?: string;
  btcWallet?: string;
  tbcWallet?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isMobileNoVerified: boolean;
  verifiedEmailDate?: any;
  verifiedMobileNoDate?: any;
  createdDate: any;
  updatedDate: any;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true, validate: validAlpha },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, default: null },
    mobileNo: { type: String, default: null },
    btcWallet: { type: String, default: null },
    tbcWallet: { type: String, default: null },
    isActive: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isMobileNoVerified: { type: Boolean, default: false },
    verifiedEmailDate: { type: Date, default: null },
    verifiedMobileNoDate: { type: Date, default: null },
    createdDate: { type: Date, required: true },
    updatedDate: { type: Date, required: true },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", function (next: HookNextFunction) {
  if (!this.isModified("password")) return next();

  try {
    this.password = bcryptService.hashString(this.password);

    return next();
  } catch (err) {
    return next(err);
  }
});

export default model<IUser>("User", userSchema);
