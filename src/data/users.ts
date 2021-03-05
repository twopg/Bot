import { SavedUser, UserDocument } from './models/user';
import DBWrapper from './db-wrapper';
import SnowflakeEntity from './snowflake-entity';
import Deps from '../utils/deps';
import { Client } from 'discord.js';

export default class Users extends DBWrapper<SnowflakeEntity, UserDocument> {
  constructor(
    private bot = Deps.get<Client>(Client)
  ) { super(); }

  protected async getOrCreate({ id }: SnowflakeEntity) {
    const user = this.bot.users.cache.get(id);
    if (user?.bot)
      throw new TypeError(`Bots don't have accounts`);
    
    const savedUser = await SavedUser.findById(id);
    if (savedUser
      && savedUser.premiumExpiration
      && savedUser.premiumExpiration <= new Date())
      await this.removePremium(savedUser);

    return savedUser ?? this.create({ id });
  }

  public async givePlus(id: string, plan: Plan) {
    const savedUser = await this.get({ id });
    
    const expiration = (new Date() > savedUser.premiumExpiration)
    ? new Date()
    : savedUser.premiumExpiration;
    
    savedUser.premiumExpiration = this.getExpiration(expiration, plan);
    savedUser.premium = true;
    return savedUser.updateOne(savedUser);
  }
  private getExpiration(date: Date, plan: Plan) {    
    if (plan === '1_month')
      date.setDate(date.getDate() + 30);
    else if (plan === '3_month')
      date.setDate(date.getDate() + 90);
    else
      date.setFullYear(date.getFullYear() + 1)
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

export type Plan = '1_month' | '3_month' | '1_year'; 
