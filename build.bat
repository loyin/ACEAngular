@echo off
cd client
grunt build
cd ..
cd server 
node server.js
exit