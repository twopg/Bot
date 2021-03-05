import Event from './event-handler';
import { Guild, TextChannel } from 'discord.js';
import Deps from '../../utils/deps';
import Guilds from '../../data/guilds';
import { SessionManager } from '../../api/modules/performance/session-manager';

export default class GuildCreateHandler implements Event {
  on = 'guildCreate';

  constructor(
    private guilds = Deps.get<Guilds>(Guilds),
  ) {}

  async invoke(guild: Guild): Promise<any> {
    await this.guilds.get(guild);

    await this.sendWelcomeMessage(guild.systemChannel);
  }

  private async sendWelcomeMessage(channel: TextChannel | null) {
    const url = `${process.env.DASHBOARD_URL}/servers/${channel?.guild.id}`;
    await channel?.send(`Hey, I'm 2PG! Customize me at ${url}`);
  }  
}