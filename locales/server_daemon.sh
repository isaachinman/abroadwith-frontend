#!/bin/bash
echo "Daemon PID: "+ $$;
while true
do
  timestamp=$(date);
  echo $timestamp ": Starting server.";
  node server.js;
  timestamp=$(date);
  echo $timestamp ": Server was killed here."
  sleep 10s;
done
echo $timestamp ": This should never come.";

