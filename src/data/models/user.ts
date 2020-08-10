import { model, Schema, Document } from 'mongoose';

export class XPCard {
    backgroundURL = '';
    primary = '';
    secondary = '';
    tertiary = '';
}

const userSchema = new Schema({
    _id: String,
    premium: { type: Boolean, default: false },
    premiumExpiration: { type: Date, default: new Date() },
    xpCard: { type: Object, default: new XPCard() }
});

export interface UserDocument extends Document {
    _id: string;
    premium: boolean;
    premiumExpiration: Date;
    xpCard: XPCard;
}

export const SavedUser = model<UserDocument>('user', userSchema);