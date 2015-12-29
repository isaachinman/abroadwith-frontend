#!/bin/bash
echo "Daemon PID: "+ $$;
while true
do
  timestamp=$(date);
  echo $timestamp ": Starting server.";
  npm run start > $($timestamp).log;
  timestamp=$(date);
  echo $timestamp ": Crashed here."
done
echo $timestamp ": This should never come.";
