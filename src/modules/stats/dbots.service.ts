import { PostStats } from '@dbots/stats';

import { bot } from '../../bot';
import Log from '../../utils/log';

export class DBotsService {
  private dbots: PostStats;

  constructor() {
    if (!process.env.DBOTS_AUTH) return;

    this.dbots = new PostStats({
      apiToken: process.env.DBOTS_AUTH,
      botToken: bot.token
    });

    this.dbots.on('postStats', () => Log.info('Posted stats to DBots', 'dbots')); 
  }
}
