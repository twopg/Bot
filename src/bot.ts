import { config } from 'dotenv';
config({ path: '.env' });

import { Client } from 'discord.js';
import mongoose from 'mongoose';
import Deps from './utils/deps';
import { EventEmitter } from 'events';
import EventsService from './services/events.service';
import API from './api/server';
import Log from './utils/log';
import { DBotsService } from './modules/stats/dbots.service';

export const bot = new Client({
  partials: ['GUILD_MEMBER', 'REACTION', 'MESSAGE', 'USER'],
  retryLimit: Infinity
});

export const emitter = new EventEmitter();

bot.login(process.env.BOT_TOKEN);
console.log(process.env);


Deps.get<EventsService>(EventsService).init();
Deps.build(
  API,
  DBotsService
);

mongoose.connect(process.env.MONGO_URI, { 
  useUnifiedTopology: true, 
  useNewUrlParser: true, 
  useFindAndModify: false 
}, (error) => (error)
  ? Log.error('Failed to connect to db', 'bot')
  : Log.info('Connected to db', 'bot'));

// Free Hosting -> stops apps from auto sleeping
import './utils/keep-alive';
