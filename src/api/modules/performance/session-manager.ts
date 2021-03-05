import User from '@2pg/oauth/lib/types/user';
import Guild from '@2pg/oauth/lib/types/guild';
import { auth } from '../auth-client';
import { Client } from 'discord.js';
import Deps from '../../../utils/deps';

export class SessionManager {
  private sessions = new Map<string, UserSession>();

  constructor(
    private bot = Deps.get<Client>(Client)
  ) {}

  public get(key: string) {
    return this.sessions.get(key) ?? this.create(key);
  }

  public async updateGuildSessions(guildId: string) {
    const guildManagerIds = this.bot.guilds.cache
      .get(guildId).members.cache
      .filter(m => m.hasPermission('MANAGE_GUILD'))
      .map(m => m.id);
    
    for (const entry of this.sessions.entries()) {
      const userId = entry[1].authUser.id;
      if (guildManagerIds.includes(userId))
        await this.update(entry[0]);
    }
  }
  
  public async create(key: string) {
    const timeToClear = 5 * 60 * 1000;
    setTimeout(() => this.sessions.delete(key), timeToClear);
    await this.update(key);
  
    return this.sessions.get(key);
  }
  
  public async update(key: string) {
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
      .map(g => this.bot.guilds.cache.get(g.id))
      .filter(g => g);
  }
}

interface UserSession {
  authUser: User;
  guilds: Guild[];
}
