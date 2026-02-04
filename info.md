# Layout Card Improved

Enhanced version of layout-card with sections and custom CSS support.

## New Features

### 1. Section-Based Grid Layout
Visible grid sections in edit mode with auto-detection from grid-template-areas. Each section displays with headers and placeholders, making layout organization intuitive.

### 2. Custom CSS Injection
Direct CSS control via `layout.custom_css` property. Style your dashboards with complete freedom.

### 3. Dual-Run Compatible
All elements use `-improved` suffix to avoid conflicts with stock layout-card. Run both versions simultaneously!

## Card Types

- `custom:layout-card-improved` - Main layout card
- `custom:grid-layout-improved` - Grid layout view
- `custom:masonry-layout-improved` - Masonry layout view
- `custom:horizontal-layout-improved` - Horizontal layout view
- `custom:vertical-layout-improved` - Vertical layout view
- `custom:gap-card-improved` - Gap spacing card
- `custom:layout-break-improved` - Layout break card

## Quick Example

```yaml
type: custom:grid-layout-improved
layout:
  grid-template-columns: 1fr 1fr
  grid-gap: 16px
  custom_css: |
    #root {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
cards:
  - type: entities
    entities:
      - light.living_room
```

## Documentation

- [HACS Installation Guide](https://github.com/Stormsys/lovelace-layout-card-improved/blob/cursor/dashboard-grid-layout-css-9632/HACS_INSTALLATION.md)
- [Grid Sections Usage](https://github.com/Stormsys/lovelace-layout-card-improved/blob/cursor/dashboard-grid-layout-css-9632/GRID_SECTIONS_USAGE.md)
- [Dual Run Guide](https://github.com/Stormsys/lovelace-layout-card-improved/blob/cursor/dashboard-grid-layout-css-9632/DUAL_RUN_GUIDE.md)

## Important Notes

1. **Clear browser cache** after installation
2. Use `-improved` suffix for all card types
3. Compatible with Home Assistant 2021.10.0+
4. Can run alongside stock layout-card

## Support

Report issues at: https://github.com/Stormsys/lovelace-layout-card-improved/issues
