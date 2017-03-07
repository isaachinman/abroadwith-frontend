# Performance

## Introduction

The main goal of this application is to be as performant as possible.
This entails two separate concerns: (1) performance of code operations themselves,
and (2) size of total codebase.

The first concern is one common to all software projects, and the second concern
is one common to all clientside implementations; all JavaScript has to be downloaded
by each client. Caching can mitigate some bandwidth concerns, but having
multi-megabyte pages is unacceptable.

## Performance Engineering with React

Most of the time, React will take care of efficient DOM diffs for you without any special consideration. Sometimes, though, you might find yourself with a particularly unperformant component or hierarchy of components.

In that case, the best place to start is with [react-addons-perf](https://www.npmjs.com/package/react-addons-perf). You can read more about the process [here](http://benchling.engineering/performance-engineering-with-react/).

Unless you have a noticeable performance hit, anything more than optimising `shouldComponentUpdate` is probably a needless micro-optimisation.

## Codesplitting

If you are unfamiliar with the concept of codesplitting, you can start by reading [this](https://webpack.github.io/docs/code-splitting.html).

Via Webpack, codesplitting has been implemented. It's a good idea to set breakpoints on routes themselves, as they represent as logical a divide as anything else. This is
done via `require.ensure`, and can be mainly seen in src/routes.

## Memoisation

Sometimes, functions are called frequently/regularly enough to warrant memoisation. Really, any pure function can benefit from memoisation, and a lot of the components in this project are pure.

Despite that, I haven't gone crazy with memoisation.

## Error Handling

TODO: Write about winston transport to S3 bucket with /clientside-error endpoint etc
NB: Importance of adhering to SUCCESS and FAIL suffixes
