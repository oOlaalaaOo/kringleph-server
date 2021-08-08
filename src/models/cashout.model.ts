import { Schema, model, Document } from "mongoose";

export interface ICashout extends Document {
  user: string;
  membership: string;
  referralPoints: number;
  btcWallet: string;
  tbcWallet: string;
  currentBtcValue: number;
  transactionHash: string;
  cashoutType: string; // referral, sell
  status: string; // pending, denied, confirmed, paid
  createdDate: any;
  updatedDate: any;
}

const cashoutSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    membership: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    referralPoints: { type: Number, required: true },
    btcWallet: { type: String, required: true },
    tbcWallet: { type: String, required: true },
    currentBtcValue: { type: Number, required: true },
    transactionHash: { type: String, required: true },
    cashoutType: { type: String, required: true },
    status: { type: String, required: true },
    createdDate: { type: Date, required: true },
    updatedDate: { type: Date, required: true },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default model<ICashout>("Admin", cashoutSchema);
