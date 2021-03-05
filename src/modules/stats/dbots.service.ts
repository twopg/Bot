import { PostStats } from '@dbots/stats';

import Log from '../../utils/log';

export class DBotsService {
  private dbots: PostStats;

  constructor() {
    if (!process.env.DBOTS_AUTH) return;

    this.dbots = new PostStats({
      apiToken: process.env.DBOTS_AUTH,
      botToken: process.env.BOT_TOKEN
    });

    this.dbots.on('postStats', () => Log.info('Posted stats to DBots', 'dbots')); 
  }
}
