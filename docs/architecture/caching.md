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

There are several pieces of "Abroadwith" data that need to be fetched and cached for some period of time. In most cases, these datasets are needed for each session initialisation request.

The methodology for fetching this data varies a bit, but the methodology for storing is consistent across: data is fetched as needed and stored inside the `build` directory, typically inside its own directory - eg `course-data` and `currency-rates`. Each piece of data is stored as `thing.json` and is accompanied by `thing.lock`, which is a lockfile containing a timestamp (the expiration date of the data). Each time the data is fetched, the lockfile is checked to ensure the data is still fresh. If it's not, it is refetched.

#### Currency Rates

There is a separate repository, [currency-exchange-rates](https://bitbucket.org/abroadwith/currency-exchange-rates), which is a very simple script that fetches data once per day from [OpenExchangeRates](https://openexchangerates.org/) and writes it to [one of our S3 buckets](https://console.aws.amazon.com/s3/buckets/abroadwith-currency-exchange-rates/?region=eu-central-1&tab=overview).

All Abroadwith applications then consume currency conversion rates from this bucket, ensuring rates are consistent across the whole platform. In the past, different Abroadwith services consumed data from OpenExchangeRates directly, which resulted in small (1-2 cent) discrepancies if far enough apart in time - exchange rates change, after all.

Now we have set rates across the entire platform for each calendar day. In the above linked S3 bucket, today's rates are called `latest.json`, and all previous days are stored as `YYYY-MM-DD.json`.

#### Course Cities

To prepopulate location selection for course search, instead of allowing open-world searching, we need to keep track of all the cities we offer courses in. This information comes from Solr.

#### Course Languages

To prepopulate language selection for course search, instead of allowing searching across all languages, we need to keep track of all the languages we offer courses in. This information comes from Solr.
