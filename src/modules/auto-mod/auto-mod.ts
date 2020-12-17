import { Message, GuildMember, User } from 'discord.js';
import { GuildDocument, MessageFilter } from '../../data/models/guild';
import Deps from '../../utils/deps';
import Members from '../../data/members';
import Log from '../../utils/log';
import { ContentValidator } from './validators/content-validator';
import { promisify } from 'util';
import fs from 'fs';
import { MemberDocument } from '../../data/models/member';
import Emit from '../../services/emit';

const readdir = promisify(fs.readdir);

export default class AutoMod {
  private validators: ContentValidator[] = [];

  constructor(
    private emit = Deps.get<Emit>(Emit),
    private members = Deps.get<Members>(Members)) {}

  public async init() { 
    const files = await readdir(`${__dirname}/validators`);

    for (const file of files) {
      const Validator = require(`./validators/${file}`).default;
      if (!Validator) continue;

      this.validators.push(new Validator());
    }
    Log.info(`Loaded: ${this.validators.length} validators`, `automod`);
  }
  
  public async validate(msg: Message, guild: GuildDocument) {
    const activeFilters = guild.autoMod.filters;
    for (const filter of activeFilters)
      try {        
        const validator = this.validators.find(v => v.filter === filter);
        await validator?.validate(this, msg.content, guild);
      } catch (validation) {
        if (guild.autoMod.autoDeleteMessages)
          await msg.delete({ reason: validation.message });
        if (guild.autoMod.autoWarnUsers && msg.member)
          await this.warn(msg.member, {
            instigator: msg.client.user,
            reason: validation.message
          });
        throw validation;
      }
  }

  public async warn(target: GuildMember, args: PunishmentArgs) {
    this.validateAction(target, args.instigator);

    const savedMember = await this.members.get(target);
    
    this.emit.warning(args, target, savedMember);
    await this.saveWarning(args, savedMember);
  }
  private async saveWarning(args: PunishmentArgs, savedMember: MemberDocument) {
    savedMember.warnings.push({
      at: new Date(),
      instigatorId: args.instigator.id,
      reason: args.reason
    });
    return this.members.save(savedMember);    
  }

  public validateAction(target: GuildMember, instigator: User) {
    if (target.id === instigator.id)
      throw new TypeError('You cannot punish yourself.');

    const instigatorMember = target.guild.members.cache
      .get(instigator.id);    
    if (instigatorMember.roles.highest.position <= target.roles.highest.position)
      throw new TypeError('User has the same or higher role.');
  }
}

export interface PunishmentArgs {
  instigator: User;
  reason: string;
}
export class ValidationError extends Error {
  constructor(message: string, public filter: MessageFilter) {
    super(message);
  }
}
