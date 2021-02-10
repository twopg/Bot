import { Stripe } from 'stripe';
import { Router } from 'express';
import { APIError, sendError } from '../modules/api-utils';
import Deps from '../../utils/deps';
import Users from '../../data/users';
import bodyParser from 'body-parser';
import { SessionManager } from '../modules/performance/session-manager';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

const sessions = Deps.get<SessionManager>(SessionManager);

const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
  {
    name: '2PG+ [1 Month]',
    description: 'Support 2PG, and unlock exclusive features!',
    amount: 500,
    currency: 'usd',
    quantity: 1
  },
  {
    name: '2PG+ [3 Months]',
    description: 'Support 2PG, and unlock exclusive features!',
    amount: 1000,
    currency: 'usd',
    quantity: 1
  },
  {
    name: '2PG+ [Forever]',
    description: 'Support 2PG, and unlock exclusive features!',
    amount: 2500,
    currency: 'usd',
    quantity: 1
  }
];

export const router = Router();

const users = Deps.get<Users>(Users);

router.get('/user/pay', async(req, res) => {
  try {
    const { key, plan } = req.query as any;
    const { authUser } = await sessions.get(key);

    const session = await stripe.checkout.sessions.create({
      success_url: `${ process.env.DASHBOARD_URL}/payment-success`,
      cancel_url: `${ process.env.DASHBOARD_URL}/plus`,
      payment_method_types: ['card'],
      metadata: { id: authUser.id, plan },
      line_items: [ items[+plan] ]
    });
    res.send(session);
  } catch (error) { sendError(res, new APIError(400)); }
});

router.post('/stripe-webhook', bodyParser.raw({ type: 'application/json' }), async(req, res) => {
  try {
    let event = stripe.webhooks
      .constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
    
    if (event.type === 'checkout.session.completed') {
      const { id, plan } = (event.data.object as any).metadata;
      await users.givePlus(id, +plan);

      return res.json({ success: true });
    }
    res.json({ received: true });
  } catch (error) { sendError(res, new APIError(400)); }
});
