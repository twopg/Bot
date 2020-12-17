import fs from 'fs';
import { Message,  TextChannel } from 'discord.js';
import { Command, CommandContext } from '../../commands/command';
import Log from '../../utils/log';
import Deps from '../../utils/deps';
import Commands from '../../data/commands';
import { GuildDocument } from '../../data/models/guild';
import Cooldowns from './cooldowns';
import Validators from './validators';
import { promisify } from 'util';
import Emit from '../emit';

const readdir = promisify(fs.readdir);

export default class CommandService {
  private commands = new Map<string, Command>();

  constructor(
    private emit = Deps.get<Emit>(Emit),
    private validators = Deps.get<Validators>(Validators),
    private savedCommands = Deps.get<Commands>(Commands)
  ) {}

  public async init() {
    const files = await readdir('./src/commands');
    
    for (const fileName of files) {
      const cleanName = fileName.replace(/(\..*)/, '');
      
      const { default: Command } = await import(`../../commands/${cleanName}`);
      if (!Command) continue;
      
      const command = new Command();
      this.commands.set(command.name, command);
      
      await this.savedCommands.get(command);
    }
    Log.info(`Loaded: ${this.commands.size} commands`, `cmds`);
  }

  public async handle(msg: Message, savedGuild: GuildDocument) {
    try {
      const prefix = savedGuild.general.prefix;
      const slicedContent = msg.content.slice(prefix.length);

      const command = this.findCommand(slicedContent, savedGuild);
      const customCommand = this.getCustomCommand(slicedContent, savedGuild);
      if (!command && !customCommand) return;
      
      this.validators.checkChannel(msg.channel as TextChannel, savedGuild, customCommand);        
      this.validators.checkCommand(command, savedGuild, msg);
      this.validators.checkPreconditions(command, msg.member);

      const ctx = new CommandContext(msg, savedGuild);
      await command.execute(ctx, ...this.getCommandArgs(slicedContent, savedGuild));
      
      this.emit.commandExecuted(ctx);
      return command;
    } catch (error) {
      const content = error?.message ?? 'Un unknown error occurred.';      
      await msg.channel.send(`> :warning: ${content}`);
    }
  }

  private findCommand(slicedContent: string, savedGuild: GuildDocument) {
    const name = this.getCommandName(slicedContent);
    return this.commands.get(name)
      ?? this.findByAlias(name)
      ?? this.findCustomCommand(name, savedGuild);
  }
  private findByAlias(name: string) {   
    return Array
      .from(this.commands.values())
      .find(c => c.aliases?.some(a => a === name));
  }
  private findCustomCommand(customName: string, { commands }: GuildDocument) {
    const ccName = this
      .getCommandName(commands.custom
      ?.find(c => c.alias === customName)?.command);
    return this.commands.get(ccName);
  }

  private getCommandArgs(slicedContent: string, savedGuild: GuildDocument) {
    const customCommand = this
      .getCustomCommand(slicedContent, savedGuild)?.command;
    return (customCommand ?? slicedContent)
      .split(' ')
      .slice(1);
  }
  private getCustomCommand(slicedContent: string, savedGuild: GuildDocument) {
    const name = this.getCommandName(slicedContent);
    return savedGuild.commands.custom
      ?.find(c => c.alias === name);    
  }
  private getCommandName(slicedContent: string) {
    return slicedContent
      ?.toLowerCase()
      .split(' ')[0];
  }
}
