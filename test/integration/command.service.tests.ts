import { expect, use, should } from 'chai';
import CommandService from '../../src/services/command.service';
import { mock } from 'ts-mockito';
import chaiAsPromised from 'chai-as-promised';
import Deps from '../../src/utils/deps';
import Logs from '../../src/data/logs';
import Commands from '../../src/data/commands';
import { SavedGuild, GuildDocument } from '../../src/data/models/guild'
import Cooldowns from '../../src/services/cooldowns';
import Validators from '../../src/services/validators';

should();
use(chaiAsPromised);

describe('services/command-service', () => {
    let savedGuild: GuildDocument;
    let service: CommandService;

    beforeEach(() => {

        savedGuild = new SavedGuild();
        savedGuild.general.prefix = '.';

        service = new CommandService(
            mock<Logs>(),
            mock<Cooldowns>(),
            mock<Validators>(),
            mock<Commands>());
    });

    describe('handle', () => {
        it('empty message gets ignored', () => {
            const msg: any = { content: '', channel: { reply: () => { throw Error() }}};

            const result = () => service.handle(msg, savedGuild);

            expect(result()).to.eventually.throw();
        });

        it('no found command message gets ignored', () => {
            const msg: any = { content: '.pong', reply: () => { throw Error(); }};

            const result = () => service.handle(msg, savedGuild);

            expect(result()).to.eventually.throw();
        });

        it('found command gets executed', () => {
            const msg: any = { content: '.ping', reply: () => { throw Error(); }};

            const result = () => service.handle(msg, savedGuild);

            expect(result()).to.eventually.throw();
        });

        it('found command, with extra args, gets executed', async () => {
            const msg: any = { content: '.ping pong', reply: () => { throw Error(); }};
            
            const result = () => service.handle(msg, savedGuild);

            expect(result()).to.eventually.throw();
        });

        it('found command, with unmet precondition, gets ignored', async () => {
            const msg: any = { content: '.warnings', reply: () => { throw Error(); }};

            await service.handle(msg, savedGuild);
        });

        it('command override disabled command, throws error', () => {            
            const msg: any = { content: '.ping', reply: () => { throw Error(); }};
            
            savedGuild.commands.configs.push({ name: 'ping', enabled: false });
            
            const result = () => service.handle(msg, savedGuild);

            expect(result).to.eventually.throw();
        });
    });
});
