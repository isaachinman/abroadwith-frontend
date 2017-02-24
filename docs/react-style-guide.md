# React Style Guide

## Separate folder per UI component

* Place each major UI component along with its resources in a separate folder
  This makes easier to find related resources for any particular UI
  element (CSS, images, unit tests, localisation files etc.).
* Avoid having CSS, images and other resource files shared between multiple components.
  This will make the code more maintainable, easy to refactor.
* Add component to `src/components/index.js`. This file is an index of all components,
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


## Use CSS Modules

* Use CSS Modules
  This will allow using short CSS class names and at the same time avoid conflicts.
* Keep CSS simple and declarative. Avoid loops, mixins etc.
* Feel free to use variables in CSS via [precss](https://github.com/jonathantneal/precss) plugin for [PostCSS](https://github.com/postcss/postcss)
* Prefer CSS class selectors instead of element and `id` selectors (see [BEM](https://bem.info/))
* Avoid nested CSS selectors (see [BEM](https://bem.info/))
* When in doubt, use `.root { }` class name for the root elements of your components

```scss
// Component.scss
@import '../variables.scss';

.root {
  width: 300px;
}

.items {
  margin: 0;
  padding: 0;
  list-style-type: none;
  text-align: center;
}

.item {
  display: inline-block;
  vertical-align: top;
}

.link {
  display: block;
  padding: 0 25px;
  outline: 0;
  border: 0;
  color: $default-color;
  text-decoration: none;
  line-height: 25px;
  transition: background-color .3s ease;

  &,
  .items:hover & {
    background: $default-bg-color;
  }

  .selected,
  .items:hover &:hover {
    background: $active-bg-color;
  }
}
```

```jsx
// Component.js
import React, { PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Component.scss'

function Component() {
  return (
    <nav className={`${s.root} ${this.props.className}`}>
      <ul className={s.items}>
        <li className={`${s.item} ${s.selected}`}>
          <a className={s.link} href="/products">Products</a>
        </li>
        <li className={s.item}>
          <a className={s.link} href="/services">Services</a>
        </li>
      </ul>
    </nav>
  )
}

Navigation.propTypes = { className: PropTypes.string }

export default withStyles(Navigation, s)
```
