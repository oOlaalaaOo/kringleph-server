import MembershipModel, { IMembership } from "src/models/membership.model";

export const create = async (data: IMembership) => {
  return await MembershipModel.create({
    title: data.title,
    description: data.description || null,
    isPublished: data.isPublished || false,
    createdDate: Date.now(),
    updatedDate: Date.now(),
  });
};

export const update = async (id: string, data: IMembership) => {
  return await MembershipModel.updateOne()
};