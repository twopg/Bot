import { Rank } from 'canvacord';
import { PartialUser } from 'discord.js';
import { MemberDocument } from '../../../data/models/member';
import { UserDocument, XPCard } from '../../../data/models/user';
import Leveling from '../../../modules/xp/leveling';
import Deps from '../../../utils/deps';
import { PartialUsers } from '../users/partial-users';

export class XPCardGenerator {
  constructor(
    private partial = Deps.get<PartialUsers>(PartialUsers),
  ) {}

  async generate(savedMember: MemberDocument, rank: number, preview?: XPCard) {
    preview = {
      primary: '#F4F2F3',
      secondary: '#46828D',
      tertiary: '#36E2CA',
      ...preview,
    }
    const partialUser = await this.partial.get(savedMember.userId);
    if (!partialUser)
      throw new TypeError('User not found');
    const info = Leveling.xpInfo(savedMember.xp);    

    return new Rank()
      .setAvatar(partialUser.displayAvatarURL.replace('.webp', '.png'))
      .setCurrentXP(info.xp)
      .setRequiredXP(info.xpForNextLevel)
      .setRank(rank)
      .setProgressBar(preview.secondary, 'COLOR')
      .setUsername(partialUser.username)
      .setDiscriminator(partialUser.discriminator)
      .build();
  }
}