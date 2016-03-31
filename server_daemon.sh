#!/bin/bash
echo "Daemon PID: "+ $$;
while true
do
  timestamp=$(date);
  echo $timestamp ": Starting server.";
  npm run start;
  timestamp=$(date);
  echo $timestamp ": Server was killed here."
  sleep 5s;
done
echo $timestamp ": This should never come.";
