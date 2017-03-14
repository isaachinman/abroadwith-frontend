# Caching

Caching is one of the easiest ways to improve performance. There are several places inside this application where caching is used.

## Functional components

Any functional component can benefit from caching. That's just the nature of a pure function. `moize` is a great library for memoising functions and is used in the codebase here. For example, certain parts of `react-dates` are absolutely dependent on memoisation for baseline acceptable performance (see [this issue](https://github.com/airbnb/react-dates/issues/272#issuecomment-277967375) for more info).

## ExpressJs and SSR pages

For any user that is logged in, their session initialisation request is going to result in a custom page, with markup, redux state, and UI specifically related to that user and their data.

However, visitors that are logged out all receive the same content. This means we can benefit from caching.

If you take a look in `src/helpers/serverCache.js`, you will see a very basic implementation of an in-memory cache, with a list of routes to cache at the bottom. There are two special things going on: (1) only deliver cached content to logged-out users, (2) make sure the user is on the right locale site. Besides that it's really straightforward.

This in memory cache helps us achieve TTFB of ~25ms in production for "public" pages.

## Abroadwith Data

TODO

#### Currency Rates

TODO

#### Course Cities

TODO

#### Course Languages

TODO
