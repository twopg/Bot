import bodyParser from 'body-parser';
import cors from 'cors';
import AuthClient from '@2pg/oauth';
import express from 'express';
import { join } from 'path';
import { Stripe } from 'stripe';

import Deps from '../utils/deps';
import Log from '../utils/log';
import Stats from './modules/stats';

import { router as apiRoutes } from './routes/api-routes';
import { router as guildsRoutes } from './routes/guilds-routes';
import { router as musicRoutes } from './routes/music-routes';
import { router as payRoutes } from './routes/pay-routes';
import { router as userRoutes } from './routes/user-routes';

export const app = express();
export const auth = new AuthClient({
    id: process.env.BOT_ID,
    secret: process.env.CLIENT_SECRET,
    redirectURI: `${ process.env.API_URL}/auth`,
    scopes: ['identify', 'guilds']
});
export const stripe = new Stripe( process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

export default class API {
    constructor(private stats = Deps.get<Stats>(Stats)) {             
        app.use(cors());        
        app.use('/api', payRoutes);
        app.use(bodyParser.json());

        app.use('/api/guilds/:id/music', musicRoutes);
        app.use('/api/guilds', guildsRoutes);
        app.use('/api/user', userRoutes);
        app.use('/api', apiRoutes);

        app.get('/api/*', (req, res) => res.status(404).json({ code: 404 }));
        
        const distPath = join(process.cwd(), '/dist/twopg-dashboard/browser');
        app.use(express.static(distPath));
        
        app.all('*', (req, res) => res.status(200).sendFile(`${distPath}/index.html`));

        this.stats.init();
    }
}

const port = process.env.PORT || 3000;
app.listen(port, () => Log.info(`API is live on port ${port}`));
