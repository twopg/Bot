import Deps from '../../utils/deps';
import { SessionManager } from './performance/session-manager';
import { APIError, sendError } from './api-utils';

const sessions = Deps.get<SessionManager>(SessionManager);

export async function validateBotOwner(req, res, next) {
  const key = req.query.key;
  if (!key)
    return sendError(res, new APIError(400));

  const session = await sessions.get(key);
  if (session.authUser.id !== process.env.OWNER_ID)
    return sendError(res, new APIError(401));
  return next();
}

export async function validateGuildManager(req, res, next) {
  const guildId = req.params.id;
  const key = req.query.key;
  if (!key)
    return sendError(res, new APIError(400));

  const session = await sessions.get(key);
  if (!session.guilds.some(g => g.id === guildId))
    return sendError(res, new APIError(403));
  return next();
}