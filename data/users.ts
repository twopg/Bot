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
        return savedUser ?? this.create({ id });
    }

    protected async create({ id }: SnowflakeEntity) {
        return new SavedUser({ _id: id }).save();
    }
}