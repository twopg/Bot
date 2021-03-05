import { Client, TextChannel } from 'discord.js';
import { Router } from 'express';
import Users from '../../data/users';
import CommandService from '../../handlers/commands/command.service';
import Deps from '../../utils/deps';
import { sendError, APIError } from '../modules/api-utils';
import { ErrorLogger } from '../modules/logging/error-logger';
import { WebhookLogger } from '../modules/logging/webhook-logger';
import Stats from '../modules/stats';
import { auth } from '../modules/auth-client';
import { validateBotOwner } from '../modules/middleware';

export const router = Router();

const bot = Deps.get<Client>(Client);
const stats = Deps.get<Stats>(Stats);
const users = Deps.get<Users>(Users);
const errorLogger = Deps.get<ErrorLogger>(ErrorLogger);
const webhookLogger = Deps.get<WebhookLogger>(WebhookLogger);
const commandService = Deps.get<CommandService>(CommandService);

router.get('/', (req, res) => res.json({ hello: 'earth' }));

router.get('/commands', async (req, res) => res.json(
  Array.from(commandService.commands.values())
));
router.post('/error', async(req, res) => {
  try {
    await errorLogger.dashboard(req.body.message);

    res.json({ message: 'Success' });
  } catch (error) { sendError(res, new APIError(400)); }
});

router.post('/feedback', async(req, res) => {
  try {
    await webhookLogger.feedback(req.body.message);

    res.json({ message: 'Success' });
  } catch (error) {
    sendError(res, new APIError(400)); }
});

router.get('/stats', validateBotOwner, async (req, res) => {
  try {  
    res.json({
      general: stats.general,
      commands: stats.commands,
      inputs: stats.inputs,
      modules: stats.modules
    });
  } catch (error) { sendError(res, new APIError(400)); }
});

router.post('/vote/top-gg', async (req, res) => {
  try {
    if (req.get('authorization') !== process.env.TOP_GG_AUTH)
      return res.status(400);

    const channel = bot.channels.cache.get(process.env.VOTE_CHANNEL_ID) as TextChannel;
    if (!channel)
      return res.status(400);

    const userId = req.body.user;
    const savedUser = await users.get({ id: userId });
    savedUser.votes ??= 0;
    savedUser.votes++;
    await savedUser.updateOne(savedUser);
    
    await webhookLogger.vote(userId, savedUser.votes);
  } catch (error) { sendError(res, new APIError(400)); }
});
