import { Router } from 'express';
import { APIError, sendError } from '../modules/api-utils';
import Deps from '../../utils/deps';
import Users, { Plan } from '../../data/users';
import { SessionManager } from '../modules/performance/session-manager';
import paypal, { Payment } from 'paypal-rest-sdk';
import Log from '../../utils/log';

paypal.configure({
  mode: process.env.PAYPAL_MODE, // sandbox / live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

const sessions = Deps.get<SessionManager>(SessionManager);

const items: paypal.Item[] = [
  {
    sku: '1_month',
    name: '2PG+ [1 Month]',
    price: '2.99',
    currency: 'USD',
    quantity: 1
  },
  {
    sku: '3_month',
    name: '2PG+ [3 Months]',
    price: '4.99',
    currency: 'USD',
    quantity: 1
  },
  {
    sku: '1_year',
    name: '2PG+ [1 Year]',
    price: '14.99',
    currency: 'USD',
    quantity: 1
  }
];

export const router = Router();

const users = Deps.get<Users>(Users);

router.get('/', async(req, res) => {
  try {
    const { key, plan } = req.query as any;
    const { authUser } = await sessions.get(key);

    const item = items[+plan];
    item.description = authUser.id;

    const payment: Payment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      note_to_payer: `For Discord User - ${authUser.tag}`,
      redirect_urls: {
        return_url: `${process.env.API_URL}/pay/success`,
        cancel_url: `${process.env.DASHBOARD_URL}/plus?payment_status=failed`,
      },
      transactions: [
        {
          reference_id: authUser.id,
          item_list: { items: [item] },
          amount: {
            currency: item.currency,
            total: item.price,
          },
        },
      ],
    };

    paypal.payment.create(payment, {
      auth: authUser.id,
    }, (error, payment) => {
      if (error)
        throw error;

      for (const link of payment.links) {
        const paymentApproved = link.rel === 'approval_url';
        if (paymentApproved)
          res.redirect(link.href);
      }
    });
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/success', async (req, res) => {
  try {
    const executePayment: paypal.payment.ExecuteRequest = {
      payer_id: req.query.PayerID.toString()
    };
    
    const paymentId = req.query.paymentId.toString();
    paypal.payment.execute(paymentId, executePayment,
      async (error, payment) => {
        payment.payer
      if (error) {
        Log.error(error.response, 'pay');
        throw error;
      }
      
      const item: paypal.Item = payment
        .transactions[0]
        .item_list.items[0];
      await users.givePlus(item.description, item.sku as Plan);

      res.redirect(`${process.env.DASHBOARD_URL}/payment-success`);
    });
  } catch (error) { sendError(res, new APIError(400)); }
});
