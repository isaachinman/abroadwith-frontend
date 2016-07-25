# Performance

## Introduction

The main goal of this application is to be as performant as possible at client-level.
This entails two separate concerns: (1) performance of code operations themselves,
and (2) size of total codebase.

The first concern is one common to all software projects, and the second concern
is one common to all clientside implementations; all JavaScript has to be downloaded
by each client. Caching can mitigate some bandwidth concerns, but having
multi-megabyte pages is unacceptable.
