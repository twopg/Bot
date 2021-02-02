import AnnounceHandler from '../../handlers/announce-handler';
import { EventType } from '../../../data/models/guild';
import EventVariables from '../../../modules/announce/event-variables';
import { PunishmentEventArgs } from '../../emit';

export default class UserWarnHandler extends AnnounceHandler {
    on = 'userWarn';
    event = EventType.Warn;

    async invoke(args: PunishmentEventArgs) {  
        await super.announce(args.guild, [ args ]);
    }
    
    protected async applyEventVariables(content: string, args: PunishmentEventArgs) {
        return new EventVariables(content)
            .guild(args.guild)
            .instigator(args.instigator)
            .memberCount(args.guild)
            .reason(args.reason)
            .user(args.user)
            .warnings(args.warnings)
            .toString();
    }
}
