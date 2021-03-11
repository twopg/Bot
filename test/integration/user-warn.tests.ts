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

  it('no warnings, ban or kick not called', async () => {
    const kick = spy.on(member, 'kick');
    const ban = spy.on(member, 'ban');

    await event.invoke({
      guild, user, warnings: 0, instigator: null, reason: ''
    }, new SavedMember());

    expect(kick).to.not.be.called();
    expect(ban).to.not.be.called();
  });

  it('member warned once, ban or kick not called', async () => {
    const kick = spy.on(member, 'kick');
    const ban = spy.on(member, 'ban');

    await event.invoke({
      guild, user, warnings: 1, instigator: null, reason: ''
    }, savedMember);

    expect(kick).to.not.be.called();
    expect(ban).to.not.be.called();
  });

  it('member warned 3 times in 1 min, 1 trigger, kick is called, but not ban', async () => {
    savedMember = new SavedMember({
      warnings: [
        { at: new Date() },
        { at: new Date() },
        { at: new Date() },
      ]
    });
    const kick = spy.on(member, 'kick');
    const ban = spy.on(member, 'ban');

    await event.invoke({
      guild, user, warnings: 1, instigator: null, reason: ''
    }, savedMember);

    expect(kick).to.be.called();
    expect(ban).to.not.be.called();
  });

  it('member warned 6 times in 1 min, 2 triggers, ban is called, but not kick', async () => {
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
    const kick = spy.on(member, 'kick');
    const ban = spy.on(member, 'ban');

    await event.invoke({
      guild, user, warnings: 6, instigator: null, reason: ''
    }, savedMember);

    expect(ban).to.be.called();
    expect(kick).to.not.be.called();
  });

  it('member warned, has 3 total warnings, no punishment', async () => {
    savedMember = new SavedMember({
      warnings: [
        { at: new Date() },
        { at: new Date(0) },
        { at: new Date(0) },
      ]
    });
    const kick = spy.on(member, 'kick');
    const ban = spy.on(member, 'ban');

    await event.invoke({
      guild, user, warnings: 6, instigator: null, reason: ''
    }, savedMember);

    expect(ban).to.not.be.called();
    expect(kick).to.not.be.called();
  });

  it('member warned, has 6 total warnings, no punishment', async () => {
    savedMember = new SavedMember({
      warnings: [
        { at: new Date() },
        { at: new Date(0) },
        { at: new Date(0) },
        { at: new Date(0) },
        { at: new Date(0) },
        { at: new Date(0) },
      ]
    });
    const kick = spy.on(member, 'kick');
    const ban = spy.on(member, 'ban');

    await event.invoke({
      guild, user, warnings: 6, instigator: null, reason: ''
    }, savedMember);

    expect(ban).to.not.be.called();
    expect(kick).to.not.be.called();
  });
});
