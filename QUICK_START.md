# Quick Start Guide - Layout Card Improved

## Installation (5 minutes)

### 1. Add to HACS
- HACS → Frontend → ⋮ (menu) → Custom repositories
- Add: `https://github.com/Stormsys/lovelace-layout-card-improved`
- Category: `Lovelace`

### 2. Install
- Search "Layout Card Improved" in HACS
- Click Download/Install
- Restart Home Assistant

### 3. Add Resource
- Settings → Dashboards → Resources → Add Resource
- URL: `/hacsfiles/lovelace-layout-card-improved/layout-card-improved.js`
- Type: JavaScript Module

### 4. Clear Browser Cache
- **Ctrl + Shift + R** (or Cmd + Shift + R on Mac)

## Usage Examples

### As a View Layout

Edit view → View type → Select "Grid (layout-card-improved)"

```yaml
type: custom:grid-layout-improved
layout:
  grid-template-columns: repeat(3, 1fr)
  grid-gap: 16px
  custom_css: |
    #root { padding: 16px; }
cards:
  - type: entities
    entities:
      - light.living_room
```

### With Sections (Edit Mode)

```yaml
type: custom:grid-layout-improved
layout:
  grid-template-areas: |
    "header header"
    "sidebar main"
  sections:
    header: { grid_area: header }
    sidebar: { grid_area: sidebar }
    main: { grid_area: main }
cards:
  - type: markdown
    content: "Header"
    view_layout:
      grid_area: header
  - type: entities
    entities: [light.living_room]
    view_layout:
      grid_area: sidebar
```

### Custom CSS Examples

```yaml
layout:
  custom_css: |
    /* Gradient background */
    #root {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    /* Section styling */
    .grid-section.edit-mode {
      border-color: var(--primary-color);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    /* Card animations */
    #root > * {
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
```

## Card Types

All use `-improved` suffix:

| Type | Usage |
|------|-------|
| `custom:layout-card-improved` | Main card |
| `custom:grid-layout-improved` | Grid view |
| `custom:masonry-layout-improved` | Masonry view |
| `custom:horizontal-layout-improved` | Horizontal view |
| `custom:vertical-layout-improved` | Vertical view |
| `custom:gap-card-improved` | Spacing |
| `custom:layout-break-improved` | Break flow |

## Troubleshooting

**Cards not showing?**
1. Clear browser cache (Ctrl+Shift+R)
2. Check resource is loaded in Dev Tools → Network
3. Verify URL: `/hacsfiles/lovelace-layout-card-improved/layout-card-improved.js`

**Sections not visible?**
- Use `custom:grid-layout-improved` (not `grid-layout`)
- Enter edit mode on the view
- Define `grid-template-areas` in layout

**CSS not applying?**
- Use `|` for multiline in YAML
- Place under `layout:` section
- Check browser console for syntax errors

## Full Documentation

- [Complete Installation Guide](HACS_INSTALLATION.md)
- [Grid Sections Features](GRID_SECTIONS_USAGE.md)
- [Dual-Run Compatibility](DUAL_RUN_GUIDE.md)

## Support

Issues: https://github.com/Stormsys/lovelace-layout-card-improved/issues
