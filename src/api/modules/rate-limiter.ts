import rateLimit from 'express-rate-limit';
import rateLimitStore from '@lykmapipo/rate-limit-mongoose';

const whiteListedIPs = ['::1', '.', '::ffff:127.0.0.1'];

export default rateLimit({
    store: rateLimitStore({ windowMs: 1 * 60 * 1000 }),
    max: 180,
    message: `You are being rate limited.`,
    skip: (req, res) => {
        const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;        
        return whiteListedIPs.some(ip => ip === clientIP);
    }
});