# React Style Guide

## Separate folder per UI component

* Place each major UI component along with its resources in a separate folder
  This makes easier to find related resources for any particular UI
  element (CSS, images, unit tests, localization files etc.).
* Avoid having CSS, images and other resource files shared between multiple components.
  This will make the code more maintainable, easy to refactor.
* Add component to `src/components/index.js`. This file is an index of all components,
  which allows for easy importing. Ie: `import { CounterButton, InfoBar } from 'components'`.

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

```jsx
// Bad
class Navigation extends Component {
  static propTypes = { items: PropTypes.array.isRequired }
  render() {
    return <nav><ul>{this.props.items.map(x => <li>{x.text}</li>)}</ul></nav>
  }
}

// Better
function Navigation({ items }) {
  return (
    <nav><ul>{items.map(x => <li>{x.text}</li>)}</ul></nav>
  );
}
Navigation.propTypes = { items: PropTypes.array.isRequired }
```

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

## Use higher-order components

* Use higher-order components (HOC) to extend existing React components.
  Here is an example:

```js
// withViewport.js
import React, { Component } from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

function withViewport(ComposedComponent) {
  return class WithViewport extends Component {

    state = {
      viewport: canUseDOM ?
        {width: window.innerWidth, height: window.innerHeight} :
        {width: 1366, height: 768} // Default size for server-side rendering
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize)
      window.addEventListener('orientationchange', this.handleResize)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize)
      window.removeEventListener('orientationchange', this.handleResize)
    }

    handleResize = () => {
      let viewport = {width: window.innerWidth, height: window.innerHeight}
      if (this.state.viewport.width !== viewport.width ||
        this.state.viewport.height !== viewport.height) {
        this.setState({ viewport })
      }
    };

    render() {
      return <ComposedComponent {...this.props} viewport={this.state.viewport}/>
    }

  }
}

export default withViewport
```

```js
// MyComponent.js
import React from 'react'
import withViewport from './withViewport'

class MyComponent {
  render() {
    let { width, height } = this.props.viewport
    return <div>{`Viewport: ${width}x${height}`}</div>
  }
}

export default withViewport(MyComponent)
```
