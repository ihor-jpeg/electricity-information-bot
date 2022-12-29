# Electricity status bot
The bot monitors the power sourse and when it changes it sends a message to a telegram chat/channel informing you about electricity situation in your house.

## Equipment
  - Raspberry Pi
  - USB to TTL converter
  - Powerbank for the Pi
  - 3G/4G USB modem
  - Charger with 2 USB ports
  - 2 jumper wires (F/F)

## Assembly
  - Follow the scematics (file inside root dir)
  - Connect 3.3V cable from TTL converter to GPIO 18 pin on the Pi (google the pinout for your Pi version)
  - Connect the ground pin to any GND pin on the Pi

## How to use
  - create a bot in the telegram (search for @BotFather and send `/start`)
  - copy the bot's HTTP API key to the `.env` file
  - go to https://web.telegram.org/, login and create a new group chat/channel
  - open the chat and in the URL find the chatId (e.g. -123456789)
  - (!!!) if you decided to go with the channel and not chat, you might need to prefix the channel ID with 100 (e.g. -123456789 -> -100123456789)
  - copy chatId/channelId to the `.env` file
  - run `bash start.sh` in the root directory
  - to test, simply plug/unplug your charger

## Notes
  - it might take a few seconds for the TTL converter to completely power off
  - make the `start.sh` script run on boot
    - create a file `BlackoutStatus.service` in `/etc/systemd/system/` with the following content. 
    ``[Service]
        WorkingDirectory=<ABSOLUTE-PATH-TO-PROJECT-ROOT-DIR>
        ExecStart=bash <ABSOLUTE-PATH-TO-PROJECT-ROOT-DIR>/start.sh
        Restart=always
        StandardOutput=syslog
        StandardError=syslog
        SyslogIdentifier=blackoutStatus
        User=root
        Group=root
        Environment=NODE_ENV=production
        [Install]
        WantedBy=multi-user.target``
    - run `sudo chmod u+rwx /etc/systemd/system/propanel.service`
    - enable service `sudo systemctl enable blackoutStatus`
    - reboot `sudo reboot`
