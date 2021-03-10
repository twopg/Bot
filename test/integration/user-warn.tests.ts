import { expect, spy } from 'chai';
import { AutoPunishment, SavedGuild } from '../../src/data/models/guild';
import { MemberDocument, SavedMember } from '../../src/data/models/member';
import UserWarnHandler from '../../src/handlers/events/custom/user-warn.handler';
import { Mock } from '../mocks/mock';

describe('handlers/user-warn', () => {
  let event: UserWarnHandler;
  let guild: any;
  let savedMember: MemberDocument;
  let user: any;
  let member: any;

  beforeEach(async() => {
    event = new UserWarnHandler();
    guild = Mock.guild('test_guild_123');
    user = Mock.user('test_user_123');
    savedMember = new SavedMember();
    member = {
      id: 'test_user_123',
      kick: () => {},
      ban: () => {}
    };

    guild.members.cache.set('test_user_123', member);

    await SavedGuild.create({
      _id: 'test_guild_123',
      autoMod: {
        punishments: [
          { warnings: 3, minutes: 1, type: 'KICK' } as AutoPunishment,
          { warnings: 5, minutes: 1, type: 'BAN' } as AutoPunishment,
        ]
      }
    });
  });

  afterEach(async() => await SavedGuild.deleteMany({}));

  it('member warned once, ban or kick not called', async () => {
    const spied1 = spy.on(member, 'kick');
    const spied2 = spy.on(member, 'ban');

    await event.invoke({
      guild, user, warnings: 1, instigator: null, reason: ''
    }, savedMember);

    expect(spied1).to.not.be.called();
    expect(spied2).to.not.be.called();
  });

  it('member warned 3 times in 1 min, triggers auto punishment, member.kick is called', async () => {
    savedMember = new SavedMember({
      warnings: [
        { at: new Date() },
        { at: new Date() },
        { at: new Date() },
      ]
    });
    const spied = spy.on(member, 'kick');

    await event.invoke({
      guild, user, warnings: 1, instigator: null, reason: ''
    }, savedMember);

    expect(spied).to.be.called();
  });

  it('member warned 6 times in 1 min, triggers 2 auto punishments, last punishment is executed', async () => {
    savedMember = new SavedMember({
      warnings: [
        { at: new Date() },
        { at: new Date() },
        { at: new Date() },
        { at: new Date() },
        { at: new Date() },
        { at: new Date() },
      ]
    });
    const spied = spy.on(member, 'ban');

    await event.invoke({
      guild, user, warnings: 1, instigator: null, reason: ''
    }, savedMember);

    expect(spied).to.be.called();
  });
});