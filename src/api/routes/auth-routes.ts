import { Router } from 'express';
import { sendError, APIError } from '../modules/api-utils';
import { auth } from '../modules/auth-client';

export const router = Router();

router.get('/auth', async (req, res) => {
  try {    
    const key = await auth.getAccess(req.query.code.toString());
    res.redirect(`${process.env.DASHBOARD_URL}/auth?key=${key}`);
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/invite', (req, res) => {
  const newLineOrSpace = / |\n/g;
  res.redirect(`
    https://discordapp.com/api/oauth2/authorize
    ?client_id=${process.env.CLIENT_ID}
    &redirect_uri=${process.env.DASHBOARD_URL}/dashboard
    &response_type=code
    &permissions=8
    &scope=bot`.replace(newLineOrSpace, '')
  )
});

router.get('/login', (req, res) => res.redirect(auth.authCodeLink.url));
