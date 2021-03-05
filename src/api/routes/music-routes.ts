import { Router } from 'express';
import Music from '../../modules/music/music';
import Deps from '../../utils/deps';
import { bot } from '../../bot';
import { auth } from '../server';
import Users from '../../data/users';
import { validateGuildManager } from '../modules/api-utils';

export const router = Router({ mergeParams: true });

const music = Deps.get<Music>(Music);
const users = Deps.get<Users>(Users);

router.get('/pause', async (req, res) => {
    try {
        const { player } = await getMusic(req.params.id, req.query.key);
        player.pause();

        res.status(200).send({ success: true });
    } catch (error) { res.status(400).send(error?.message); }
});

router.get('/resume', async (req, res) => {
    try {
        const { player } = await getMusic(req.params.id, req.query.key);
        player.resume();

        res.status(200).send({ success: true });
    } catch (error) { res.status(400).send(error?.message); }
});

router.get('/list', async (req, res) => {
    try {
        const { player } = await getMusic(req.params.id, req.query.key);

        for (const track of player.q.items)
            track['durationString'] = `${track.duration}`;

        res.status(200).json(player.q.items);
    } catch (error) { res.status(400).send(error?.message); }
});

router.get('/skip', async (req, res) => {
    try {
        const { player } = await getMusic(req.params.id, req.query.key);
        await player.skip();

        res.status(200).send({ success: true });
    } catch (error) { res.status(400).send(error?.message); }
});

router.get('/seek/:position', async (req, res) => {
    try {
        const { player } = await getMusic(req.params.id, req.query.key);

        player.seek(+req.params.position);

        res.status(200).send({ success: true });
    } catch (error) { res.status(400).send(error?.message); }
});

router.get('/remove/:number', async (req, res) => {
    try {
        const { player } = await getMusic(req.params.id, req.query.key);
        
        const track = player.q.items.splice(+req.params.number - 1);

        res.status(200).json(track);
    } catch (error) { res.status(400).send(error?.message); }
});

router.get('/play', async (req, res) => {
    try {
        const { player, hasPremium } = await getMusic(req.params.id, req.query.key);
        const track = await player.play(req.query.query?.toString());
        
        const maxSize = (hasPremium) ? 10 : 5;
        if (player.q.length >= maxSize)
            throw new TypeError('Queue limit reached.');

        res.status(200).json(track);
    } catch (error) { res.status(400).send(error?.message); }
});

router.get('/set-volume/:value', async (req, res) => {
    try {
        const { player } = await getMusic(req.params.id, req.query.key);

        await player.setVolume(+req.params.value / 100);

        res.status(200).send({ success: true });
    } catch (error) { res.status(400).send(error?.message); }    
});

router.get('/shuffle', async (req, res) => {
    try {
        const { player } = await getMusic(req.params.id, req.query.key);

        player.q.shuffle();

        res.status(200).send({ success: true });
    } catch (error) { res.status(400).send(error?.message); }    
});

router.get('/stop', async (req, res) => {
    try {
        await validateGuildManager(req.query.key, req.params.id);

        const { player } = await getMusic(req.params.id, req.query.key);
        await player.stop();

        res.status(200).send({ success: true });
    } catch (error) { res.status(400).send(error?.message); }
});

async function getMusic(guildId: string, key: any) {
    const { id } = await auth.getUser(key);

    const user = bot.users.cache.get(id);
    const guild = bot.guilds.cache.get(guildId);
    const member = guild.members.cache.get(id);

    const savedUser = await users.get(user);

    return {
        player: music.joinAndGetPlayer(member.voice.channel),
        hasPremium: savedUser.premium
    };
}
