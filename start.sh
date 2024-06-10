#!//bin/bash

BUILD_DIR=./dist
MODULES_DIR=./node_modules

make stop

echo -e "Installing node modules...\n"
npm i --silent

echo -e "Building project...\n"
npm run build --silent
echo -e "Build done\n"

echo " -------------------------------- "
echo "| To stop the service press CTRL + C |"
echo -e " -------------------------------- \n"

npm run prod --silent &

lt --port 9000 --subdomain ihor-gh-webhook-controller &

while true; do
    RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null -X POST localhost:9000 -H "Content-Type: application/json" -d '{}')

    if [ "$RESPONSE" -eq 200 ]; then
        echo "Server responded successfully"
        break
    else
        echo "No response. Retrying in 5 seconds..."
        sleep 5
    fi
done

bash ./check-status.sh
