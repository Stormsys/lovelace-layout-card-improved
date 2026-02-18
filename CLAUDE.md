# CLAUDE.md — AI Assistant Guide for lovelace-layout-card-improved

This file provides context for AI assistants (Claude, Copilot, etc.) working in this repository.

---

## Project Overview

**lovelace-layout-card-improved** is a Home Assistant Lovelace custom card that extends the original [layout-card](https://github.com/thomasloven/lovelace-layout-card) with advanced CSS Grid capabilities, Jinja template evaluation, visual section management, and responsive design features.

- **Version**: 3.1.3
- **License**: MIT
- **Original Author**: Thomas Lovén; fork by Stormsys
- **HA minimum version**: 2021.10.0
- **Distribution**: HACS (Home Assistant Community Store)
- **Compiled output**: `layout-card-improved.js` (single ES module, ~96KB)

All custom elements use the `-improved` suffix to coexist alongside the stock `layout-card` without conflicts.

---

## Repository Layout

```
/
├── src/                         # TypeScript source (the only files to edit)
│   ├── main.ts                  # Entry point — imports all modules
│   ├── types.ts                 # Shared TypeScript interfaces
│   ├── helpers.ts               # Utility functions (YAML editor, form loaders)
│   ├── layout-card.ts           # Main <layout-card-improved> element
│   ├── layout-card-editor.ts    # Config UI for the layout card
│   ├── gap-card.ts              # <gap-card-improved> spacing element
│   ├── layout-break.ts          # <layout-break-improved> flow-break element
│   └── layouts/
│       ├── base-layout.ts       # Abstract base for all layouts
│       ├── base-column-layout.ts # Base for column-based layouts
│       ├── masonry.ts           # Masonry layout
│       ├── horizontal.ts        # Horizontal layout
│       ├── vertical.ts          # Vertical layout
│       └── grid.ts              # Advanced CSS Grid layout (largest file, ~1181 lines)
│   └── patches/
│       ├── hui-view-editor.ts   # Patches HA view editor — adds "-improved" options
│       └── hui-card-element-editor.ts  # Patches card editor — preserves view_layout
├── test/                        # Manual test environment (Docker + HA)
│   ├── docker-compose.yml
│   ├── configuration.yaml
│   ├── .env                     # Credentials: dev/dev
│   └── lovelace/                # YAML test views
├── .vscode/tasks.json           # VSCode tasks: build, watch, run hass
├── .devcontainer/devcontainer.json
├── rollup.config.js             # Rollup bundler config
├── tsconfig.json                # TypeScript config
├── package.json                 # Scripts and dependencies (v3.1.3)
├── hacs.json                    # HACS metadata
├── layout-card-improved.js      # Compiled output — DO NOT edit manually
└── *.md                         # Feature documentation (16+ files)
```

---

## Build System

### Tools

| Tool | Version | Role |
|------|---------|------|
| TypeScript | ^5.8.3 | Type checking and transpilation |
| Rollup | ^4.40.2 | Bundling |
| Babel (`@babel/preset-env`) | ^7.27.2 | ES2017 transpilation |
| `rollup-plugin-typescript2` | ^0.36.0 | TS→JS in Rollup pipeline |
| `@rollup/plugin-terser` | ^0.4.4 | Minification (production only) |
| Lit | ^3.3.0 | Web component library |

### Build Commands

```bash
npm install          # Install dependencies
npm run build        # One-shot production build → layout-card-improved.js
npm run watch        # Watch mode for development (no minification)
```

Build pipeline: `src/main.ts` → Rollup → TypeScript → Babel → (Terser in prod) → `layout-card-improved.js`

**Watch mode** (`ROLLUP_WATCH` env var is set) skips terser minification for faster rebuilds.

### TypeScript Configuration Highlights (`tsconfig.json`)

- **Target**: ES2017
- **Module resolution**: `node`
- `esModuleInterop`, `allowSyntheticDefaultImports`: enabled (needed for `import pjson from "../package.json"`)
- `experimentalDecorators`: enabled (for LitElement `@property()`, `@state()`, `@query()`)
- `resolveJsonModule`: enabled

---

## Custom Elements Registered

| Element Name | File | Role |
|---|---|---|
| `layout-card-improved` | layout-card.ts | Main layout card |
| `masonry-layout-improved` | layouts/masonry.ts | Masonry view layout |
| `horizontal-layout-improved` | layouts/horizontal.ts | Horizontal view layout |
| `vertical-layout-improved` | layouts/vertical.ts | Vertical view layout |
| `grid-layout-improved` | layouts/grid.ts | Advanced CSS Grid view layout |
| `gap-card-improved` | gap-card.ts | Spacing/gap card |
| `layout-break-improved` | layout-break.ts | Flow break card |

Each module also pushes metadata into `window.customCards` for HA auto-discovery.

---

## Architecture

### Inheritance Hierarchy

```
LitElement (Lit 3)
└── BaseLayout                     (base-layout.ts)
    ├── BaseColumnLayout            (base-column-layout.ts)
    │   ├── MasonryLayout           (layouts/masonry.ts)
    │   ├── HorizontalLayout        (layouts/horizontal.ts)
    │   └── VerticalLayout          (layouts/vertical.ts)
    └── GridLayout                  (layouts/grid.ts)  ← most complex
```

### Module Responsibility Summary

#### `base-layout.ts`
- Abstract base for all layout types
- Manages `editMode`, card visibility, and the FAB (floating action button) for adding cards
- Subclasses must implement `_createLayout()` and `_updateLayout()`

#### `base-column-layout.ts`
- Extends `BaseLayout` for column-based layouts (masonry, horizontal, vertical)
- Manages `ResizeObserver` for responsive column count
- Handles media query evaluation and column sizing from config

#### `grid.ts` (most complex — ~1181 lines)
Key responsibilities:
- **CSS Grid rendering**: Applies `grid-template-areas`, `grid-template-columns`, `grid-template-rows` from config
- **Section management**: Parses grid areas, creates/destroys `<hui-section>` wrappers, maintains `_sectionsCache`
- **Jinja template evaluation**: Evaluates `{{ states('...') }}`, `{{ state_attr('...') }}`, `{% if is_state() %}` blocks in `custom_css`; smart entity tracking via `_trackedEntities`; debounced re-evaluation via `requestAnimationFrame`
- **Background images**: Fixed positioning, blur, opacity, template support
- **Edit mode UI**: Section header labels with "+" buttons, grid area visualization, unassigned cards section
- **Auto-save**: Writes new sections to YAML config automatically when first card is added

#### `layout-card.ts`
- Orchestrates creation of child cards from config
- Delegates layout to the appropriate layout element
- Handles `setConfig()`, `hass` propagation, edit mode relay

#### `patches/hui-view-editor.ts`
- Monkey-patches the HA view editor to inject `-improved` layout options into the layout type dropdown
- Includes duplicate-patch guard

#### `patches/hui-card-element-editor.ts`
- Preserves `view_layout` data when the card element editor saves changes

---

## Code Conventions

### Naming

- Custom element names always end in `-improved` (e.g., `masonry-layout-improved`)
- Private methods and properties are prefixed with `_` (e.g., `_makeLayout()`, `_sectionsCache`)
- Constants are `UPPER_SNAKE_CASE`

### LitElement Patterns

```typescript
@customElement("my-element-improved")
class MyElement extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: CardConfig;
  @query("#container") private _container!: HTMLElement;

  static get styles() { return css`...`; }

  render() { return html`...`; }

  setConfig(config: CardConfig) { this._config = config; }
  static getConfigElement() { return document.createElement("my-element-editor"); }
  static getStubConfig() { return { type: "custom:my-element-improved" }; }
}
```

### Reactive Updates

- Use `@property()` for externally set properties (`hass`, `lovelace`, `cards`, etc.)
- Use `@state()` for internal state that triggers re-render
- Use `updated(changedProps)` to react to property changes and add/remove DOM listeners
- Use `disconnectedCallback()` to clean up `ResizeObserver` and `MutationObserver` instances

### Event Handling

```typescript
// Dispatching
this.dispatchEvent(new CustomEvent("event-name", { detail: { ... }, bubbles: true, composed: true }));

// Listening — add in updated(), remove in disconnectedCallback()
this._container.addEventListener("card-dropped", this._onCardDropped);
```

### DOM Manipulation

- Prefer direct style assignment for dynamic layout values (e.g., `el.style.gridArea = "..."`)
- Shadow DOM is used for style encapsulation
- `ResizeObserver` and `MutationObserver` are cleaned up in `disconnectedCallback()`

---

## Template System (CSS Templates in grid.ts)

`custom_css` config values support Jinja-like expressions:

| Syntax | Example |
|---|---|
| State value | `{{ states('sensor.temperature') }}` |
| Attribute value | `{{ state_attr('climate.living', 'temperature') }}` |
| Conditional block | `{% if is_state('binary_sensor.dark', 'on') %}...{% endif %}` |

**Implementation details**:
- `_evaluateCssTemplate(css, hass)` handles parsing and substitution
- `_trackedEntities` Set tracks which entity IDs appear in the template
- Hass updates only trigger re-evaluation if a tracked entity changed
- `_lastEvaluatedCss` caches the last output to skip identical re-renders
- Re-renders are batched via `requestAnimationFrame`

---

## Test Environment

There are no automated unit or integration tests. Testing is done manually via Docker:

```bash
# Start Home Assistant test instance
docker-compose -f test/docker-compose.yml up

# HA is accessible at http://localhost:8123
# Credentials: dev / dev (from test/.env)
```

VSCode tasks (`.vscode/tasks.json`) provide shortcuts for build, watch, and running the Docker HA instance.

**Test YAML views** are in `test/lovelace/`:
- `layout-card.yaml` — General layout card tests
- `grid-view.yaml` — Grid layout feature tests
- `media-query.yaml` — Responsive layout tests
- `layout-break.yaml` — Break card tests
- `card-list.yaml` / `view.yaml` — Misc views

---

## Development Workflow

### Typical Cycle

1. `npm run watch` — start Rollup in watch mode
2. Edit files in `src/`
3. Rollup rebuilds `layout-card-improved.js` automatically
4. Reload the HA test instance in the browser (or use `resources` hot-reload)
5. Verify changes in the test views

### Adding a New Layout

1. Create `src/layouts/my-layout.ts` extending `BaseLayout` or `BaseColumnLayout`
2. Implement `_createLayout()` and `_updateLayout()` abstract methods
3. Register via `customElements.define("my-layout-improved", MyLayout)`
4. Push to `window.customCards`
5. Import in `src/main.ts`
6. Add the option to `helpers.ts` layout selector list
7. Handle in `layout-card.ts` card creation switch
8. Patch `hui-view-editor.ts` to surface the option in the HA UI

### Adding a New Config Option to GridLayout

1. Add the property to `types.ts` interfaces (`GridViewConfig` or `SectionConfig`)
2. Read it in `grid.ts` `setConfig()` (store on `this._config`)
3. Apply it in `_createLayout()` or `_updateLayout()` as needed
4. Expose it in the editor (`layout-card-editor.ts`) if user-configurable

---

## Key Files for Common Tasks

| Task | Primary File(s) |
|---|---|
| Change grid rendering logic | `src/layouts/grid.ts` |
| Change column layout logic | `src/layouts/base-column-layout.ts` |
| Modify main card orchestration | `src/layout-card.ts` |
| Modify config editor UI | `src/layout-card-editor.ts` |
| Add/modify shared types | `src/types.ts` |
| Add/modify utility functions | `src/helpers.ts` |
| Fix HA editor integration | `src/patches/hui-view-editor.ts` |
| Fix view_layout preservation | `src/patches/hui-card-element-editor.ts` |
| Change build pipeline | `rollup.config.js`, `tsconfig.json` |

---

## Dual-Run Compatibility

This fork is designed to run **simultaneously** with the stock `layout-card`:

- All element names use `-improved` suffix
- `hui-view-editor.ts` checks if it has already been patched before applying patches
- HACS resource name is `layout-card-improved.js` (different from `layout-card.js`)

Do **not** remove the `-improved` suffix from element names or the dual-run guarantee breaks.

---

## Important Constraints

- **Never edit `layout-card-improved.js` directly** — it is the compiled output and will be overwritten on next build
- **Keep `-improved` suffix** on all custom element names for dual-run compatibility
- **Clean up observers** — always remove `ResizeObserver` and `MutationObserver` listeners in `disconnectedCallback()`
- **Debounce heavy operations** — use `requestAnimationFrame` for CSS template evaluation and section updates
- **No automated tests** — validate changes manually through the Docker test environment or a real HA instance
- **Lit 3 API** — this project uses Lit 3; do not use Lit 2 APIs or `@lit-labs` packages

---

## Documentation Files

| File | Contents |
|---|---|
| `README.md` | Full feature guide and YAML examples |
| `QUICK_START.md` | 5-minute installation guide |
| `HACS_INSTALLATION.md` | Detailed HACS setup steps |
| `GRID_SECTIONS_USAGE.md` | Grid sections feature guide |
| `RESPONSIVE_LAYOUTS.md` | Media queries and responsive design |
| `BACKGROUND_IMAGE.md` | Background image with templates |
| `DUAL_RUN_GUIDE.md` | Running alongside stock layout-card |
| `SECTIONS_VS_NATIVE.md` | Comparison with native HA sections |
| `NATIVE_SECTIONS_IN_GRID.md` | Native section integration |
| `TEMPLATE_DEBUG_GUIDE.md` | Debugging Jinja templates in custom_css |
| `FIX_NULL_TEMPLATE.md` | Fixing null template errors |
| `AUTO_CREATED_SECTIONS.md` | Auto-section creation behaviour |
| `CHANGELOG.md` | Full version history |
| `RELEASE_NOTES_v3.0.0.md` | v3.0.0 major release notes |
| `LIMITATIONS.md` | Known limitations |
| `COMPLETE_EXAMPLE.md` | Full configuration example |
