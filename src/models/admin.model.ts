import { Schema, model, Document, HookNextFunction } from "mongoose";
import { validEmail, validAlpha } from "../helpers/validator.helper";
import bcryptService from "../services/bcrypt.service";

export interface IAdmin extends Document {
  name: string;
  username: string;
  password: string;
  createdDate: any;
  updatedDate: any;
}

const adminSchema = new Schema(
  {
    name: { type: String, required: true, validate: validAlpha },
    username: { type: String, required: true },
    password: { type: String, required: true },
    createdDate: { type: Date, required: true },
    updatedDate: { type: Date, required: true },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

adminSchema.pre<IAdmin>("save", function (next: HookNextFunction) {
  if (!this.isModified("password")) return next();

  try {
    this.password = bcryptService.hashString(this.password);

    return next();
  } catch (err) {
    return next(err);
  }
});

export default model<IAdmin>("Admin", adminSchema);
