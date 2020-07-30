import EventHandler from './event-handler';
import { Message } from 'discord.js';

export default class MessageUpdateHandler implements EventHandler {
    on = 'messageUpdate';

    async invoke(msg: Message) {
        return msg.reply('This message was updated.');
    }
}