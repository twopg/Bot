import { model, Schema, Document } from 'mongoose';

export class XPCard {
    backgroundURL = '';
    primary = '';
    secondary = '';
    tertiary = '';
}

export interface UserDocument extends Document {
    _id: string;
    premium: boolean;
    premiumExpiration: Date;
    votes: number;
    xpCard: XPCard;
}

export const SavedUser = model<UserDocument>('user', new Schema({
    _id: String,
    premium: { type: Boolean, default: false },
    premiumExpiration: { type: Date, default: new Date() },
    votes: Number,
    xpCard: { type: Object, default: new XPCard() }
}));
