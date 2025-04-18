# Scroll Snap Controls

Add navigation buttons to scroll snap container

## How to Use

Install the package from GitHub using npm in your project:

```bash
npm install samhermes/scroll-snap-controls#1.0.0
```

By default, the package looks for an element on the page using `.scroll-snap-container`, and selects the child elements using an `li` selector. The element need to use the following markup structure to support this:

```html
<div class="scroll-snap-container">
    <ul class="scroll-snap-wrapper">
        <li></li>
    </ul>
</div>
```

The package doesn't include any styles out of the box, so you'll need to provide your own. Suggested styles to start with:

```css
.scroll-snap-wrapper {
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
}
```

If you'd like to offset the elements from the edge of the viewport, a combination of `padding` and `scroll-padding` could be used. See the demo for how this could work.

## Settings

If you'd prefer to use your own markup, you can adjust the following settings as needed. Additionally, you can disable the default navigation controls and substitute your own.

| Name               | Default                     | Description                               |
| ------------------ | --------------------------- | ----------------------------------------- |
| `container`        | `.scroll-snap-container`    | Outer element, scroll area.               |
| `elementSelector`  | `.scroll-snap-container li` | Individual elements inside the container. |
| `previousSelector` | `.scroll-snap-nav-previous` | The previous page button.                 |
| `nextSelector`     | `.scroll-snap-nav-next`     | The next page button.                     |
| `addControls`      | `true`                      | Output next and previous buttons.         |