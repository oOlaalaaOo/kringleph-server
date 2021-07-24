import { Schema, model, Document } from "mongoose";

export interface IMembershipPlan extends Document {
  name: string;
  price: number;
  createdDate: any;
  updatedDate: any;
}

const membershipPlanSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    createdDate: { type: Date, required: true },
    updatedDate: { type: Date, required: true },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default model<IMembershipPlan>("MembershipPlan", membershipPlanSchema);
