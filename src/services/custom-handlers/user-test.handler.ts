import AnnounceHandler from '../handlers/announce-handler';
import { EventType } from '../../data/models/guild';
import { GuildMember } from 'discord.js';
import EventVariables from '../../modules/announce/event-variables';

export default class UserTestHandler extends AnnounceHandler {
  on = 'userTest';
  event = EventType.Test;

  invoke(member: GuildMember): void | Promise<any> {
    return super.announce(member.guild, [ member ]);
  }

  protected applyEventVariables(content: string, member: GuildMember): string | Promise<string> {
    return new EventVariables(content)
      .user(member.user)
      .toString();
  }
}