# Native Sections in Grid Layout

## What You Want

You want **native HA sections** (with full drag-and-drop) positioned in a **CSS Grid** instead of stacked vertically.

## The Configuration You Envision

```yaml
type: custom:grid-layout-improved
title: Main
layout:
  grid-template-columns: 300px 1fr 300px
  grid-template-rows: auto 1fr
  grid-template-areas: |
    "header header header"
    "sidebar main right-panel"
sections:
  - type: grid
    title: Sidebar
    grid_area: sidebar  # Position this section here
    cards:
      - type: custom:bubble-card
        card_type: button
        button_type: state
        entity: light.living_room
      # Drag and drop works within this section!
  
  - type: grid
    title: Main Area
    grid_area: main  # Position this section here
    cards:
      - type: weather-forecast
        entity: weather.home
      # Drag and drop works!
  
  - type: grid
    title: Right Panel
    grid_area: right-panel  # Position this section here
    cards:
      - type: entities
        entities:
          - sensor.temperature
      # Drag and drop works!

# Optional: Loose cards (appear at bottom in edit mode)
cards:
  - type: button
    entity: light.test
    # This card appears in "Unassigned Cards" at bottom in edit mode
  - type: entities
    entities: [sensor.test]
    # Drag these into sections!
```

## How It Works

1. **Each section** is a native `hui-section` with full HA functionality
2. **Drag-and-drop** works within each section
3. **Sections are positioned** in the CSS Grid at their assigned `grid_area`
4. **No manual card assignment** needed - sections manage their own cards
5. **Auto-created empty sections** - all grid areas get sections automatically!

### Auto-Creation of Empty Sections

If you define `grid-template-areas` but don't configure all sections, empty sections are **automatically created** in edit mode:

```yaml
layout:
  grid-template-areas: |
    "header header"
    "sidebar main"
    "footer footer"
sections:
  - type: grid
    title: Main
    grid_area: main
    cards: [...]
  # sidebar, header, footer sections auto-created!
```

All grid areas will be visible in edit mode, even if you haven't configured them yet. This makes it easy to see your layout structure and start dragging cards into position!

## Current Status

**FULLY IMPLEMENTED!** ✅

The code now:
- ✅ Accepts `sections:` configuration
- ✅ Creates native `hui-section` elements
- ✅ Positions them via `grid_area`
- ✅ Full drag-and-drop within sections
- ✅ Visual edit mode indicators
- ✅ Grid area labels in corners
- ✅ Dashed borders in edit mode
- ✅ Hover effects for clarity

## Example Layouts

### Sidebar + Main (Minimal Config)

```yaml
type: custom:grid-layout-improved
layout:
  grid-template-columns: 250px 1fr
  grid-template-areas: |
    "sidebar main"
# That's it! Both sections auto-created in edit mode.
# Add cards by dragging from loose cards at bottom!
```

### Or With Initial Content

```yaml
type: custom:grid-layout-improved
layout:
  grid-template-columns: 250px 1fr
  grid-template-areas: |
    "sidebar main"
sections:
  - type: grid
    title: Controls
    grid_area: sidebar
    cards:
      - type: button
        entity: light.all_lights
  # "main" section auto-created!
```

### Header + Three Columns

```yaml
type: custom:grid-layout-improved
layout:
  grid-template-columns: 1fr 1fr 1fr
  grid-template-rows: 80px 1fr
  grid-template-areas: |
    "header header header"
    "left center right"
sections:
  - type: grid
    title: Header
    grid_area: header
    cards:
      - type: markdown
        content: "# My Dashboard"
  
  - type: grid
    title: Lights
    grid_area: left
    cards:
      - type: entities
        entities: [light.living_room]
  
  - type: grid
    title: Climate
    grid_area: center
    cards:
      - type: thermostat
        entity: climate.home
  
  - type: grid
    title: Security
    grid_area: right
    cards:
      - type: alarm-panel
        entity: alarm_control_panel.home
```

## Benefits Over Old Approach

**Old (Fake) Sections:**
- ❌ No drag-and-drop
- ❌ Manual card assignment via YAML
- ❌ Just visual containers
- ❌ Not integrated with HA

**New (Native) Sections:**
- ✅ Full drag-and-drop
- ✅ Native HA functionality
- ✅ Section badges support
- ✅ All native section features
- ✅ Cards managed by sections, not manual grid_area

## Migration from Old Config

**Before (old approach):**
```yaml
type: custom:grid-layout-improved
layout:
  grid-template-areas: |
    "sidebar main"
cards:
  - type: entities
    entities: [light.room]
    view_layout:
      grid_area: sidebar  # Manual assignment
```

**After (native sections):**
```yaml
type: custom:grid-layout-improved
layout:
  grid-template-areas: |
    "sidebar main"
sections:
  - type: grid
    title: Sidebar
    grid_area: sidebar
    cards:
      - type: entities
        entities: [light.room]
      # Drag and drop works!
```

## Visual Edit Mode

In edit mode, you'll see:
- **Dashed border** around each section (blue by default)
- **Grid area label** in top-right corner showing the section's position
- **Hover effects** - border and label change to accent color when hovering
- **Light background tint** to distinguish sections
- **Loose cards container** at the bottom (orange border) for unassigned cards
- **Clean appearance** in normal mode - no borders, labels, or loose cards

### Loose Cards (Unassigned Cards)

Just like native sections view, if you have cards at the view level (not in any section), they appear at the bottom in edit mode:

- **Orange dashed border** to distinguish from regular sections
- **"Unassigned Cards"** header with helpful subtitle
- **Grid layout** of loose cards
- **Draggable** into sections above
- **Only visible in edit mode** - hidden in normal view

This makes it easy to organize cards by dragging them from the loose cards area into your sections!

The visual indicators make it crystal clear which section is which and where they're positioned in your grid!

## This Is Exactly What You Asked For!

> "I literally want type: sections with each section grid assigned to a grid-view-layout position"

That's exactly what this does! Each section:
1. Is a native HA section (with all features)
2. Gets positioned at a grid area
3. Has full drag-and-drop
4. Manages its own cards

No more manual `view_layout.grid_area` assignments. No more fake sections. Just native HA sections positioned in a CSS Grid!
