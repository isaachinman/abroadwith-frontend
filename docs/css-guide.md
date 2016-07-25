# CSS Guide

## The death of CSS/SCSS/LESS

(CSS is dead)[https://css-tricks.com/the-debate-around-do-we-even-need-css-anymore/]. This project uses a custom Bootstrap theme for basic styling.
Any further customization will happen via inline styles by way of (PostCss)[https://github.com/postcss/postcss].

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
