// models/event.ts

import mongoose, { Document, Schema } from "mongoose";
import { Event } from "../../../../core/models/event.model";

const eventSchema = new Schema<Event & Document>(
  {},
  {
    strict: false, // разрешаем Mongoose сохранять любые поля
    collection: "events", // название коллекции в MongoDB
    timestamps: true, // автоматически добавляет поля createdAt и updatedAt
  },
);

eventSchema.pre("save", function (next) {
  const event = this as Event & Document;
  event.start =
    typeof event.start === "string" ? new Date(event.start) : event.start;
  event.end = event.end
    ? typeof event.end === "string"
      ? new Date(event.end)
      : event.end
    : undefined;
  event.validated_at = event.validated_at
    ? typeof event.validated_at === "string"
      ? new Date(event.validated_at)
      : event.validated_at
    : undefined;
  next();
});

export const EventModel = mongoose.model<Event>("Event", eventSchema);
