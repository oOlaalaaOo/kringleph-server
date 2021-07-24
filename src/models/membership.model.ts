import { Schema, model, Document } from "mongoose";

export interface IMembership extends Document {
  user: string;
  referralCode: string;
  referrerCode: string;
  adminBtcWallet: string;
  transactionHash: string;
  membershipPlan: string;
  membershipPlanPrice: string;
  referralPoints: number;
  status: string;
  confirmedDate: any;
  deniedDate: any;
  createdDate: any;
  updatedDate: any;
}

const membershipSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    referralCode: { type: String, required: true },
    referrerCode: { type: String, required: true },
    adminBtcWallet: { type: String, default: null },
    transactionHash: { type: String, required: true },
    membershipPlan: { type: Schema.Types.ObjectId, ref: "MembershipPlan", required: true },
    membershipPlanPrice: { type: Number, required: true },
    currentBtcValue: { type: Number, required: true },
    referralPoints: { type: Number, default: 0 },
    status: { type: String, default: "pending" }, // pending, confirmed, denied, activated, deactivated
    confirmedDate: { type: Date, default: null },
    deniedDate: { type: Date, default: null },
    createdDate: { type: Date, required: true },
    updatedDate: { type: Date, required: true },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default model<IMembership>("Membership", membershipSchema);
