#!/bin/bash
echo "Daemon PID: "+ $$;
while true
do
  timestamp=$(date);
  echo $timestamp ": Starting server.";
  npm run start >> server.log;
  timestamp=$(date);
  echo $timestamp ": Server was killed here."
done
echo $timestamp ": This should never come.";
