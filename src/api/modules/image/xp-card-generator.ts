import ImageGenerator from './image-generator';
import { Canvas, createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import { MemberDocument } from '../../../data/models/member';
import { UserDocument, XPCard } from '../../../data/models/user';
import Leveling from '../../../modules/xp/leveling';
import Deps from '../../../utils/deps';
import { PartialUsers, PartialUser } from '../users/partial-users';

export class XPCardGenerator extends ImageGenerator {
  defaultColors = {
    primary: '#F4F2F3',
    secondary: '#46828D',
    tertiary: '#36E2CA'
  }

  private discordUser: PartialUser;

  constructor(
    private savedUser: UserDocument,
    private rank: number,
    private partial = Deps.get<PartialUsers>(PartialUsers)) {
    super();
  }

  async generate(savedMember: MemberDocument, preview?: XPCard) {
    this.discordUser = await this.partial.get(this.savedUser.id);

    if (preview)
      this.savedUser.xpCard = preview;

    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    await super.addBackgroundToCanvas(ctx, canvas,
      this.savedUser.xpCard.backgroundURL);
    await this.addXPInfo(ctx, canvas, savedMember.xp);
    this.addUserText(ctx, canvas);
    await this.addAvatarToCanvas(ctx,
      this.discordUser.displayAvatarURL);

    return canvas.toBuffer();
  }

  private async addAvatarToCanvas(ctx: CanvasRenderingContext2D, imageURL: string) {
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await loadImage(imageURL);
    ctx.drawImage(avatar, 25, 25, 200, 200);
  }

  private addUserText(ctx, canvas: Canvas) {
    let card = this.savedUser.xpCard;

    ctx.fillStyle = card.tertiary || this.defaultColors.tertiary;
    ctx.font = '32px Segoe UI, Arial, sans-serif';
    ctx.fillText(`#${this.rank}`, canvas.width / 2.5, canvas.height / 2.5);

    ctx.fillStyle = card.primary || this.defaultColors.primary;
    ctx.font = super.applyText(canvas, this.discordUser.username);
    ctx.fillText(this.discordUser.username, canvas.width / 2.7, canvas.height / 1.6);
  }

  private async addXPInfo(ctx: CanvasRenderingContext2D, canvas, xp: number) {
    let card = this.savedUser.xpCard;

    const sizeOffset = 325;
    const position = {
      x: 275,
      y: canvas.height * 0.775
    };
    const height = 25;

    const {
      nextLevelXP,
      level,
      levelCompletion
    } = Leveling.xpInfo(xp);

    ctx.fillStyle = card.secondary || this.defaultColors.secondary;
    ctx.fillRect(position.x, position.y, canvas.width - sizeOffset - 1, height);

    ctx.fillStyle = card.tertiary || this.defaultColors.tertiary;
    ctx.fillRect(position.x, position.y,
      (canvas.width - sizeOffset) * (levelCompletion), height);

    ctx.fillStyle = card.primary || this.defaultColors.primary;
    ctx.font = '16px Roboto, sans-serif';
    ctx.fillText(xp.toString(), canvas.width / 2.5, canvas.height / 1.175);

    ctx.fillStyle = '#0F0F0F';
    ctx.fillText(`/`, canvas.width / 2.5 +
      ctx.measureText(xp.toString()).width, canvas.height / 1.175);

    ctx.fillStyle = card.primary || this.defaultColors.primary;
    ctx.fillText(`${nextLevelXP}XP`, canvas.width / 2.5 +
      ctx.measureText(`${xp}/`).width, canvas.height / 1.175);

    ctx.fillStyle = card.primary || this.defaultColors.primary;
    ctx.fillText(`LEVEL ${level}`, canvas.width / 2.5, canvas.height / 1.35);
  }
}