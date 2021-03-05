import { validateEnv } from './utils/validate-env';
validateEnv();

import Log from './utils/log';
import { Client } from 'discord.js';
import mongoose from 'mongoose';
import Deps from './utils/deps';
import { EventEmitter } from 'events';
import { EventHandler } from './handlers/event-handler';
import { DBotsService } from './modules/stats/dbots.service';

Log.twoPG();

const bot = Deps.add(Client, new Client({
  partials: ['GUILD_MEMBER', 'REACTION', 'MESSAGE', 'USER'],
  retryLimit: Infinity
}));

export const emitter = new EventEmitter();

bot.login(process.env.BOT_TOKEN);

Deps.get<EventHandler>(EventHandler).init();
Deps.add(DBotsService, new DBotsService());

mongoose.connect(process.env.MONGO_URI, { 
  useUnifiedTopology: true, 
  useNewUrlParser: true, 
  useFindAndModify: false 
}, (error) => (error)
  ? Log.error('Failed to connect to db', 'bot')
  : Log.info('Connected to db', 'bot'));

// Free Hosting -> stops apps from auto sleeping
import './utils/keep-alive';
