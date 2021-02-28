import { emitter } from '../bot';
import Log from '../utils/log';
import fs from 'fs';
import { promisify } from 'util';
import Event from './events/event-handler';
import Deps from '../utils/deps';
import { Client } from 'discord.js';

const readdir = promisify(fs.readdir);

export class EventHandler {
  private readonly handlers: Event[] = [];
  private readonly customHandlers: Event[] = [];

  constructor(
    private bot = Deps.get<Client>(Client)
  ) {}

  async init() {
    const handlerFiles = await readdir(`${__dirname}/events`);    
    for (const file of handlerFiles.filter(n => n !== 'custom')) {
      const { default: Handler } = await import(`./events/${file}`);
      const handler = Handler && new Handler();
      if (!handler?.on) continue;

      this.handlers.push(new Handler());
    }

    const customHandlerFiles = await readdir(`${__dirname}/events/custom`);
    for (const file of customHandlerFiles) {
      const { default: Handler } = await import(`./events/custom/${file}`);
      const handler = Handler && new Handler();
      if (!handler?.on) continue;

      this.customHandlers.push(new Handler());
    }
    this.hookEvents();
  }

  private hookEvents() {
    for (const handler of this.handlers)
      this.bot.on(handler.on as any, handler.invoke.bind(handler));

    for (const handler of this.customHandlers)
      emitter.on(handler.on, handler.invoke.bind(handler));

    Log.info(`Loaded: ${this.handlers.length} handlers`, 'events');
    Log.info(`Loaded: ${this.customHandlers.length} custom handlers`, 'events');
  }
}
