# 2PG - Simple, powerful Discord bot
Simple multi-purpose Discord bot made with TypeScript-> https://2pg.xyz

**Dashboard**: https://github.com/theADAMJR/2PG-Dashboard

![2PG Avatar](https://i.ibb.co/h2BjCJh/2pg-smol.png)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8d6c9610e0eb4ae5a4045ab3b92f80bc)](https://www.codacy.com/manual/ADAMJR/2PG?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=theADAMJR/2PG&amp;utm_campaign=Badge_Grade)

## Config
`config.json` example:
```
{
    "bot": {
        "token": "yourBotToken",
        "secret": "yourClientSecret",
        "ownerId": "",
        "activity": "2PG.xyz",
        "id": "discordBotId"
    },
    "api": {
        "port": "3000",
        "url": "https://2pg.xyz/api",
        "stripeSecretKey": "sk_test_..."
    },
    "guild": {
        "id": "599596068145201152",
        "premiumRoleId": "598565371162656788"
    },
    "dashboardURL": "https://2pg.xyz",
    "mongoURL": "mongodb://localhost/2PG"
}
```

## Redirect URIs
![Redirects](https://i.ibb.co/9pbfVwL/updated-redirects.png)

## Start the Bot
- `npm start` to start the bot, and Lavalink
- Remember to have a local MongoDB database running `mongod`
- Have Lavalink.jar running - `npm run start:music` or `java -jar Lavalink.jar`

## Troubleshooting
- Open an issue, if you find any bugs or have any suggestions etc.
- You can also join the [2PG Discord](https://discord.gg/24tycau) if you need extra support.

## Debugging with VSCode (Windows)
* `F5` -> start
* `Shift + F5` -> stop
* `Ctrl + Shift + B` -> run build task
* `F9` -> toggle breakpoint
* `F10` -> step over
* `F11` -> step into
* `Shift + F11` -> step out
