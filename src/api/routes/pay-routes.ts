import { stripe } from '../server';
import { Stripe } from 'stripe';
import config from '../../../config.json';
import { Router } from 'express';
import { getUser, sendError } from '../modules/api-utils';
import Deps from '../../utils/deps';
import Users, { Plan } from '../../data/users';

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
    const { id } = await getUser(key);

    const session = await stripe.checkout.sessions.create({
      success_url: `${config.dashboardURL}/payment-success`,
      cancel_url: `${config.dashboardURL}/plus`,
      payment_method_types: ['card'],
      metadata: { id, plan },
      line_items: [ items[+plan] ]
    });
    res.send(session);
  } catch (error) { sendError(res, 400, error); }
});

router.post('/stripe-webhook', async(req, res) => {
  try {
    // TODO: add better validation
    if (!req.headers['stripe-signature']) return;
    
    if (req.body.type === 'checkout.session.completed') {
      const { id, plan } = req.body.data.payment.metadata;
      await users.givePlus(id, plan as Plan);

      return res.json({ success: true });
    }
    res.json({ received: true });
  } catch (error) { sendError(res, 400, error); }
});