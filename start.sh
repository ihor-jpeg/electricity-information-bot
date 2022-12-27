#!//bin/bash

BUILD_DIR=./dist
MODULES_DIR=./node_modules

if ! [ -d "$MODULES_DIR" ];
  then
      echo -e "Node modules not found. Installing...\n"
      npm i --silent
  fi

if ! [ -d "$BUILD_DIR" ];
  then
      echo -e "Building project...\n"
      npm run build --silent
      echo -e "Build done\n"
  fi

echo " -------------------------------- "
echo "| To stop the bot press CTRL + C |"
echo -e " -------------------------------- \n"

npm start --silent &
bash ./chack-status.sh
