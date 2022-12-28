#!/bin/bash

HOST="www.google.com"
POWER_VALUE=0
INTERNET_VALUE=0
GPIO=18


echo -e "Watching the power source...\n"

if [ ! -d /sys/class/gpio/gpio${GPIO} ]; then
        echo "${GPIO}" > /sys/class/gpio/export
fi

while true; do
        # read current pin value
        if [ 1 -eq "$(</sys/class/gpio/gpio"${GPIO}"/value)" ]; then
                CURRENT_POWER_STATUS=1
        else
                CURRENT_POWER_STATUS=0
        fi

        if ping -c 1 -I eth0 -W $HOST 1>/dev/null 2>/dev/null; then
                  CURRENT_INTERNET_STATUS=1
        else
                  CURRENT_INTERNET_STATUS=0
        fi

        # send request if value has changed
        if [[ "$POWER_VALUE" != "$CURRENT_POWER_STATUS" || "$INTERNET_VALUE" != "$CURRENT_INTERNET_STATUS" ]]; then
                curl -s -o /dev/null -X POST localhost:9000 -H "Content-Type: application/json" -d \
                '{"powerStatus":"'$CURRENT_POWER_STATUS'","internetStatus": "123"}'

                echo -e "$(date '+%H:%M %d-%m-%Y') Status -> power: $CURRENT_POWER_STATUS, internet: $CURRENT_INTERNET_STATUS\n"

                POWER_VALUE=$CURRENT_POWER_STATUS
                INTERNET_VALUE=$CURRENT_INTERNET_STATUS
        fi

        sleep 1
done
