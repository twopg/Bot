import request from 'supertest';
import { app } from '../../src/api/server';

const testConfig = {
    guildId: ''
};

describe('routes/api', () => {
    describe('/', () => {
        it('returns 200', (done) => {
            request(app).get('/api')
                .expect(200)
                .end(done);
        });
    });

    describe('/commands', () => {
        const url = '/api/commands';

        it('returns 200', (done) => {
            request(app).get(url)
                .expect(200)
                .end(done);
        });
    });

    describe('/auth', () => {
        const url = '/api/auth';

        it('no code, returns 400', (done) => {
            request(app).get(url)
                .expect(400)
                .end(done);
        });
    });
    
    describe('/user', () => {
        const url = '/api/user';

        it('no key, returns 400', (done) => {
            request(app).get(url)
                .expect(400)
                .end(done);
        });
    });
    
    it('any url returns 404', (done) => {
        request(app).get('/api/a')
            .expect(404)
            .end(done);
    });
});

describe('routes/api/guilds', () => {
    let url: string;

    beforeEach(() => url = '/api/guilds');

    describe('GET /:id/log', () => {
        it('found guild, returns guild', (done) => {
            url += `/${testConfig.guildId}/public`;

            request(app).get(url)
                .expect(200)
                .end(done);
        });
    });
    
    describe('GET /:id/public', () => {
        it('found guild, returns guild', (done) => {
            url += `/${testConfig.guildId}/public`;

            request(app).get(url)
                .expect(200)
                .end(done);
        });

        it('unknown guild, returns undefined', (done) => {
            url += '/321/public';

            request(app).get(url)
                .expect(200)
                .expect(undefined)
                .end(done);
        });
    });
        
    describe('GET /', () => {
        it('no key, returns 400', (done) => {
            request(app).get(url)
                .expect(400)
                .end(done);
        });
    });
    
    describe('POST /', () => {
        it('no key, returns 400', (done) => {
            request(app).get(url)
                .expect(400)
                .end(done);
        });
    });
    
    describe('GET /:id/users', () => {
        url += '/123/users';

        it('unknown guild, returns 404', (done) => {
            request(app).get(url)
                .expect(404)
                .end(done);
        });
    });
});
