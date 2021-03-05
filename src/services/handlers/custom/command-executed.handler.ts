import AnnounceHandler from '../../handlers/announce-handler';
import { EventType } from '../../../data/models/guild';
import EventVariables from '../../../modules/announce/event-variables';
import { ConfigUpdateArgs } from '../../emit';
import { CommandContext } from '../../../commands/command';

export default class extends AnnounceHandler {
  on = 'commandExecuted';
  event = EventType.CommandExecuted;

  async invoke(args: ConfigUpdateArgs) {
    await super.announce(args.guild, [ args ]);
  }
  
  protected async applyEventVariables(content: string, args: CommandContext) {
    return new EventVariables(content)
      .guild(args.guild)
      .instigator(args.member)
      .memberCount(args.guild)
      .name(args.command.name)
      .toString();
  }
}
