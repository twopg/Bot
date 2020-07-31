import Ranks from '../../src/api/modules/ranks';
import { expect } from 'chai';

describe('api/ranks', () => {
    it('lowest xp messages returns lowest rank', () => {
        const members = [
            { xp: '100', userId: '1' },
            { xp: '200', userId: '2' },
            { xp: '300', userId: '3' }
        ] as any;
        
        const result = Ranks.get({ id: '1' } as any, members);

        expect(result).to.equal(3);
    });

    it('highest xp messages returns highest rank', () => {
        const members = [
            { xp: '100', userId: '1' },
            { xp: '999', userId: '2' },
            { xp: '300', userId: '3' }
        ] as any;
        
        const result = Ranks.get({ id: '2' } as any, members);

        expect(result).to.equal(1);
    });

    it('medium xp messages returns middle rank', () => {
        const members = [
            { xp: '100', userId: '1' },
            { xp: '999', userId: '2' },
            { xp: '300', userId: '3' }
        ] as any;
        
        const result = Ranks.get({ id: '3' } as any, members);

        expect(result).to.equal(2);
    });
});