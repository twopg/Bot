import { Router } from 'express';
import { SavedMember } from '../../data/models/member';
import { XPCardGenerator } from '../modules/image/xp-card-generator';
import Deps from '../../utils/deps';
import Members from '../../data/members';
import Users from '../../data/users';
import Guilds from '../../data/guilds';
import Logs from '../../data/logs';
import AuditLogger from '../modules/audit-logger';
import { Client, TextChannel } from 'discord.js';
import Leveling from '../../modules/xp/leveling';
import Emit from '../../handlers/emit';
import { APIError, leaderboardMember, sendError } from '../modules/api-utils';
import { SessionManager } from '../modules/performance/session-manager';
import { validateGuildManager } from '../modules/middleware';

export const router = Router();

const bot = Deps.get<Client>(Client);
const emit = Deps.get<Emit>(Emit);
const generator = Deps.get<XPCardGenerator>(XPCardGenerator);
const guilds = Deps.get<Guilds>(Guilds);
const logs = Deps.get<Logs>(Logs);
const members = Deps.get<Members>(Members);
const sessions = Deps.get<SessionManager>(SessionManager);
const users = Deps.get<Users>(Users);

router.get('/', async (req, res) => {
  try {
    const key = req.query.key.toString();
    if (req.query.force === 'true') 
      await sessions.update(key);

    const { guilds } = await sessions.get(key);
    res.json(guilds);
  } catch (error) { sendError(res, new APIError(400)); }
});

router.put('/:id/:module', validateGuildManager, async (req, res) => {
  try {
    const { id, module } = req.params;

    const { authUser } = await sessions.get(req.query.key.toString());
    const guild = bot.guilds.cache.get(id); 
    const savedGuild = await guilds.get(guild);
    
    const change = AuditLogger.getChanges({
      old: savedGuild[module],
      new: req.body
    }, module, authUser.id);

    savedGuild[module] = req.body;
    await savedGuild.save();
     
    const log = await logs.get(guild);
    log.changes.push(change);
    await log.save();
    
    emit.configSaved(guild, authUser, change);
      
    res.json(savedGuild);
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/:id/config', async (req, res) => {
  try {
    const guild = bot.guilds.cache.get(req.params.id);
    const savedGuild = await guilds.get(guild);
    res.json(savedGuild);
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/:id/channels', async (req, res) => {
  try {
    const guild = bot.guilds.cache.get(req.params.id);
    res.send(guild.channels.cache);    
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/:id/log', async(req, res) => {
  try {
    const guild = bot.guilds.cache.get(req.params.id);
    const log = await logs.get(guild);
    res.send(log);
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/:id/commands', async (req, res) => {
  try {
    const savedGuild = await guilds.get({ id: req.params.id });
    res.json({
      guild: bot.guilds.cache.get(req.params.id),
      commands: savedGuild.commands.custom
    });
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/:id/public', (req, res) => {
  const guild = bot.guilds.cache.get(req.params.id);
  res.json(guild);
});

router.get('/:id/roles', async (req, res) => {
  try {
    const guild = bot.guilds.cache.get(req.params.id);
    res.send(guild.roles.cache.filter(r => r.name !== '@everyone'));
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/:id/members', async (req, res) => {
  try {
    const savedMembers = await SavedMember.find({ guildId: req.params.id }).lean();    
    let rankedMembers = [];
    for (const member of savedMembers) {
      const user = bot.users.cache.get(member.userId);
      if (!user) continue;
      
      const xpInfo = Leveling.xpInfo(member.xp);
      rankedMembers.push(leaderboardMember(user, xpInfo));
    }
    rankedMembers.sort((a, b) => b.xp - a.xp);
  
    res.json(rankedMembers);
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/:id/members', async (req, res) => {
  try {
    const savedMembers = await SavedMember.find({ guildId: req.params.id }).lean();    
    let rankedMembers = [];
    for (const member of savedMembers) {
      const user = bot.users.cache.get(member.userId);
      if (!user) continue;
      
      const xpInfo = Leveling.xpInfo(member.xp);
      rankedMembers.push(leaderboardMember(user, xpInfo));
    }
    rankedMembers.sort((a, b) => b.xp - a.xp);
  
    res.json(rankedMembers);
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/:guildId/members/:memberId/xp-card', async (req, res) => {
  try {
    const { guildId, memberId } = req.params;    

    const guild = bot.guilds.cache.get(guildId);
    const member = guild?.members.cache.get(memberId);    
    if (!member)
      throw TypeError('Could not find member in cache.');
    
    const savedUser = await users.get(member);
    const savedMembers = await SavedMember.find({ guildId });
    const savedMember = savedMembers.find(m => m.userId === savedUser.id)
    const rank = members.getRanked(member, savedMembers);
    
    const image = await generator.generate(savedUser, savedMember, rank);
    
    res.set({'Content-Type': 'image/png'}).send(image);
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/:id/bot-status', async (req, res) => {
  try {
    const id = req.params.id;
    const botMember = bot.guilds.cache
      .get(id)?.members.cache
      .get(bot.user.id);
    
    const requiredPermission = 'ADMINISTRATOR';
    res.json({ hasAdmin: botMember.hasPermission(requiredPermission) });
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/:id/channels/:channelId/messages/:messageId', async(req, res) => {
  try {
    const guild = bot.guilds.cache.get(req.params.id);
    const channel = guild?.channels.cache
      .get(req.params.channelId) as TextChannel;   

    const msg = await channel.messages.fetch(req.params.messageId);

    res.json({
      ...msg,
      member: guild.members.cache.get(msg.author.id),
      user: bot.users.cache.get(msg.author.id)
    });
  } catch (error) { sendError(res, new APIError(400)); }
});
