import { model, Schema, Document } from 'mongoose';

export class Module {
  enabled = true;
}

export class LogsModule extends Module {
  events: LogEvent[] = [];
}

export enum EventType {
  Ban = 'BAN', 
  CommandExecuted = 'COMMAND_EXECUTED',
  ConfigUpdate = 'CONFIG_UPDATE',
  LevelUp = 'LEVEL_UP',
  MessageDeleted = 'MESSAGE_DELETED',
  MemberJoin = 'MEMBER_JOIN',
  MemberLeave = 'MEMBER_LEAVE',
  Unban = 'UNBAN',
  Warn ='WARN'
}

export interface LogEvent {
  channel: string;
  enabled: boolean;
  event: EventType;
  message: string;
}

export class AutoModModule extends Module {
  ignoredRoles: string[] = [];
  autoDeleteMessages = true;
  filters: MessageFilter[] = [];
  banWords: string[] = [];
  banLinks: string[] = [];
  autoWarnUsers = true;
  filterThreshold = 5;
}

export class CommandsModule extends Module {
  configs: CommandConfig[] = [];
  custom: CustomCommand[] = [];
}

export enum MessageFilter {
  Links = 'LINKS',
  MassCaps = 'MASS_CAPS',
  MassMention = 'MASS_MENTION',
  Words = 'WORDS',
  Toxicity = 'TOXICITY'
}

export class GeneralModule extends Module {
  prefix = '.';
  ignoredChannels: string[] = [];
  autoRoles: string[] = [];
}

export class LevelingModule extends Module {
  levelRoles: LevelRole[] = [];
  ignoredRoles: string[] = [];
  xpPerMessage = 50;
  maxMessagesPerMinute = 3;
}

export interface LevelRole {
  level: number;
  role: string;
}

export class MusicModule extends Module {}

export interface CommandConfig {
  name: string;
  enabled: boolean;
}
export interface CustomCommand {
  alias: string;
  anywhere: boolean;
  command: string;
}

export class ReactionRolesModule extends Module {
  configs: ReactionRole[] = [];
}
export interface ReactionRole {
  channel: string,
  messageId: string,
  emote: string,
  role: string
}

export class DashboardSettings {
  privateLeaderboard = false;
}

const guildSchema = new Schema({
  _id: String,
  autoMod: { type: Object, default: new AutoModModule() }, 
  commands: { type: Object, default: new CommandsModule() },
  general: { type: Object, default: new GeneralModule() },
  leveling: { type: Object, default: new LevelingModule() },
  logs: { type: Object, default: new LogsModule() }, 
  music: { type: Object, default: new MusicModule },
  reactionRoles: { type: Object, default: new ReactionRolesModule() },
  settings: { type: Object, default: new DashboardSettings() }
});

export interface GuildDocument extends Document {
  _id: string;
  autoMod: AutoModModule;
  commands: CommandsModule;
  general: GeneralModule;
  music: MusicModule;
  leveling: LevelingModule;
  logs: LogsModule;
  reactionRoles: ReactionRolesModule;
  settings: DashboardSettings;
}

export const SavedGuild = model<GuildDocument>('guild', guildSchema);
