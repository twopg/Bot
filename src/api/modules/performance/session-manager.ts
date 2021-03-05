import { auth } from '../../server';
import { bot } from '../../../bot';
import User from '@2pg/oauth/lib/types/user';
import Guild from '@2pg/oauth/lib/types/guild';

export class SessionManager {
  private sessions = new Map<string, UserSession>();

  get(key: string) {
    return this.sessions.get(key) ?? this.create(key);
  }
  
  async create(key: string) {
    const timeToClear = 5 * 60 * 1000;
    setTimeout(() => this.sessions.delete(key), timeToClear);
    await this.update(key);
  
    return this.sessions.get(key);
  }
  
  async update(key: string) {
    return this.sessions
      .set(key, {
        authUser: await auth.getUser(key),
        guilds: this.getManageableGuilds(await auth.getGuilds(key))
      });
  }
  
  private getManageableGuilds(authGuilds: any): Guild[] {
    return authGuilds
      .array()
      .filter(g => g.permissions.includes('MANAGE_GUILD'))
      .map(g => bot.guilds.cache.get(g.id))
      .filter(g => g);
  }
}

interface UserSession {
  authUser: User;
  guilds: Guild[];
}
