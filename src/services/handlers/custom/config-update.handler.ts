import AnnounceHandler from '../../handlers/announce-handler';
import { EventType } from '../../../data/models/guild';
import EventVariables from '../../../modules/announce/event-variables';
import { ConfigUpdateArgs } from '../../emit';

export default class ConfigUpdateHandler extends AnnounceHandler {
    on = 'configUpdate';
    event = EventType.ConfigUpdate;

    async invoke(args: ConfigUpdateArgs) {
        await super.announce(args.guild, [ args ]);
    }
    
    protected async applyEventVariables(content: string, args: ConfigUpdateArgs) {
        return new EventVariables(content)
            .guild(args.guild)
            .instigator(args.instigator)
            .memberCount(args.guild)
            .module(args.module)
            .newValue(args.new)
            .oldValue(args.old)
            .toString();
    }
}
