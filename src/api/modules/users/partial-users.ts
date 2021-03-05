import fetch from 'node-fetch';
import { bot } from '../../../bot';
import { APIError } from '../api-utils';

export class PartialUsers {
  readonly cache = new Map<string, PartialUser>();

  async get(id: string): Promise<PartialUser> {
    const isSnowflake = /\d{18}/.test(id);
    if (!isSnowflake) return null;

    const user = this.cache.get(id) ?? await this.fetchUser(id);    
    if (!user) return null;
    if (user.message?.includes('401'))
      throw new APIError(500);
    else if (user.message?.includes('404'))
      throw new APIError(404);

    this.cache.set(id, user);
    setTimeout(() => this.cache.delete(id), 60 * 60 * 1000);
    
    return {
      ...user,
      displayAvatarURL: this.getAvatarURL(user),
      tag: `${user.username}#${user.discriminator}`
    };
  }

  private getAvatarURL({ id, avatar }: PartialUser) {
    return (avatar)
      ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;
  }

  private async fetchUser(id: string) {
    const discordRes = await fetch(`https://discord.com/api/v6/users/${id}`, {
      headers: { Authorization: `Bot ${bot.token}` }
    });

    if (discordRes.status === 429)
      throw new APIError(429);
    else if (discordRes.status === 404)
      throw new APIError(404);

    return await discordRes.json();
  }
}

export interface PartialUser {
  id: string;
  username: string;
  avatar?: string;
  bot?: boolean;
  discriminator: string;
  public_flags: number;
  displayAvatarURL: string;
  tag: string;
}
