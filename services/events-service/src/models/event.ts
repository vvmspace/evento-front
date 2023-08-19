// models/event.ts

import mongoose, { Document, Schema } from 'mongoose';
import {Event} from "../../../../core/models/event.model";

const eventSchema = new Schema<Event & Document>(
    {},
    {
        strict: false, // разрешаем Mongoose сохранять любые поля
        collection: 'events', // название коллекции в MongoDB
        timestamps: true, // автоматически добавляет поля createdAt и updatedAt
    }
);

export const EventModel = mongoose.model<Event>('Event', eventSchema);
