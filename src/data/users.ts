import { SavedUser, UserDocument } from './models/user';
import DBWrapper from './db-wrapper';
import SnowflakeEntity from './snowflake-entity';
import { bot } from '../bot';

export default class Users extends DBWrapper<SnowflakeEntity, UserDocument> {
    protected async getOrCreate({ id }: SnowflakeEntity) {
        const user = bot.users.cache.get(id);
        if (user?.bot)
            throw new TypeError(`Bots don't have accounts`);
        
        const savedUser = await SavedUser.findById(id);
        if (savedUser
            && savedUser.premiumExpiration
            && savedUser.premiumExpiration <= new Date())
            await this.removePremium(savedUser);

        return savedUser ?? this.create({ id });
    }

    async givePlus(id: string, plan: Plan) {   
        const savedUser = await this.get({ id });
        savedUser.premium = true;
        savedUser.premiumExpiration = this.getExpiration(plan);
        return savedUser.save();
    }
    private getExpiration(plan: Plan) {
        let date = new Date();
        switch (plan) {
          case Plan.One:
            date.setDate(date.getDate() + 30)
            break;
          case Plan.Three:
            date.setDate(date.getDate() + 90)
            break;
          default:
            date = null;
            break;
        }
        return date;
    }
    private removePremium(savedUser: UserDocument) {
        savedUser.premium = false;
        return savedUser.save();
    }

    protected async create({ id }: SnowflakeEntity) {
        return new SavedUser({ _id: id }).save();
    }
}

export enum Plan { One, Three, Forever }