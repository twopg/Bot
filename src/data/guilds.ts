import { GuildDocument, SavedGuild } from './models/guild';
import DBWrapper from './db-wrapper';
import SnowflakeEntity from './snowflake-entity';

export default class Guilds extends DBWrapper<SnowflakeEntity, GuildDocument> {
    protected async getOrCreate({ id }: SnowflakeEntity) {
        const savedGuild = await SavedGuild.findById(id);
        return savedGuild ?? this.create({ id });
    }

    protected create({ id }: SnowflakeEntity) {
        return new SavedGuild({ _id: id }).save();
    }
}