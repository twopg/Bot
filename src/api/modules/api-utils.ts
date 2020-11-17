import { bot } from '../../bot';
import { auth } from '../server';
import { User } from 'discord.js';
import config from '../../../config.json';

export async function getUser(key: any) {
  if (!key) return null;

  return await auth.getUser(key);
}

export async function validateBotOwner(key: any) {
  if (!key)
    throw new TypeError('No key provided.');
  const { id } = await getUser(key);
      
  if (id !== config.bot.ownerId)
    throw TypeError('Unauthorized.');
}

export async function validateGuildManager(key: any, guildId: string) {
  if (!key)
    throw new TypeError('No key provided.');

  const guilds = await getManagableGuilds(key);  
  if (!guilds.some(g => g.id === guildId))
    throw TypeError('Guild not manageable.');
}

export async function getManagableGuilds(key: any) {
  return (await auth.getGuilds(key))
    .array()
    .filter(g => g.permissions.includes('MANAGE_GUILD'))
    .map(g => bot.guilds.cache.get(g.id))
    .filter(g => g);
}

export function leaderboardMember(user: User, xpInfo: any) {
  return {
    id: user.id,
    username: user.username,
    tag: '#' + user.discriminator,
    displayAvatarURL: user.displayAvatarURL({ dynamic: true }),
    ...xpInfo
  };
}

export function sendError(res: any, code: number, error: Error) {
  return res.status(code).json({ code, message: error?.message })
}
