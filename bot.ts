import { Client } from 'discord.js';
import config from './config.json';
import mongoose from 'mongoose';
import Deps from './utils/deps';

import EventsService from './services/events.service';
import API from './api/server';

export const bot = new Client({
    partials: ['GUILD_MEMBER']
});

bot.login(config.bot.token);

Deps.build(EventsService, API);

mongoose.connect(config.mongoURL, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useFindAndModify: false 
});

// GLITCH.COM -> uncomment for glitch auto ping
/*let count = 0;
setInterval(() =>
    require('node-fetch')(config.dashboard.url)
    .then(() => console.log(`[${++count}] Kept ${config.dashboard.url} alive.`))
, 5 * 60 * 1000);*/