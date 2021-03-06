# JavaScript Style Guide

## ESLint

This project uses [ESLint](http://eslint.org/) to lint JavaScript.
The linting rules in place are relatively strict, and opinionated.

All ESLint rules can be found in the `eslintConfig` object inside the top-level `package.json`.

## Usage

Linting should be wrapped into a pre-commit hook with git.
This means that you _cannot_ commit code to the repository unless it maintains
proper styling.

Requiring strict linting like this sets a foundation for a codebase that is
touched by multiple developers but is not chaotic and messy.
Requiring uniformity in this case is a good thing.

To run linting manually, simply do `npm run lint`.
ESLint is capable of automatically fixing _some_ errors.
If you have a lot of simple errors (eg extra-semicolon), you can run `npm run lint -- --fix`.

## AirBnb Style Guide

This project extends the [AirBnb ESLint Config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb).

AirBnb describes their linting rules as "a mostly reasonable approach to JavaScript".
The rules are relatively uncontroversial, and provide a good foundation for any style guide.

## No Semicolons

This is probably the most opinionated and controversial aspect of Abroadwith's JavaScript style guide.

Two points to be made:
1. JavaScript has Automatic Semicolon Insertion built in.
2. All non-Node-related JavaScript in this project is transpiled from ES6/ES7 to ES5 by Babel, which also has automatic semicolon insertion.

Point #1 is enough to convince some people to stop using semicolons altogether.

Point #1 in conjunction with point #2 means that as far as this project is concerned,
semicolons are not necessary, and indeed not even helpful.

If the person reading this has replaced me and feels strongly about semicolons,
just change the ESLint rule and run linting with a fix argument; everything will
automatically be converted.

## camelCase

In every way possible, things should be named clearly. If a module exports a function called `doFourThings`, it should be called `doFourThings.js`. Always use camelCase.

(The docs are not named camelcase, I know. They aren't JavaScript.)
