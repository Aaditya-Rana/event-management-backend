import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  thumbnailUrl: string;
  thumbnailPublicId?: string;
  createdBy: Schema.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    thumbnailUrl: { type: String, required: true },
    thumbnailPublicId: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category', categorySchema);
