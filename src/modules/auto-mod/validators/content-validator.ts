import { GuildDocument, MessageFilter } from '../../../data/models/guild';
import AutoMod from '../auto-mod';

export interface ContentValidator {
  filter: MessageFilter;
  
  validate(autoMod: AutoMod, content: string, guild: GuildDocument): void | Promise<void>;
}