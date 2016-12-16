# Performance

## Introduction

The main goal of this application is to be as performant as possible.
This entails two separate concerns: (1) performance of code operations themselves,
and (2) size of total codebase.

The first concern is one common to all software projects, and the second concern
is one common to all clientside implementations; all JavaScript has to be downloaded
by each client. Caching can mitigate some bandwidth concerns, but having
multi-megabyte pages is unacceptable.

Using Webpack, codesplitting has been implemented. It's a good idea to set breakpoints
on routes themselves, as they represent as logical a divide as anything else. This is
done via require.ensure, and examples can be see in src/routes.
