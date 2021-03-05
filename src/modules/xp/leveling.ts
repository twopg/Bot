import { Message, GuildMember } from 'discord.js';
import { GuildDocument } from '../../data/models/guild';
import Members from '../../data/members';
import Deps from '../../utils/deps';
import { MemberDocument } from '../../data/models/member';
import Emit from '../../services/emit';

export default class Leveling {
  constructor(
    private emit = Deps.get<Emit>(Emit),
    private members = Deps.get<Members>(Members)
  ) {}

  async validateXPMsg(msg: Message, savedGuild: GuildDocument) {
    if (!msg?.member || !savedGuild 
      || this.hasIgnoredXPRole(msg.member, savedGuild))
      throw new TypeError('User cannot earn XP');

    const savedMember = await this.members.get(msg.member);

    this.handleCooldown(savedMember, savedGuild);

    const oldLevel = this.getLevel(savedMember.xp);
    savedMember.xp += savedGuild.leveling.xpPerMessage;
    const newLevel = this.getLevel(savedMember.xp);

    if (newLevel > oldLevel) {
      this.emit.levelUp({ newLevel, oldLevel }, msg, savedMember);
      this.checkLevelRoles(msg, newLevel, savedGuild);
    }
    await savedMember.save();
  }
  
  private handleCooldown(savedMember: MemberDocument, savedGuild: GuildDocument) {
    const inCooldown = savedMember.recentMessages
      .filter(m => m.getMinutes() === new Date().getMinutes())
      .length > savedGuild.leveling.maxMessagesPerMinute;
    if (inCooldown)
      throw new TypeError('User is in cooldown');

    const lastMessage = savedMember.recentMessages[savedMember.recentMessages.length - 1];
    if (lastMessage && lastMessage.getMinutes() !== new Date().getMinutes())
      savedMember.recentMessages = [];

    savedMember.recentMessages.push(new Date());
  }

  private hasIgnoredXPRole(member: GuildMember, guild: GuildDocument) {
    for (const entry of member.roles.cache) { 
      const role = entry[1];
      if (guild.leveling.ignoredRoles.some(id => id === role.id))
        return true;
    }
    return false;
  }

  private checkLevelRoles(msg: Message, newLevel: number, guild: GuildDocument) {
    const levelRole = this.getLevelRole(newLevel, guild);
    if (levelRole)
      msg.member?.roles.add(levelRole);
  }
  private getLevelRole(level: number, guild: GuildDocument) {
    return guild.leveling.levelRoles.find(r => r.level === level)?.role;
  }

  getLevel(xp: number) {
    const preciseLevel = (-75 + Math.sqrt(Math.pow(75, 2) - 300 * (-150 - xp))) / 150;      
    return Math.floor(preciseLevel);
  }
  static xpInfo(xp: number) {
    const preciseLevel = (-75 + Math.sqrt(Math.pow(75, 2) - 300 * (-150 - xp))) / 150;
    const level = Math.floor(preciseLevel);

    const xpForNextLevel = this.xpForNextLevel(level, xp);
    const nextLevelXP = xp + xpForNextLevel;    
     
    const levelCompletion = preciseLevel - level;

    return { level, xp, xpForNextLevel, levelCompletion, nextLevelXP };
  }
  private static xpForNextLevel(currentLevel: number, xp: number) {
    return ((75 * Math.pow(currentLevel + 1, 2)) + (75 * (currentLevel + 1)) - 150) - xp;
  }

  static getRank(member: MemberDocument, members: MemberDocument[]) {
    return members
      .sort((a, b) => b.xp - a.xp)
      .findIndex(m => m.id === member.id) + 1;
  }
}