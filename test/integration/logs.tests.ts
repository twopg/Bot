import { use, should } from 'chai';
import { SavedGuild, EventType } from '../../src/data/models/guild';
import { mock } from 'ts-mockito';
import { TextChannel, GuildMember } from 'discord.js';
import chaiAsPromised from 'chai-as-promised';
import MemberJoinHandler from '../../src/services/handlers/member-join.handler'
import Guilds from '../../src/data/guilds';

use(chaiAsPromised);
should();

describe('modules/logs', () => {
    let guilds: Guilds;

    beforeEach(() => {
        guilds = mock<Guilds>();
        guilds.get = (): any => new SavedGuild();
    });

    describe('member join handler', () => {
        let member: GuildMember;

        it('member join, member undefined, returns', () => {
            const result = () => new MemberJoinHandler(guilds).invoke(member);
    
            result().should.eventually.not.throw();
        });
        
        it('member join, event not active, returns', () => {
            const result = () => new MemberJoinHandler(guilds).invoke(member);
    
            result().should.eventually.not.throw();
        });
        
        it('member join, channel not found, returns', () => {
            guilds.get = (): any => {
                const guild = new SavedGuild();
                guild.logs.events.push({
                    enabled: true,
                    event: EventType.MemberJoin,
                    message: 'test',
                    channel: '321'
                });
            }

            const result = () => new MemberJoinHandler(guilds).invoke(member);
    
            result().should.eventually.not.throw();
        });
        
        it('member join, event active, message is sent', () => {
            guilds.get = (): any => {
                const guild = new SavedGuild();
                guild.logs.events.push({
                    enabled: true,
                    event: EventType.MemberJoin,
                    message: 'test',
                    channel: '123'
                });
            }
            
            const result = () => new MemberJoinHandler(guilds).invoke(member);
    
            result().should.eventually.throw('test');
        });
        
        it('member join, event active, message is sent with applied guild variables', () => {
            guilds.get = (): any => {
                const guild = new SavedGuild();
                guild.logs.events.push({
                    enabled: true,
                    event: EventType.MemberJoin,
                    message: '[USER] joined!',
                    channel: '123'
                });
            }

            const result = () => new MemberJoinHandler(guilds).invoke(member);
    
            result().should.eventually.throws(new TypeError('<@!123> joined!'));
        });
    });
});