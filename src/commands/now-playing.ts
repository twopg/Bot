import Music from '../modules/music/music';
import Deps from '../utils/deps';
import { Command, CommandContext, Permission } from './command';
import { Spotify } from 'canvacord';

export default class implements Command {
  name = 'now-playing';
  summary = 'Show the track that is currently playing.';
  precondition: Permission = '';
  cooldown = 3;
  module = 'Music';

  constructor(private music = Deps.get<Music>(Music)) {}
  
  async execute(ctx: CommandContext) {
    const player = this.music.joinAndGetPlayer(ctx.member.voice.channel, ctx.channel);
    if (!player.isPlaying)
      throw new TypeError('No track is currently playing');

    const track = player.q.peek();
    const card = new Spotify()
      .setAuthor(track.author.name)
      .setAlbum('YouTube')
      .setStartTimestamp(player.position)
      .setEndTimestamp(track.seconds)
      .setImage(track.thumbnail)
      .setTitle(track.title)
      .build();

    await ctx.channel.send(
      { files: [{ attachment: card, name: 'now-playing.png' }]
    });
  }
}
