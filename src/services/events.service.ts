import { bot, emitter } from '../bot';
import Log from '../utils/log';
import fs from 'fs';
import { promisify } from 'util';
import EventHandler from './handlers/event-handler';

const readdir = promisify(fs.readdir);

export default class EventsService {
  private readonly handlers: EventHandler[] = [];
  private readonly customHandlers: EventHandler[] = [];

  async init() {
    const handlerFiles = await readdir(`${__dirname}/handlers`);    
    for (const file of handlerFiles.filter(n => n !== 'custom')) {
      const { default: Handler } = await import(`./handlers/${file}`);
      const handler = Handler && new Handler();
      if (!handler?.on) continue;

      this.handlers.push(new Handler());
    }

    const customHandlerFiles = await readdir(`${__dirname}/handlers/custom`);
    for (const file of customHandlerFiles) {
      const { default: Handler } = await import(`./handlers/custom/${file}`);
      const handler = Handler && new Handler();
      if (!handler?.on) continue;

      this.customHandlers.push(new Handler());
    }
    this.hookEvents();
  }

  private hookEvents() {
    for (const handler of this.handlers)
      bot.on(handler.on as any, handler.invoke.bind(handler));

    for (const handler of this.customHandlers)
      emitter.on(handler.on, handler.invoke.bind(handler));

    Log.info(`Loaded: ${this.handlers.length} handlers`, 'events');
    Log.info(`Loaded: ${this.customHandlers.length} custom handlers`, 'events');
  }
}
