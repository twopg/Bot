import { Router } from 'express';
import { XPCardGenerator } from '../modules/image/xp-card-generator';
import { SavedMember } from '../../data/models/member';
import Deps from '../../utils/deps';
import Users from '../../data/users';
import { getUser, sendError } from '../modules/api-utils';

export const router = Router();

router.get('/', async (req, res) => {
    try {
        const user = await getUser(req.query.key);
        res.json(user);
    } catch (error) { sendError(res, 400, error); }
});

router.get('/saved', async (req, res) => {
    try {        
        const user = await getUser(req.query.key);
        const savedUser = await Deps.get<Users>(Users).get(user);
        res.json(savedUser);
    } catch (error) { sendError(res, 400, error); }
});

router.get('/xp-card-preview', async (req, res) => {
    try {        
        delete req.query.cache;

        const user = await getUser(req.query.key);
        const savedUser = await Deps.get<Users>(Users).get(user);
        if (!savedUser)
            return res.status(404).send('User not found');

        const rank = 1;
        const generator = new XPCardGenerator(savedUser, rank);

        const member = new SavedMember();
        member.xp = 1800;
        
        delete req.query.key;        
        const image = await generator.generate(member, { ...savedUser.xpCard, ...req.query });
        
        res.set({'Content-Type': 'image/png'}).send(image);
    } catch (error) { sendError(res, 400, error); }
});

router.put('/xp-card', async (req, res) => {        
    try {
        const user = await getUser(req.query.key);
        const savedUser = await Deps.get<Users>(Users).get(user);

        savedUser.xpCard = req.body;
        await savedUser.save();
        
        res.send(savedUser);
    } catch (error) { sendError(res, 400, error); }
});