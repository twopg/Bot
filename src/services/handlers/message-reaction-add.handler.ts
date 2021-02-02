import { User, MessageReaction } from 'discord.js';
import EventHandler from './event-handler';
import Deps from '../../utils/deps';
import ReactionRoles from '../../modules/general/reaction-roles';
import Guilds from '../../data/guilds';

export default class MessageReactionAddHandler implements EventHandler {
  on = 'messageReactionAdd';

  constructor(
    private guilds = Deps.get<Guilds>(Guilds),
    private reactionRoles = Deps.get<ReactionRoles>(ReactionRoles)) {}

  async invoke(reaction: MessageReaction, user: User) {    
    reaction = await reaction.fetch();
    const guild = reaction.message.guild;
    if (!guild) return;

    const savedGuild = await this.guilds.get(guild);
    await this.reactionRoles.checkToAdd(user, reaction, savedGuild);
  }
}
