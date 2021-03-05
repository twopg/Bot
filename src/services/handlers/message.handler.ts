import EventHandler from './event-handler';
import Deps from '../../utils/deps';
import CommandService from '../commands/command.service';
import Guilds from '../../data/guilds';
import AutoMod from '../../modules/auto-mod/auto-mod';
import Leveling from '../../modules/xp/leveling';
import { Message } from 'discord.js';
import Logs from '../../data/logs';

export default class MessageHandler implements EventHandler {
  on = 'message';

  constructor(
    private autoMod = Deps.get<AutoMod>(AutoMod),
    private commands = Deps.get<CommandService>(CommandService),
    private guilds = Deps.get<Guilds>(Guilds),
    private leveling = Deps.get<Leveling>(Leveling),
    private logs = Deps.get<Logs>(Logs)) {}

  async invoke(msg: Message) {
    if (!msg.member || msg.author.bot) return;

    const savedGuild = await this.guilds.get(msg.guild);

    const isCommand = msg.content.startsWith(savedGuild.general.prefix);
    if (isCommand) {
      const command = await this.commands.handle(msg, savedGuild);
      if (!command) return;
      
      return await this.logs.logCommand(msg, command);
    } 

    if (savedGuild.autoMod.enabled) {
      try {
        await this.autoMod.validate(msg, savedGuild);
      } catch (validation) {
        await msg.channel.send(`> ${validation.message}`);
      }
    }
    if (savedGuild.leveling.enabled)
      try {
        await this.leveling.validateXPMsg(msg, savedGuild);
      } catch {}
  }
}
