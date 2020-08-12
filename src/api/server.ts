import bodyParser from 'body-parser';
import cors from 'cors';
import OAuthClient from 'disco-oauth';
import express from 'express';
import { join } from 'path';
import { Stripe } from 'stripe';
import config from '../../config.json';
import Deps from '../utils/deps';
import Log from '../utils/log';
import Stats from './modules/stats';

import { router as apiRoutes } from './routes/api-routes';
import { router as guildsRoutes } from './routes/guilds-routes';
import { router as musicRoutes } from './routes/music-routes';
import { router as payRoutes } from './routes/pay-routes';
import { router as userRoutes } from './routes/user-routes';

export const app = express(),
             AuthClient = new OAuthClient(config.bot.id, config.bot.secret),
             stripe = new Stripe(config.api.stripeSecretKey, { apiVersion: '2020-03-02' });

export default class API {
    stripeEndpointSecret = '';

    constructor(private stats = Deps.get<Stats>(Stats)) {
        AuthClient.setRedirect(`${config.api.url}/auth`);
        AuthClient.setScopes('identify', 'guilds');

        const isStripeKey = config.api.stripeSecretKey.includes('live');
        if (isStripeKey)
            stripe.webhookEndpoints.create({
                url: config.api.url + '/stripe-webhook',
                enabled_events: ['*']
            }).then(v => this.stripeEndpointSecret = v.secret);

            
        app.use(cors());
        
        app.use('/api', payRoutes);

        app.use(bodyParser.json());

        app.use('/api/guilds/:id/music', musicRoutes);
        app.use('/api/guilds', guildsRoutes);
        app.use('/api/user', userRoutes);
        app.use('/api', apiRoutes);

        app.get('/api/*', (req, res) => res.status(404).json({ code: 404 }));
        
        const distPath = join(process.cwd(), '/dist/dashboard');
        app.use(express.static(distPath));
        
        app.all('*', (req, res) => res.status(200).sendFile(`${distPath}/index.html`));

        this.stats.init();
    }
}

const port = config.api.port || 3000;
app.listen(port, () => Log.info(`API is live on port ${port}`));
