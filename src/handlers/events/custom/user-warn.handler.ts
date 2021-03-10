import AnnounceHandler from '../announce-handler';
import { AutoPunishment, EventType, GuildDocument } from '../../../data/models/guild';
import EventVariables from '../../../modules/announce/event-variables';
import { PunishmentEventArgs } from '../../emit';
import { MemberDocument } from '../../../data/models/member';

export default class extends AnnounceHandler {
  on = 'userWarn';
  event = EventType.Warn;

  public async invoke(args: PunishmentEventArgs, savedMember: MemberDocument) {
    const savedGuild = await this.guilds.get(args.guild);
    await this.autoPunish(args, savedGuild, savedMember);

    await super.announce(args.guild, [ args ], savedGuild);
  }
  
  private getMinutesSince(date: Date) {
    const ms = new Date().getTime() - date.getTime();
    return ms / 1000 / 60;
  }

  private async autoPunish(args: PunishmentEventArgs, savedGuild: GuildDocument, savedMember: MemberDocument) {
    const punishments = savedGuild.autoMod.punishments
      ?.sort((a, b) => (a.warnings < b.warnings) ? 1 : -1);
    for (const punishment of punishments) {
      if (!this.shouldPunish(savedMember, punishment)) continue;

      const member = args.guild.members.cache.get(args.user.id);         
      try {                
        if (punishment.type === 'KICK')
          return member.kick(`Auto-punish - ${args.warnings} warnings`);
        else if (punishment.type === 'BAN')
          return member.ban({ reason: `Auto-punish - ${args.warnings} warnings` });
      } catch (error) {}
    }
  }

  private shouldPunish(savedMember: MemberDocument, punishment: AutoPunishment) {    
    return (savedMember.warnings.length >= punishment.warnings)
      && savedMember.warnings
        .slice(-punishment.warnings)
        .every(p => this.getMinutesSince(p.at) <= punishment.minutes);
  }

  protected async applyEventVariables(content: string, args: PunishmentEventArgs) {
    return new EventVariables(content)
      .guild(args.guild)
      .instigator(args.instigator)
      .memberCount(args.guild)
      .reason(args.reason)
      .user(args.user)
      .warnings(args.warnings)
      .toString();
  }
}
