
ps -e | grep node | grep -v grep | awk '{print $1}' | xargs kill -9 && node app
