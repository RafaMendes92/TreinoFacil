@echo off
cd /d "%~dp0"
call npm install
node server.js
