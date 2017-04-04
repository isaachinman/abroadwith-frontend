# React Style Guide

## Separate folder per UI component

* Place each major UI component along with its resources in a separate folder
  This makes easier to find related resources for any particular UI
  element (CSS, images, unit tests, etc.).
* Avoid having CSS, images and other resource files shared between multiple components.
  This will make the code more maintainable, easy to refactor.
* Add component to `src/components/index.js`. This file is an index (entry point) of all components,
  which allows for easy importing. Ie: `import { CounterButton, InfoBar } from 'components'`.
  (NOTE: unless tree-shaking is in place, such a practice forces imports regardless of actual usage and undermines codesplitting)

For more information google for [component-based UI development](https://google.com/search?q=component-based+ui+development).

## Preference to functional components

* Prefer using stateless functional components whenever possible.
  Components that don't use state are better to be written as simple pure functions.
* Some people refer to this pattern as "smart" vs "dumb" components.
  Component trees are *much* easier to test if state is kept as high up as possible,
  and children components are kept as "dumb", merely rendering out props and never
  dealing with state.
* "Dumb" components can still effect changes by either calling a Redux action,
  or calling a function that has been passed to them as a prop, and executes in some
  parent scope.
* i18n is used throughout for translations, and requires actual React components to be able to do so,
  so writing a normal function that returns JSX is in most cases not possible. Just use components without state
  as much as possible.

**Important:** if a component does not require state, it should be written as a
pure function. If a stateless component also requires connect or asyncConnect,
the `compose` method (or some other method, eg `translate`) must be used instead of class
decorators. Stateful components can be written as classes.
