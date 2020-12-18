import { ShardingManager } from 'discord.js';

export const manager = new ShardingManager('./src/bot.ts', {
  token: process.env.BOT_TOKEN
});
