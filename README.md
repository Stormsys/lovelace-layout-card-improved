# Sections Grid Layout

> **Alpha** — this is pre-release software. APIs, element names, and YAML keys may change before v1.0. Test on a non-production HA instance.

A Home Assistant Lovelace **view** plugin that places native HA sections into a CSS Grid.

Requires **Home Assistant 2024.2+** (when native Sections views were introduced).

---

## What it does

Home Assistant's built-in Sections view arranges sections in a simple responsive column grid. This plugin replaces that with a full CSS Grid, letting you:

- Define a `grid-template-areas` layout and assign each section to a named area
- Use `grid-template-columns` / `grid-template-rows` for precise sizing
- Style individual sections with `background`, `backdrop_blur`, `tint`, `zoom`, `padding`, `overflow`, and scoped CSS variables
- Write Jinja-like `{{ states('...') }}` / `{% if %}` expressions inside `custom_css` so the layout responds to entity state
- Set per-view background images (with blur and opacity), also template-evaluated
- Apply responsive overrides via `mediaquery` blocks at both layout and section level
- Define named breakpoints once, reuse everywhere
- Show full-screen animated overlays triggered by entity state
- Run in kiosk mode for wall-mounted dashboards

All sections are standard HA `hui-section` elements — card dragging, the section + button, and the section title editor all work exactly as they do in the native Sections view.

---

## Installation (HACS)

1. Add this repository as a custom HACS repository (type: **Lovelace**)
2. Install **Sections Grid Layout** from HACS
3. Add the resource in Settings → Dashboards → Resources:
   ```
   /hacsfiles/sections-grid-layout/sections-grid-layout.js
   ```

---

## Usage

Set the view type to `custom:sections-grid-layout` and give each section a `grid_area`:

```yaml
title: My View
type: custom:sections-grid-layout
layout:
  grid-template-areas: |
    "header header"
    "left   right"
    "footer footer"
  grid-template-columns: 1fr 2fr
  grid-template-rows: auto 1fr auto
sections:
  - grid_area: header
    type: grid
    cards:
      - type: weather-forecast
        entity: weather.home
  - grid_area: left
    type: grid
    cards:
      - type: entities
        entities:
          - light.living_room
  - grid_area: right
    type: grid
    cards:
      - type: history-graph
        entities:
          - sensor.temperature
  - grid_area: footer
    type: grid
    cards:
      - type: markdown
        content: Last updated {{ now() }}
```

---

## Full `layout` options

| Key | Type | Description |
|---|---|---|
| `grid-template-areas` | string | CSS grid-template-areas value |
| `grid-template-columns` | string | CSS grid-template-columns value |
| `grid-template-rows` | string | CSS grid-template-rows value |
| `place-items` | string | CSS place-items value (align + justify items) |
| `place-content` | string | CSS place-content value (align + justify content) |
| `height` | string | Explicit height for the grid (also enables `overflow-y: auto`) |
| `custom_css` | string | Extra CSS injected into the view; supports Jinja templates |
| `background_image` | string | Background image URL or Jinja template (see below) |
| `background_blur` | string | Blur applied to the background image e.g. `"8px"` (default `"0px"`) |
| `background_opacity` | number | 0-1 opacity for the background image (default `1`) |
| `tint` | string | Semi-transparent background colour on the grid (e.g. `"#00000020"`) |
| `backdrop_blur` | string | CSS blur applied to the grid via `backdrop-filter` e.g. `"10px"` |
| `variables` | object | CSS custom properties injected on `:host` (see below) |
| `breakpoints` | object | Named media queries for reuse (see below) |
| `mediaquery` | object | Responsive overrides (see below) |
| `margin` | string | Outer margin of the grid (default `"0px 4px 0px 4px"`) |
| `padding` | string | Inner padding of the grid (default `"4px 0px 4px 0px"`) |
| `kiosk` | boolean | Fixed-position layout filling the viewport below the header |
| `zoom` | number/string | CSS zoom applied to the entire grid (e.g. `0.9`) |
| `overlays` | list | Full-screen animated notifications triggered by entity state (see below) |

Any CSS grid property (keys starting with `grid` or `place-`) is passed through directly to the grid container.

---

## Per-section options

Each section can have these additional properties alongside `grid_area`, `type`, and `cards`:

| Key | Type | Description |
|---|---|---|
| `scrollable` | boolean | Makes the section scrollable with hidden scrollbars |
| `background` | string | CSS background value (colour, gradient, image) |
| `backdrop_blur` | string | CSS blur value applied as `backdrop-filter` e.g. `"10px"` |
| `zoom` | number/string | CSS zoom applied to this section (e.g. `0.85`) |
| `overflow` | string | CSS overflow value (`hidden`, `auto`, `scroll`, etc.) |
| `padding` | string | Section padding (default `10px` via `--section-padding`) |
| `tint` | string | Semi-transparent background colour (e.g. `"#20293cdd"`) |
| `variables` | object | CSS custom properties scoped to this section (see below) |
| `mediaquery` | object | Per-section responsive overrides (see below) |

```yaml
sections:
  - grid_area: sidebar
    type: grid
    scrollable: true
    background: "rgba(0,0,0,0.2)"
    backdrop_blur: "10px"
    tint: "#20293cdd"
    zoom: 0.9
    variables:
      primary-background-color: none
      secondary-background-color: none
    cards:
      - type: entities
        entities:
          - light.living_room
  - grid_area: header
    type: grid
    padding: "4px 8px"
    overflow: hidden
    variables:
      background-color-2: none
    cards:
      - type: weather-forecast
        entity: weather.home
```

---

## Background images

Set a fixed background image on the entire view. The image is pinned to the viewport and does not scroll with the page content.

```yaml
layout:
  background_image: "/local/images/wallpaper.jpg"
  background_blur: "8px"
  background_opacity: 0.6
  tint: "#00000040"
```

| Key | Type | Default | Description |
|---|---|---|---|
| `background_image` | string | -- | Image URL or Jinja template |
| `background_blur` | string | `"0px"` | Blur applied to the background image element |
| `background_opacity` | number | `1` | Opacity of the background image element |

### Template-evaluated backgrounds

The `background_image` value can contain Jinja templates. The image updates reactively when the referenced entity changes:

```yaml
layout:
  background_image: "{{ state_attr('media_player.living_room', 'entity_picture') }}"
  background_blur: "20px"
  background_opacity: 0.4
```

This is useful for showing album art, camera snapshots, or any entity attribute that returns an image URL.

---

## Tint and backdrop blur

`tint` and `backdrop_blur` can be applied at both the layout level (on `#root`) and per-section (on `.section-container`).

```yaml
layout:
  tint: "#00000020"            # darken the whole view slightly
  backdrop_blur: "6px"         # blur content behind the grid
sections:
  - grid_area: sidebar
    tint: "#20293cdd"          # darker tint on this section
    backdrop_blur: "10px"      # blur content behind this section
```

Both properties are also supported in responsive `mediaquery` blocks at either level.

---

## CSS variables

Define reusable CSS custom properties via `variables`. These are set on `:host` (layout level) or on the `.section-container` (section level) and cascade into all child elements.

### Layout-level variables

Available throughout the entire view -- in `custom_css`, in cards, everywhere:

```yaml
layout:
  variables:
    sidebar-bg: "#20293cdd"
    card-gap: "8px"
  custom_css: |
    .my-card { background: var(--sidebar-bg); }
    #root { gap: var(--card-gap); }
```

### Per-section variables

Scoped to a single section's container. This replaces the need for `card_mod` to override HA theme variables on individual sections:

```yaml
sections:
  - grid_area: header
    type: grid
    zoom: 0.85
    variables:
      background-color-2: none
      secondary-background-color: none
      primary-background-color: none
    cards:
      - type: weather-forecast
        entity: weather.home
```

The variables are set as inline CSS custom properties on the `.section-container` div, so they cascade into all cards within that section -- no `card_mod` needed.

### Variables in media queries

Variables can be overridden per-breakpoint at both levels:

```yaml
layout:
  variables:
    sidebar-bg: "#20293cdd"
  mediaquery:
    "(max-width: 768px)":
      variables:
        sidebar-bg: "#10152080"
sections:
  - grid_area: sidebar
    variables:
      card-padding: "16px"
    mediaquery:
      "(max-width: 768px)":
        variables:
          card-padding: "4px"
```

---

## Kiosk mode

Set `kiosk: true` on the layout to make the grid fill the viewport as a fixed-position overlay (below the HA header). This is useful for wall-mounted dashboards:

```yaml
layout:
  kiosk: true
  zoom: 0.9
  grid-template-areas: |
    "header header"
    "main   sidebar"
    "footer footer"
  grid-template-columns: 2fr 1fr
  grid-template-rows: auto 1fr auto
```

In kiosk mode the grid is pinned to the viewport edges, respecting the HA sidebar width and header height. In edit mode the top offset automatically adjusts to account for the tab bar.

All sections automatically become scrollable in kiosk mode. You can disable kiosk on smaller screens via a mediaquery:

```yaml
layout:
  kiosk: true
  mediaquery:
    "(max-width: 768px)":
      kiosk: false
```

---

## Jinja templates in `custom_css`

```yaml
layout:
  custom_css: |
    {% if is_state('binary_sensor.dark_mode', 'on') %}
    :host { --card-background-color: #1a1a1a; }
    {% endif %}
    #root { gap: {{ states('input_number.card_gap') }}px; }
```

Supported expressions:

| Syntax | Example |
|---|---|
| State value | `{{ states('sensor.temperature') }}` |
| Attribute value | `{{ state_attr('climate.living', 'temperature') }}` |
| Conditional block | `{% if is_state('binary_sensor.x', 'on') %}...{% endif %}` |
| Negative conditional | `{% if not is_state('binary_sensor.x', 'on') %}...{% endif %}` |

Templates are re-evaluated reactively whenever a referenced entity's state changes.

---

## Overlays

Overlays are full-screen animated notifications that appear when an entity reaches a given state -- useful for alerts, reminders, or ambient feedback on a wall dashboard.

```yaml
layout:
  overlays:
    - entity: binary_sensor.motion_hallway
      state: "on"
      content: "Motion"
      animation: pulse
      duration: "3s"
      color: "#ffffff"
      backdrop_blur: "6px"
```

| Key | Type | Default | Description |
|---|---|---|---|
| `entity` | string | -- | Entity whose state is watched |
| `state` | string | `"on"` | State value that triggers the overlay |
| `content` | string | -- | Text or emoji displayed; supports `{{ states('...') }}` and `{{ state_attr('...','...') }}` |
| `animation` | string | `"pulse"` | `pulse` / `fade` / `flash` / `slide-up` / `none` |
| `duration` | string | `"3s"` | How long the animation runs (CSS time value) |
| `color` | string | `white` | Text / icon colour (`--sgl-overlay-color`) |
| `background` | string | -- | Full CSS background for the overlay layer |
| `backdrop_blur` | string | -- | Blur applied behind the overlay e.g. `"6px"` |
| `font_size` | string | `"80px"` | Content font size |
| `text_shadow` | string | -- | CSS text-shadow on the content |
| `z_index` | number | `9999` | Stack order |
| `custom_css` | string | -- | Extra CSS scoped to this overlay; supports Jinja templates |

**`animation: none`** keeps the overlay visible (static) for as long as the entity stays in the target state, then hides it when the state changes.

### Content templates

```yaml
- entity: sensor.doorbell
  state: "ringing"
  content: "{{ state_attr('sensor.doorbell', 'caller') }} is at the door"
  animation: flash
```

### Edit-mode tester

In edit mode a small **Overlays** panel appears in the bottom-right corner with a **Test** button for each overlay, letting you preview the animation without waiting for the real entity to trigger. The panel can be collapsed with the **-** button.

---

## Named breakpoints

Define named breakpoints once and reuse them everywhere -- in `layout.mediaquery` and per-section `mediaquery`:

```yaml
layout:
  breakpoints:
    mobile: "(max-width: 768px)"
    tablet: "(max-width: 1024px)"
  mediaquery:
    mobile:                          # use the name, not the raw query
      grid-template-columns: 1fr
```

Raw query strings still work alongside named breakpoints.

---

## Responsive layouts

Keys under `mediaquery` are CSS media query strings **or named breakpoints**; values are layout overrides applied when the query matches.

### Layout-level `mediaquery`

Supported properties:

| Property | Description |
|---|---|
| `grid-*`, `place-*` | All CSS grid properties |
| `kiosk` | `false` to disable kiosk mode at this breakpoint |
| `zoom` | Override grid zoom |
| `tint` | Override grid tint |
| `backdrop_blur` | Override grid backdrop blur |
| `variables` | Override or add CSS custom properties |
| `custom_css` | Additional CSS (supports Jinja templates) |

```yaml
layout:
  breakpoints:
    mobile: "(max-width: 768px)"
  grid-template-areas: '"left right"'
  grid-template-columns: 1fr 1fr
  tint: "#00000020"
  backdrop_blur: "6px"
  variables:
    sidebar-bg: "#20293cdd"
  mediaquery:
    mobile:
      grid-template-areas: '"left" "right"'
      grid-template-columns: 1fr
      tint: "#00000040"
      backdrop_blur: "0px"
      variables:
        sidebar-bg: "#10152080"
      custom_css: |
        .section-sidebar { display: none; }
```

### Per-section `mediaquery`

Sections can have their own responsive overrides. Properties are applied with `!important` so they override the base inline styles.

Supported properties:

| Property | Description |
|---|---|
| `tint` | Override section tint |
| `padding` | Override section padding |
| `background` | Override section background |
| `backdrop_blur` | Override section backdrop blur |
| `zoom` | Override section zoom |
| `overflow` | Override section overflow |
| `display` | Set to `none` to hide a section |
| `variables` | Override or add section-scoped CSS custom properties |
| `custom_css` | Additional CSS (supports Jinja templates) |

```yaml
layout:
  breakpoints:
    mobile: "(max-width: 768px)"
sections:
  - grid_area: sidebar
    tint: "#20293cdd"
    padding: 16px
    backdrop_blur: "10px"
    variables:
      card-padding: "16px"
    mediaquery:
      mobile:
        tint: "#10152080"
        padding: 4px
        backdrop_blur: "0px"
        display: none
        variables:
          card-padding: "4px"
  - grid_area: main
    mediaquery:
      mobile:
        padding: 0px
        custom_css: |
          .section-main hui-section { --column-count: 1; }
```

---

## Section YAML editor

In edit mode, each section shows a label badge in the bottom-right corner with the grid area name. Click the label to open a YAML editor dialog where you can edit all section properties (except `cards`, which are managed by the normal card editor).

The editor uses Home Assistant's built-in `ha-yaml-editor` when available, falling back to `ha-code-editor` or a plain textarea.

Properties you can set in the editor:

```yaml
grid_area: sidebar
type: grid
title: My Sidebar
scrollable: true
background: "rgba(0,0,0,0.2)"
backdrop_blur: "10px"
tint: "#20293cdd"
zoom: 0.9
padding: "8px"
overflow: hidden
variables:
  primary-background-color: none
mediaquery:
  "(max-width: 768px)":
    display: none
```

---

## Complete example

A wall-dashboard layout combining multiple features:

```yaml
title: Dashboard
type: custom:sections-grid-layout
layout:
  kiosk: true
  zoom: 0.95
  grid-template-areas: |
    "header  header  header"
    "left    main    right"
    "footer  footer  footer"
  grid-template-columns: 250px 1fr 300px
  grid-template-rows: auto 1fr auto
  background_image: "{{ state_attr('media_player.living_room', 'entity_picture') }}"
  background_blur: "20px"
  background_opacity: 0.3
  tint: "#00000060"
  variables:
    card-bg: "rgba(30, 40, 60, 0.8)"
  breakpoints:
    mobile: "(max-width: 768px)"
    tablet: "(max-width: 1200px)"
  mediaquery:
    mobile:
      kiosk: false
      grid-template-areas: |
        "header"
        "main"
        "footer"
      grid-template-columns: 1fr
      grid-template-rows: auto
      backdrop_blur: "0px"
      variables:
        card-bg: "var(--card-background-color)"
    tablet:
      grid-template-areas: |
        "header header"
        "main   right"
        "footer footer"
      grid-template-columns: 1fr 280px
  custom_css: |
    {% if is_state('binary_sensor.dark_mode', 'on') %}
    :host { --card-background-color: var(--card-bg); }
    {% endif %}
  overlays:
    - entity: binary_sensor.doorbell
      state: "on"
      content: "Doorbell"
      animation: pulse
      duration: "4s"
      backdrop_blur: "8px"
sections:
  - grid_area: header
    type: grid
    zoom: 0.85
    padding: "4px 8px"
    variables:
      primary-background-color: none
      secondary-background-color: none
    cards:
      - type: weather-forecast
        entity: weather.home
  - grid_area: left
    type: grid
    scrollable: true
    tint: "#20293cdd"
    backdrop_blur: "10px"
    mediaquery:
      mobile:
        display: none
    cards:
      - type: entities
        entities:
          - light.living_room
  - grid_area: main
    type: grid
    scrollable: true
    mediaquery:
      mobile:
        padding: 0px
        custom_css: |
          .section-main hui-section { --column-count: 1; }
    cards:
      - type: history-graph
        entities:
          - sensor.temperature
  - grid_area: right
    type: grid
    scrollable: true
    background: "rgba(0,0,0,0.15)"
    mediaquery:
      tablet:
        backdrop_blur: "6px"
      mobile:
        display: none
    cards:
      - type: entities
        entities:
          - binary_sensor.front_door
  - grid_area: footer
    type: grid
    padding: "4px"
    variables:
      primary-background-color: transparent
    cards:
      - type: markdown
        content: "Dashboard v1.0"
```

---

## Compatibility with layout-card

Sections Grid Layout and the original [layout-card](https://github.com/thomasloven/lovelace-layout-card) can be loaded at the same time:

- This plugin registers only the `sections-grid-layout` element -- it does not touch masonry, horizontal, or vertical layouts
- The view-type dropdown patch only adds the **Sections Grid** option; layout-card's options are untouched
- The patch guard uses a different flag (`_sectionsGridLayoutPatched`) so both scripts can patch `hui-view-editor` independently without conflict

---

## Migrating from lovelace-layout-card-improved

Replace the view type in your YAML:

| Old | New |
|---|---|
| `custom:grid-layout-improved` | `custom:sections-grid-layout` |

---

## License

MIT -- Author: [Stormsys](https://github.com/Stormsys)

Grid layout engine derived from [lovelace-layout-card](https://github.com/thomasloven/lovelace-layout-card) by Thomas Loven (MIT).
