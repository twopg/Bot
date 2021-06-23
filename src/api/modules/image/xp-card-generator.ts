import { Rank } from 'canvacord';
import { MemberDocument } from '../../../data/models/member';
import { UserDocument, XPCard } from '../../../data/models/user';
import Leveling from '../../../modules/xp/leveling';
import Deps from '../../../utils/deps';
import { PartialUsers } from '../users/partial-users';

export class XPCardGenerator {
  constructor(
    private partial = Deps.get<PartialUsers>(PartialUsers),
  ) {}

  async generate(
    savedUser: UserDocument,
    savedMember: MemberDocument,
    rank: number,
    preview?: XPCard
  ) {
    preview = {
      primary: '#F4F2F3',
      secondary: '#46828D',
      tertiary: '#36E2CA',
      ...preview,
    };
    const partialUser = await this.partial.get(savedMember.userId);    
    if (!partialUser)
      throw new TypeError('User not found');
      
    const info = Leveling.xpInfo(savedMember.xp);  
    const defaultWallpaper = `${__dirname}/wallpaper.png`;   

    try {
      return new Rank()
        .setAvatar(partialUser.displayAvatarURL.replace('.webp', '.png'))
        .setBackground('IMAGE', savedUser.xpCard.backgroundURL || defaultWallpaper)
        .setCurrentXP(info.xp, savedUser.xpCard.secondary || preview.secondary)
        .setDiscriminator(partialUser.discriminator, savedUser.xpCard.tertiary || preview.tertiary)
        .setLevel(info.level, 'LVL')
        .setProgressBar(savedUser.xpCard.secondary || preview.secondary)
        .setProgressBarTrack(savedUser.xpCard.tertiary || preview.tertiary)
        .setRank(rank, '#')
        .setRankColor(savedUser.xpCard.tertiary || preview.tertiary, savedUser.xpCard.tertiary || preview.tertiary)
        .setRequiredXP(info.nextLevelXP, savedUser.xpCard.tertiary || preview.tertiary)
        .setUsername(partialUser.username, savedUser.xpCard.primary || preview.primary)
        .build();
    } catch (error) {
      console.log(error.message);  
    }
  }
}
