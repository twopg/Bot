import { Client } from 'discord.js';
import config from './../config.json';
import mongoose from 'mongoose';
import Deps from './utils/deps';
import { EventEmitter } from 'events';

import EventsService from './services/events.service';
import API from './api/server';
import Log from './utils/log';

export const bot = new Client({ partials: ['GUILD_MEMBER'] });
export const emitter = new EventEmitter();

bot.login(config.bot.token);

Deps.get<EventsService>(EventsService).init();
Deps.build(API);

mongoose.connect(config.mongoURL, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useFindAndModify: false 
}, (error) => error
    ? Log.error('Failed to connect to db', 'bot')
    : Log.info('Connected to db', 'bot'));

// GLITCH.COM -> uncomment for glitch auto ping
/*let count = 0;
setInterval(() =>
    require('node-fetch')(config.dashboardURL)
    .then(() => console.log(`[${++count}] Kept ${config.dashboardURL} alive.`))
, 5 * 60 * 1000);*/