import { Client } from '@2pg/oauth';

export const auth = new Client({
  id: process.env.CLIENT_ID,
  secret: process.env.CLIENT_SECRET,
  redirectURI: `${process.env.API_URL}/auth`,
  scopes: ['identify', 'guilds']
});
