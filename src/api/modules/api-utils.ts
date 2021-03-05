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
  if (session.authUser.id !== process.env.OWNER_ID)
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

export class APIError extends Error {
  private static readonly messages = new Map<number, string>([
    [400, 'Bad request'],
    [401, 'Unauthorized'],
    [403, 'Forbidden'],
    [404, 'Not found'],
    [429, 'You are being rate limited'],
    [500, 'Internal server error'],
  ])

  constructor(public readonly status = 400) {
    super(APIError.messages.get(status));
  }
}

export interface BotStats {
  guildCount: number;
}

export interface DefaultAPIResponse {
  message: string;
  code?: number;
}

export enum HexColor {
  Blue = '#4287f5',
  Green = '#42f54e',
  Red = '#f54242'
}
