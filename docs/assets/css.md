# CSS Guide

## Current note

Styling may actually be one of the weakest parts of this project. I never really decided upon a uniform way to achieve styles.

Styling is currently spread across `css` files, `scss` files, normal inlined React styles, and some Radium styles here and there. Not ideal, but would also be relatively easy to consolidate given some motivation. There are many solutions to chose from, but locally-scoped [css-modules](https://github.com/css-modules/css-modules) is probably the most stable and long-term choice.

Some more information about my intended direction with css-modules can be found in the [react-style-guide](./react-style-guide.md).

## Death of CSS/SCSS/LESS

[CSS is dead](https://css-tricks.com/the-debate-around-do-we-even-need-css-anymore/). This project uses a custom Bootstrap theme for basic styling.
Any further customization will happen via inline styles.

## File structure

If custom styles are desired for a component, simply create a styles object in the same directory:

```
|-- Component
|   |__ Component.js
|   |__ Component.styles.js
```

The styles file should look like this:

```
export default {
  fontSize: `1rem`,
  color: `black`,
}
```
