### Electricity status bot
The bot monitors the power sourse and when it changes it sends a message to a telegram chat informing you about electricity situation in your house.

At the moment, the bot only runs on Macs.

P.S. PRs with Linux/Windows support are welcome. Would be cool to run it on a Raspberry Pi

## How to use
  - create a bot in the telegram (search for @BotFather and send `/start`)
  - copy the bot's HTTP API key to the `.env` file
  - go to https://web.telegram.org/, login and create a new group chat
  - open the chat and in the URL find the chatId (e.g. -123456789)
  - copy chatId to the `.env` file
  - run `bash start.sh` in the root directory
