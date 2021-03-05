import { expect } from 'chai';
import { mock } from 'ts-mockito';
import { CommandContext } from '../../src/commands/command';
import PlayCommand from '../../src/commands/play';
import XPCommand from '../../src/commands/xp';
import WarningsCommand from '../../src/commands/warnings';


describe('commands/play', () => {
    it('null query, throws error', () => {
        const ctx = mock<CommandContext>();
        ctx.member = { voice: { channel: null }} as any;
        
        const result = () => new PlayCommand().execute(ctx);

        result().should.eventually.throw();
    });
    
    it('null channel, throws error', () => {
        const ctx = mock<CommandContext>();
        ctx.member = { voice: { channel: null }} as any;
        
        const result = () => new PlayCommand().execute(ctx, 'a');

        result().should.eventually.throw();
    });
});

describe('commands/warnings', () => {
    it('null channel, throws error', () =>
    {
        const ctx = mock<CommandContext>();
        
        const result = () => new WarningsCommand().execute(ctx, '1');

        result().should.eventually.throw();
    });
});

describe('commands/xp', () => {
    let command: XPCommand;

    beforeEach(() => command = new XPCommand());
    
    it('mentioned user not found, error thrown', () => {
        const result = () => command.execute({} as any, '<@!>');

        expect(result).to.throw();
    });

    it('xp bot user, error thrown', () => {
        const ctx = { member: { user: { bot: true }}} as any;

        const result = () => command.execute(ctx, '');

        expect(result).to.throw();
    });
});

