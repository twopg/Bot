import { User, MessageReaction } from 'discord.js';
import EventHandler from './event-handler';
import Guilds from '../../data/guilds';
import ReactionRoles from '../../modules/general/reaction-roles';
import Deps from '../../utils/deps';

export default class MessageReactionRemoveHandler implements EventHandler {
  on = 'messageReactionRemove';

  constructor(
    private guilds = Deps.get<Guilds>(Guilds),
    private reactionRoles = Deps.get<ReactionRoles>(ReactionRoles)) {}

  async invoke(reaction: MessageReaction, user: User) {
    const guild = reaction.message.guild;
    if (!guild) return;

    await reaction.fetch();

    const savedGuild = await this.guilds.get(guild);
    await this.reactionRoles.checkToRemove(user, reaction, savedGuild);
  }
}
