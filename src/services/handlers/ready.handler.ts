import Log from '../../utils/log';
import EventHandler from './event-handler';
import Deps from '../../utils/deps';
import { bot } from '../../bot';
import CommandService from '../commands/command.service';

import AutoMod from '../../modules/auto-mod/auto-mod';
import ReactionRoles from '../../modules/general/reaction-roles';

export default class ReadyHandler implements EventHandler {
  started = false;
  on = 'ready';
  
  constructor(
    private autoMod = Deps.get<AutoMod>(AutoMod),
    private commandService = Deps.get<CommandService>(CommandService),
    private reactionRoles = Deps.get<ReactionRoles>(ReactionRoles)) {}

  async invoke() {
    Log.info(`Bot is live!`, `events`);

    if (this.started) return;
    this.started = true;
    
    await this.autoMod.init();
    await this.commandService.init();
    await this.reactionRoles.init();

    await bot.user?.setActivity('2PG.xyz');
  }
}
