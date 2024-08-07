# Discord Wallet Tracker

## Steps

```sh
git clone https://github.com/elvisxbt/discord-wallet-tracker.git
cd discord-wallet-tracker
npm install
```

Create a `.env` file and add your discord bot token to DISCORD_TOKEN
Get a wss from alchemy and add it your PROJECT_ID
(whichever chain you choose for your websocket will ge the chain your're monitoring)

Go to the discord.js docs if you don't know how to invite a bot to your server
```sh
npm start
```

To start monitoring addresses, use this command:
```plaintext
!monitor <ethereum_address>


    