#!/bin/bash

GPIO=18

if [ ! -d /sys/class/gpio/gpio${GPIO} ]; then
        echo "${GPIO}" > /sys/class/gpio/export
fi

echo -e "Watching the power source...\n"

HOST="www.google.com"
POWER_VALUE="$(</sys/class/gpio/gpio"${GPIO}"/value)"
INTERNET_VALUE=0

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
        echo $POWER_VALUE
        echo $CURRENT_POWER_STATUS
        echo "------"
        if [[ "$POWER_VALUE" != "$CURRENT_POWER_STATUS" || "$INTERNET_VALUE" != "$CURRENT_INTERNET_STATUS" ]]; then
                curl -s -o /dev/null -X POST localhost:9000 -H "Content-Type: application/json" -d \
                '{"powerStatus":"'$CURRENT_POWER_STATUS'","internetStatus": "'$CURRENT_INTERNET_STATUS'"}'

                echo -e "$(date '+%H:%M %d-%m-%Y') Status -> power: $CURRENT_POWER_STATUS, internet: $CURRENT_INTERNET_STATUS\n" >> ./logs/power-status.logs.txt

                POWER_VALUE=$CURRENT_POWER_STATUS
                INTERNET_VALUE=$CURRENT_INTERNET_STATUS
        fi

        sleep 1
done
