import { Schema, model, Document } from "mongoose";

export interface IActivityLog extends Document {
  referredMembership: string;
  referrerMembership: string;
  referralPoints: number;
  description?: string;
  createdDate: any;
  updatedDate: any;
}

const activityLogSchema = new Schema(
  {
    referredMembership: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    referrerMembership: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    referralPoints: { type: Number, default: 0 },
    description: { type: String, default: null },
    createdDate: { type: Date, required: true },
    updatedDate: { type: Date, required: true },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default model<IActivityLog>("ActivityLog", activityLogSchema);
