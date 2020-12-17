import { MessageFilter } from '../../../data/models/guild';
import { ContentValidator } from './content-validator';
import AutoMod, { ValidationError } from '../auto-mod';
import { toNeatList } from '../../../utils/command-utils';

export default class MassMentionValidator implements ContentValidator {
  filter = MessageFilter.Toxicity;
  
  async validate(autoMod: AutoMod, content: string) {         
    const labels = await autoMod.toxicity.classify(content);
    const matchedNames = []
      .filter(l => l.results.some(r => r.match))
      .map(l => l.label);

    const invalid = matchedNames.length > 0;
    if (invalid)
      throw new ValidationError(`Message was flagged for ${toNeatList(matchedNames)}`, this.filter);
  }
}