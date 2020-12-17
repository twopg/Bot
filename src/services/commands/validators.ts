import { Command } from '../../commands/command';
import { GuildMember, TextChannel, Message } from 'discord.js';
import { GuildDocument, CustomCommand } from '../../data/models/guild';
import Cooldowns from './cooldowns';
import Deps from '../../utils/deps';

export default class Validators {
  constructor(private cooldowns = Deps.get<Cooldowns>(Cooldowns)) {}

  checkCommand(command: Command, guild: GuildDocument, msg: Message) {
    const config = guild.commands.configs.find(c => c.name === command.name);
    if (!config) return;

    if (!config.enabled)
      throw new TypeError('Command not enabled!');
      
    const cooldown = this.cooldowns.get(msg.author, command);
    if (cooldown)
      throw new TypeError(`Command is in cooldown for another \`${cooldown}s\`.`);
  }

  checkPreconditions(command: Command, executor: GuildMember) {
    if (command.precondition && !executor.hasPermission(command.precondition))
      throw new TypeError(`**Required Permission**: \`${command.precondition}\``);
  }

  checkChannel(channel: TextChannel, savedGuild: GuildDocument, customCommand?: CustomCommand) {
    const isIgnored = savedGuild.general.ignoredChannels
      .some(id => id === channel.id);

    if (isIgnored && !customCommand)
      throw new TypeError('Commands cannot be executed in this channel.');
    else if (isIgnored && !customCommand.anywhere)
      throw new TypeError('This custom command cannot be executed in this channel.');
  }
}