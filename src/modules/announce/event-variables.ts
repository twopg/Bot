import { User, Guild, Message } from 'discord.js';

export default class EventVariables {
  constructor(private content: string) {}

  toString() { return this.content; }
  
  private replace(regex: RegExp, replacement: string) {
    this.content = this.content.replace(regex, replacement);
    return this;
  }

  guild(guild: Guild) {
    return this.replace(/\[GUILD\]/g, guild.name);
  }

  instigator({ id }) {
    return this.replace(/\[INSTIGATOR\]/g, `<@!${id}>`);
  }

  module(name: string) {
    return this.replace(/\[MODULE\]/g, name);
  }

  name(name: string) {
    return this.replace(/\[NAME\]/g, name);
  }

  memberCount(guild: Guild) {
    return this.replace(/\[MEMBER_COUNT\]/g, guild.memberCount.toString());
  }

  message(msg: Message) {
    return this.replace(/\[MESSAGE\]/g, msg.content);
  }

  oldValue(value: any) {
    return this.replace(/\[OLD_VALUE\]/g, JSON.stringify(value, null, 2));
  }

  oldLevel(level: number) {
    return this.replace(/\[OLD_LEVEL\]/g, level.toString());
  }

  newValue(value: any) {    
    return this.replace(/\[NEW_VALUE\]/g, JSON.stringify(value, null, 2));
  }

  newLevel(level: number) {
    return this.replace(/\[NEW_LEVEL\]/g, level.toString());
  }

  reason(reason: string) {
    return this.replace(/\[REASON\]/g, reason);
  }

  user(user: User) {
    return this.replace(/\[USER\]/g, `<@!${user.id}>`);
  }

  warnings(warnings: number) {
    return this.replace(/\[WARNINGS\]/g, warnings.toString());
  }
  
  xp(xp: number) {
    return this.replace(/\[XP\]/g, xp.toString());
  }
}