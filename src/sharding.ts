import { ShardingManager } from 'discord.js';

export const manager = new ShardingManager('./bot.ts', {
  token: process.env.BOT_TOKEN
});
