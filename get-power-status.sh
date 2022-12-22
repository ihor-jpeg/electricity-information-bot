#!/bin/bash

drawing_from_battery="Battery Power"
is_battery_power=false

echo -e "Watching for the power source...\n"

while :
  do
    status=$(pmset -g batt)

    if [[ "$status" == *"$drawing_from_battery"* ]];
      then
        current_status=true
      else
        current_status=false
    fi

    if [[ "$is_battery_power" != "$current_status" ]];
      then
        curl -s -o /dev/null -X POST localhost:9000 -H "Content-Type: application/json" -d \
          '{"isBatteryPower":"'$current_status'"}'

        echo -e "$(date '+%H:%M %d-%m-%Y') Device is charging: $is_battery_power\n"

        is_battery_power=$current_status
    fi

    sleep 1
  done
