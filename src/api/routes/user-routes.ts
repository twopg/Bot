import { Router } from 'express';
import { XPCardGenerator } from '../modules/image/xp-card-generator';
import { SavedMember } from '../../data/models/member';
import Deps from '../../utils/deps';
import Users from '../../data/users';
import { APIError, sendError } from '../modules/api-utils';
import { SessionManager } from '../modules/performance/session-manager';

export const router = Router();

const generator = Deps.get<XPCardGenerator>(XPCardGenerator);
const users = Deps.get<Users>(Users);
const sessions = Deps.get<SessionManager>(SessionManager);

router.get('/', async (req, res) => {
  try {
   const { authUser } = await sessions.get(req.query.key.toString());
   res.json({
    ...authUser,
    displayAvatarURL: authUser.displayAvatarURL
   });
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/saved', async (req, res) => {
  try {
   const { authUser } = await sessions.get(req.query.key.toString());
   const savedUser = await users.get(authUser);
   res.json(savedUser);
  } catch (error) { sendError(res, new APIError(400)); }
});

router.get('/xp-card-preview', async (req, res) => {
  try {
    delete req.query.cache;

    const session = await sessions.get(req.query.key.toString());    
    const savedUser = await users.get(session.authUser);

    const savedMember = new SavedMember();
    savedMember.xp = 1800;
    savedMember.userId = savedUser.id;
    
    delete req.query.key;
    const image = await generator.generate(savedUser, savedMember, 1, {
      ...savedUser.xpCard,
      ...req.query
    });
    
    res.set({'Content-Type': 'image/png'}).send(image);
  } catch (error) { sendError(res, new APIError(400)); }
});

router.put('/xp-card', async (req, res) => {   
  try {
   const { authUser } = await sessions.get(req.query.key.toString());

   const savedUser = await users.get(authUser);
   savedUser.xpCard = req.body;
   await savedUser.save();
   
   res.send(savedUser);
  } catch (error) { sendError(res, new APIError(400)); }
});
