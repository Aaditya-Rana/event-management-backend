import { Schema, model, Document } from 'mongoose';
import { BookingStatus } from '../constants/enums';

export interface IBooking extends Document {
  user: Schema.Types.ObjectId;
  event: Schema.Types.ObjectId;
  seats: number;
  status: BookingStatus;
  bookedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    seats: { type: Number, required: true, min: 1, max: 2 },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.CONFIRMED,
    },
    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, event: 1 }, { unique: true });

export const Booking = model<IBooking>('Booking', bookingSchema);
