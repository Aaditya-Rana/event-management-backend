import { Schema, model, Document, Types } from 'mongoose';
import dayjs from 'dayjs';
import { EventStatus } from '../constants/enums';

export interface IEvent extends Document {
  eventId: string;
  title: string;
  description?: string;
  location: string;
  isOnline: boolean;
  category: Schema.Types.ObjectId;
  date: Date;
  capacity: number;
  createdBy: Types.ObjectId;
  thumbnailUrl: string;
  thumbnailPublicId?: string;
  status: EventStatus; // Virtual
}

const eventSchema = new Schema<IEvent>(
  {
    eventId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    location: String,
    isOnline: { type: Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    date: { type: Date, required: true },
    capacity: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    thumbnailUrl: { type: String, required: true },
    thumbnailPublicId: String,
  },
  { timestamps: true }
);

eventSchema.virtual('status').get(function (this: IEvent): EventStatus {
  const today = dayjs().startOf('day');
  const eventDate = dayjs(this.date).startOf('day');
  if (eventDate.isBefore(today)) return EventStatus.COMPLETED;
  if (eventDate.isSame(today)) return EventStatus.ONGOING;
  return EventStatus.UPCOMING;
});

eventSchema.set("toObject", { virtuals: true });
eventSchema.set("toJSON", { virtuals: true });

export const Event = model<IEvent>('Event', eventSchema);
