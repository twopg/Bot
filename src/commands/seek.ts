import { Command, CommandContext, Permission } from './command';
import Deps from '../utils/deps';
import Music from '../modules/music/music';

export default class SeekCommand implements Command {
  precondition: Permission = 'SPEAK';
  name = 'seek';
  usage = 'seek [position]';
  summary = 'View current track position, or go to a position in a track.';
  cooldown = 1;
  module = 'Music';

  constructor(private music = Deps.get<Music>(Music)) {}
  
  execute = async(ctx: CommandContext, position: string) => {
    const player = this.music.joinAndGetPlayer(ctx.member.voice.channel, ctx.channel);
    if (player.q.length <= 0)
      throw new TypeError('No tracks currently playing');

    const pos = +position;    
    if (!pos)
      return ctx.channel.send(`> Track at: \`${this.music.getDuration(player)}\``);

    await player.seek(pos);

    return ctx.channel.send(`> Player at \`${pos}s\`.`);
  }
}
