# Installing Layout Card Improved via HACS

## Prerequisites

- Home Assistant with HACS installed
- Access to Home Assistant UI
- Basic knowledge of Lovelace dashboards

## Installation Steps

### Step 1: Add Custom Repository to HACS

1. Open Home Assistant
2. Go to **HACS** in the sidebar
3. Click on **Frontend**
4. Click the three dots menu (⋮) in the top right
5. Select **Custom repositories**
6. Add the following details:
   - **Repository**: `https://github.com/Stormsys/lovelace-layout-card-improved`
   - **Category**: Select `Lovelace`
7. Click **ADD**

### Step 2: Install the Integration

1. In HACS → Frontend, search for **"Layout Card Improved"**
2. Click on it
3. Click **DOWNLOAD** (or **INSTALL**)
4. Select the latest version
5. Click **DOWNLOAD** to confirm
6. **Restart Home Assistant** (or clear browser cache)

### Step 3: Add Resource to Lovelace

After installation, you need to add the JavaScript resource:

#### Method A: Via UI (Recommended)

1. Go to **Settings** → **Dashboards**
2. Click the three dots menu (⋮) in the top right
3. Select **Resources**
4. Click **+ ADD RESOURCE**
5. Enter the following:
   - **URL**: `/hacsfiles/lovelace-layout-card-improved/layout-card-improved.js`
   - **Resource type**: `JavaScript Module`
6. Click **CREATE**

#### Method B: Via YAML Configuration

If you manage resources in YAML, add to your `configuration.yaml`:

```yaml
lovelace:
  mode: yaml
  resources:
    - url: /hacsfiles/lovelace-layout-card-improved/layout-card-improved.js
      type: module
```

Then restart Home Assistant.

### Step 4: Clear Browser Cache

**Important**: Clear your browser cache or do a hard refresh:
- **Chrome/Edge**: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- **Firefox**: `Ctrl + F5` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- **Safari**: `Cmd + Option + R` (Mac)

Or use incognito/private browsing mode to test.

## Verification

To verify the installation worked:

1. Go to any dashboard
2. Click **Edit Dashboard**
3. Click **+ ADD CARD**
4. Search for "improved"
5. You should see:
   - **Layout Card Improved**
   - **Gap Card Improved**
   - **Layout Break Improved**

## Using in Your Dashboard

### Option 1: As a View Layout

1. In edit mode, click the pencil icon next to a view tab
2. In **View type**, select one of:
   - `Grid (layout-card-improved)`
   - `Masonry (layout-card-improved)`
   - `Horizontal (layout-card-improved)`
   - `Vertical (layout-card-improved)`
3. In **Layout options**, you can now add:
   ```yaml
   width: 300
   max_cols: 3
   custom_css: |
     #root {
       background: var(--primary-color);
       padding: 16px;
     }
   ```

### Option 2: As a Card

Add a new card and select **Layout Card Improved**, or use YAML:

```yaml
type: custom:layout-card-improved
layout_type: grid-improved
layout:
  grid-template-columns: repeat(3, 1fr)
  grid-gap: 16px
  custom_css: |
    #root {
      padding: 12px;
    }
cards:
  - type: entities
    entities:
      - light.living_room
  - type: weather-forecast
    entity: weather.home
```

## Example: Grid Layout with Sections

```yaml
title: My Dashboard
type: custom:grid-layout-improved
layout:
  grid-template-columns: 300px 1fr 300px
  grid-template-rows: 80px 1fr 60px
  grid-gap: 12px
  grid-template-areas: |
    "header header header"
    "left-sidebar main right-sidebar"
    "footer footer footer"
  custom_css: |
    #root {
      padding: 16px;
      background: var(--lovelace-background);
    }
    .grid-section.edit-mode {
      border-color: var(--primary-color);
    }
  sections:
    header:
      grid_area: header
    left-sidebar:
      grid_area: left-sidebar
    main:
      grid_area: main
    right-sidebar:
      grid_area: right-sidebar
    footer:
      grid_area: footer
cards:
  - type: markdown
    content: "# My Smart Home"
    view_layout:
      grid_area: header
  - type: entities
    title: Lights
    entities:
      - light.living_room
      - light.bedroom
    view_layout:
      grid_area: left-sidebar
  - type: weather-forecast
    entity: weather.home
    view_layout:
      grid_area: main
  - type: entities
    title: Sensors
    entities:
      - sensor.temperature
      - sensor.humidity
    view_layout:
      grid_area: right-sidebar
  - type: horizontal-stack
    cards:
      - type: button
        entity: script.good_night
    view_layout:
      grid_area: footer
```

## Running Alongside Stock Layout Card

This improved version uses different element names (`-improved` suffix) so it can run alongside the original layout-card:

**Stock version uses:**
- `custom:layout-card`
- `custom:grid-layout`
- etc.

**Improved version uses:**
- `custom:layout-card-improved`
- `custom:grid-layout-improved`
- etc.

You can use both in the same Home Assistant instance without conflicts!

## Troubleshooting

### Cards not appearing in picker

1. Verify resource is loaded:
   - Go to **Developer Tools** → **Info**
   - Check Frontend version and last restart time
2. Clear browser cache completely
3. Check browser console (F12) for JavaScript errors
4. Verify the file exists at `/hacsfiles/lovelace-layout-card-improved/layout-card-improved.js`

### "Custom element already defined" error

- This means you have both versions loaded, or the resource is added twice
- Check your resources list and remove duplicates
- Ensure you're using the correct URL

### Resource not loading (404 error)

1. Verify HACS installation completed successfully
2. Check that the file exists in `/config/www/community/lovelace-layout-card-improved/`
3. Try restarting Home Assistant
4. Reinstall via HACS if needed

### Sections not showing in edit mode

1. Ensure you're using `custom:grid-layout-improved` (not `custom:grid-layout`)
2. Verify your layout has `grid-template-areas` defined
3. Enter edit mode on the view
4. Check browser console for errors

### Custom CSS not applying

1. Verify the `custom_css` property is under `layout:` section
2. Check CSS syntax (use `|` for multiline in YAML)
3. Inspect elements in browser dev tools to see if styles are present
4. Try simpler CSS first to verify it works

### View type not appearing

If the improved view types don't appear in the dropdown:

1. Ensure the resource is loaded (check browser network tab)
2. Clear browser cache
3. Try a different browser or incognito mode
4. Check browser console for errors
5. Verify HACS installation completed without errors

## Getting Help

- Check [GRID_SECTIONS_USAGE.md](GRID_SECTIONS_USAGE.md) for feature documentation
- Check [DUAL_RUN_GUIDE.md](DUAL_RUN_GUIDE.md) for compatibility info
- Review [README.md](README.md) for general usage
- Open an issue on GitHub: https://github.com/Stormsys/lovelace-layout-card-improved/issues

## Updating

When a new version is released:

1. Go to HACS → Frontend
2. Find **Layout Card Improved**
3. Click **UPDATE** if available
4. Restart Home Assistant
5. Clear browser cache

## Uninstalling

To remove Layout Card Improved:

1. Remove any views or cards using the improved types
2. Go to HACS → Frontend
3. Find **Layout Card Improved**
4. Click the three dots menu (⋮)
5. Select **Remove**
6. Remove the resource from Settings → Dashboards → Resources
7. Restart Home Assistant

---

**Note**: Remember to always clear your browser cache after installing, updating, or modifying Lovelace resources!
