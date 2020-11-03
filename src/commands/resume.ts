import { Command, CommandContext, Permission } from './command';
import Deps from '../utils/deps';
import Music from '../modules/music/music';

export default class ResumeCommand implements Command {
    name = 'resume';
    summary = 'Resume playing a track if paused.';
    precondition: Permission = 'SPEAK';
    module = 'Music';

    constructor(private music = Deps.get<Music>(Music)) {}
    
    execute = (ctx: CommandContext) => {
        const player = this.music.joinAndGetPlayer(ctx.member.voice.channel, ctx.channel);

        if (player.isPlaying)
            throw new TypeError('Player is already resumed.');
            
        player.pause();
        ctx.channel.send(`**Resumed**: \`${player.q[0].title}\``);
    }
}
