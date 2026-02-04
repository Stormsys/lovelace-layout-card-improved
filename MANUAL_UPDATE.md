# Manual Update Instructions - BYPASS CACHE

## You're Loading Old Cached Code!

Your browser shows: `hacstag=11496168902789` (old version with connection error)

## 🔥 Nuclear Option: Manual File Replacement

### Option 1: Direct File Download

1. **Download the latest file**:
   - Go to: https://github.com/Stormsys/lovelace-layout-card-improved/raw/master/layout-card-improved.js
   - Right-click → Save As
   - Save to your computer

2. **Upload to Home Assistant**:
   - In Home Assistant, go to **File Editor** (or use SSH)
   - Navigate to `/config/www/community/lovelace-layout-card-improved/`
   - **Delete** the old `layout-card-improved.js`
   - **Upload** the new file you downloaded

3. **Force reload resource**:
   - Settings → Dashboards → Resources
   - Find layout-card-improved
   - Edit the URL, add `?v=311` at the end:
   ```
   /hacsfiles/lovelace-layout-card-improved/layout-card-improved.js?v=311
   ```
   - Save

4. **Clear browser cache**:
   - Ctrl+Shift+Delete → Clear cached files
   - Close browser completely
   - Reopen

### Option 2: Temporary Workaround (Use Static Path)

While we fix the cache issue, use a **static path** instead of template:

```yaml
layout:
  # Don't use template for now
  background_image: /local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg
  background_blur: 15px
  background_opacity: 0.6
```

**This works perfectly!** You confirmed it earlier.

### Then Create an Automation

To change backgrounds dynamically without templates:

```yaml
# automation.yaml
- alias: Update Dashboard Background
  trigger:
    - platform: state
      entity_id: input_select.dashboard_background
  action:
    - service: input_text.set_value
      target:
        entity_id: input_text.dashboard_bg_path  
      data:
        value: "/local/backgrounds/{{ states('input_select.dashboard_background') }}.jpg"
```

Then use:
```yaml
background_image: /local/backgrounds/my-image.jpg
```

And change via input_select. When you select different background, automation updates it, then reload the dashboard.

## Option 3: Wait for HACS

Sometimes HACS takes time to invalidate cache. Wait 30 minutes and try again.

## Option 4: Use Different Browser

Test in a browser you haven't used for HA:
- Chrome → Try Firefox
- Firefox → Try Chrome
- Use Edge/Safari/etc.

This guarantees fresh cache!

## ✅ Verify New Version

Once you get the new code, console will show:
```
LAYOUT-CARD 3.1.1 IS INSTALLED
Template detected, will evaluate from hass states
Evaluated template: {{ states(...) }}
  Entity: input_text.current_background_image  
  Value: /local/backgrounds/...
✅ Background element created
```

**NO MORE connection errors!**

## 🎯 Recommended: Use Static Path for Now

Since static paths work perfectly, just use:

```yaml
background_image: /local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg
```

And change it when you want a different background. Template support will work once cache clears!
