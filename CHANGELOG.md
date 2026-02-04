# Changelog

## [3.0.0] - 2025-02-04

### Major Features
- **Section-Based Grid Layout**: Grid areas now display as visible sections in edit mode
- **Custom CSS Injection**: Add custom CSS via `layout.custom_css` property
- **Unassigned Cards Section**: Automatic section for cards not assigned to grid areas (edit mode only)
- **Section Add Buttons**: + button on each section header to add cards directly

### Enhancements
- Auto-detect grid sections from `grid-template-areas` in edit mode
- Visual section boundaries with headers and placeholders
- Orange-highlighted unassigned cards section for better organization
- Section headers with interactive + buttons
- Improved card assignment tracking
- Better visual hierarchy with colors and spacing

### Compatibility
- Renamed all elements with `-improved` suffix for dual-run compatibility
- Can run alongside stock layout-card without conflicts
- Fixed view editor dropdown issues with better patch protection

### UI/UX Improvements
- Section headers with flex layout and action buttons
- Circular + buttons with rotation animation
- Hover effects on sections
- Empty state placeholders
- Unassigned section spans full grid width
- Clean presentation in normal mode (no borders/headers)

### Documentation
- Added comprehensive HACS installation guide
- Created quick start guide
- Added dual-run compatibility documentation
- Detailed grid sections usage examples
- Troubleshooting sections

### Technical
- Better schema validation in view editor patch
- Protection against double-patching
- Improved card grouping logic
- Enhanced section rendering system
- Output file renamed to `layout-card-improved.js`

### Card Types
All card types now use `-improved` suffix:
- `layout-card-improved`
- `grid-layout-improved`
- `masonry-layout-improved`
- `horizontal-layout-improved`
- `vertical-layout-improved`
- `gap-card-improved`
- `layout-break-improved`

## [2.4.7] - Previous Release

Base version from original layout-card with standard features.
