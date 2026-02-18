# Changelog

## [3.1.3] - 2025-02-04

### Performance Fixes - Edit Mode Stabilization
- **FIXED**: Janky edit mode, sluggish YAML editing, refreshing during search
- Debounced section hass updates with requestAnimationFrame
- Skip hass propagation to sections during edit mode (only needed in view mode)
- Cache native section elements and reuse instead of recreating
- Smarter re-render detection (only on actual changes, not during editing)
- Removed all console logging spam
- Smart entity tracking - only evaluate templates when tracked entities change

### Template System Improvements
- Support for `{% if is_state() %}` blocks in custom_css
- Support for `{% if not is_state() %}` blocks
- Templates in custom_css now fully reactive
- Entity tracking for efficient updates
- CSS template caching

### Background Image Enhancements
- Automatic header height detection
- Background positioned below HA header
- Simple direct state evaluation (no WebSocket complexity)
- Support for {{ states() }} and {{ state_attr() }}
- Cached background updates - only when image changes

## [3.1.2] - 2025-02-04

### Critical Fix
- Fixed cards not updating when states change
- Proper hass propagation to native sections

## [3.1.1] - 2025-02-04

### Fixes
- Removed problematic WebSocket subscription code
- Simplified template rendering

## [3.1.0] - 2025-02-04

### Documentation & Clarifications
- **IMPORTANT**: Added clear documentation that Grid Layout Improved sections are a visual organizational tool, NOT a replacement for Native HA Sections
- Created comprehensive comparison guide: `SECTIONS_VS_NATIVE.md`
- Updated `GRID_SECTIONS_USAGE.md` with warnings and clarifications
- Fixed misleading expectations about drag-and-drop functionality
- Added migration guide for users wanting native sections with full drag-and-drop

### What Grid Sections Actually Provide
- Visual section boundaries in edit mode (organizational aid)
- Section headers showing grid area names
- Unassigned cards staging area
- Custom CSS injection and complex grid layouts
- **Manual card assignment via YAML** (no drag-and-drop between sections)

### User Guidance
- For full drag-and-drop: Use `type: sections` (Native HA Sections)
- For complex CSS Grid layouts with visual aids: Use `type: custom:grid-layout-improved`
- Added clear placeholder text explaining manual assignment requirement
- Updated documentation to set proper expectations

### Technical
- Improved placeholder text in empty sections
- Removed misleading drag-and-drop code references
- Better inline documentation

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
