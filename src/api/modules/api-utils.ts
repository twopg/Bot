import { User } from 'discord.js';

import { SessionManager } from './performance/session-manager'
import Deps from '../../utils/deps';

const sessions = Deps.get<SessionManager>(SessionManager);

export async function getUser(key: any) {
  if (!key) return null;

  const session = await sessions.get(key);
  return session.authUser;
}

export async function validateBotOwner(key: any) {
  if (!key)
    throw new TypeError('No key provided.');

  const session = await sessions.get(key);
  if (session.authUser.id !==  process.env.OWNER_ID)
    throw TypeError('Unauthorized.');
}

export async function validateGuildManager(key: any, guildId: string) {
  if (!key)
    throw new TypeError('No key provided.');

  const session = await sessions.get(key);
  if (!session.guilds.some(g => g.id === guildId))
    throw TypeError('Guild not manageable.');
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

export function sendError(res: any, status: number, error: Error) {
  return res.status(status).json({ message: error?.message })
}

export class APIError extends TypeError {
  constructor(
    message: string,
    public code: number) {
    super(message);
  }
}
