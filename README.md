# 2PG - Simple, powerful Discord bot
Simple multi-purpose Discord bot made with TypeScript-> https://2pg.xyz

[![Discord](https://img.shields.io/discord/685862664223850497?color=46828d&label=Support&style=for-the-badge)](https://discord.io/twopg)

2PG Bot Series - https://www.youtube.com/watch?v=rYpR0CiEGgk&list=PLGfT2ttRbfixMStpAhPD4pKBQN9wjJmbP&index=1

2PG Dashboard Series - https://www.youtube.com/watch?v=rYpR0CiEGgk&list=PLGfT2ttRbfizIr60zU_S_6_i8O3xmP9ia&index=1

**Dashboard**: https://github.com/theADAMJR/2PG-Dashboard

![2PG Avatar](https://i.ibb.co/h2BjCJh/2pg-smol.png)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8d6c9610e0eb4ae5a4045ab3b92f80bc)](https://www.codacy.com/manual/ADAMJR/2PG?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=theADAMJR/2PG&amp;utm_campaign=Badge_Grade)

## Config
`.env` example:
```.env
BOT_TOKEN=""
BOT_ID=""
CLIENT_SECRET=""
OWNER_ID=""

STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
GUILD_ID=""

API_URL="http://localhost:3000/api"
DASHBOARD_URL="http://localhost:4200"
MONGO_URI="mongodb://localhost/2PG"
PORT="3000"

PREMIUM_ROLE_ID=""
FEEDBACK_CHANNEL_ID=""

VOTE_CHANNEL_ID="788001309197860874"
TOP_GG_AUTH=""
DBOTS_AUTH=""
```

## Redirect URIs
![Redirects](https://i.ibb.co/9pbfVwL/updated-redirects.png)

## Start the Bot
- `npm start` to start the bot, and Lavalink
- Remember to have a local MongoDB database running `mongod`
- Have Lavalink.jar running - `npm run start:music` or `java -jar Lavalink.jar`
