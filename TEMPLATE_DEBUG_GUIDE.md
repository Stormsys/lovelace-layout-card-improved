# Debugging Jinja Templates in background_image

## Your Configuration

```yaml
background_image: "{{ states('input_text.current_background_image') }}"
background_blur: 15px
background_opacity: 0.6
```

## How to Debug

### Step 1: Check Browser Console

Open DevTools (F12) → Console tab. You should see these logs:

```
Rendering template: {{ states('input_text.current_background_image') }}
Template rendered successfully: {{ states('input_text.current_background_image') }} -> /local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg
Background image (raw): "/local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg"
Background image (trimmed): "/local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg"
Creating background with image: /local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg blur: 15px opacity: 0.6
Setting background-image to: url('/local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg')
Element style.backgroundImage: url("/local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg")
Background element in DOM: url("/local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg")
```

### Step 2: Verify Template in Developer Tools

1. Go to **Developer Tools** → **Template**
2. Enter your template:
   ```jinja
   {{ states('input_text.current_background_image') }}
   ```
3. Verify it outputs: `/local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg`

### Step 3: Check input_text Entity

Make sure your entity exists and has the correct value:

```yaml
# In configuration.yaml or helpers
input_text:
  current_background_image:
    name: Current Background Image
    initial: /local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg
```

Or check in UI:
- Settings → Devices & Services → Helpers
- Find `input_text.current_background_image`
- Verify the value

### Step 4: Clear Cache & Reload

1. **Hard refresh**: Ctrl+Shift+R (or Cmd+Shift+R)
2. **Update in HACS**: Make sure you have the latest version
3. **Restart Home Assistant**
4. **Clear browser cache completely**

## Common Issues & Fixes

### Issue: Template Not Rendering

**Symptoms**: Console shows "Not a template, using directly"

**Fix**: Make sure template has quotes in YAML:
```yaml
# CORRECT
background_image: "{{ states('input_text.current_background_image') }}"

# WRONG (YAML will parse the template)
background_image: {{ states('input_text.current_background_image') }}
```

### Issue: Empty Background Image

**Symptoms**: Console shows `background_image: ""`

**Causes**:
1. Entity doesn't exist
2. Entity value is empty
3. Template error

**Fix**: Test template first, verify entity exists

### Issue: Image Path Wrong

**Symptoms**: Background div exists but no image visible

**Fix**: Check the path:
```yaml
# Image should be at: /config/www/backgrounds/image.jpg
# URL should be: /local/backgrounds/image.jpg
```

### Issue: Template Has Extra Characters

**Symptoms**: Console shows extra quotes or spaces

**Fix**: The new code trims whitespace automatically. Check console logs for exact value.

## Working Examples

### From input_text
```yaml
background_image: "{{ states('input_text.current_background_image') }}"
```

### From input_select
```yaml
background_image: "{{ states('input_select.dashboard_theme') }}"
# input_select has options like: /local/bg1.jpg, /local/bg2.jpg
```

### Conditional
```yaml
background_image: >-
  {% if is_state('sun.sun', 'above_horizon') %}
    /local/backgrounds/day.jpg
  {% else %}
    /local/backgrounds/night.jpg
  {% endif %}
```

### From Entity Attribute
```yaml
background_image: "{{ state_attr('weather.home', 'entity_picture') }}"
```

### With Fallback
```yaml
background_image: "{{ states('input_text.bg') | default('/local/backgrounds/default.jpg') }}"
```

## Console Debugging

After updating the code, check your console for these messages:

**Good (Working):**
```
Rendering template: {{ states('input_text.current_background_image') }}
Template rendered successfully: ... -> /local/backgrounds/image.jpg
Background image (trimmed): "/local/backgrounds/image.jpg"
Setting background-image to: url('/local/backgrounds/image.jpg')
Element style.backgroundImage: url("/local/backgrounds/image.jpg")
```

**Bad (Not Working):**
```
Template rendering failed: [Error] ...
Background image template rendered to empty string
```

## Quick Test

Try this to verify it works:

1. **Static path first**:
   ```yaml
   background_image: /local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg
   ```
   Should work immediately.

2. **Simple template**:
   ```yaml
   background_image: "{{ '/local/backgrounds/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg' }}"
   ```
   Should work if template system is functioning.

3. **Your actual template**:
   ```yaml
   background_image: "{{ states('input_text.current_background_image') }}"
   ```
   Should work if entity exists and has correct value.

## If Still Not Working

### Check These in Console:

1. Is template rendering being called?
2. What does the template render to?
3. Is backgroundImage style being set?
4. Is the element in the DOM?

### Share These Console Outputs:

```javascript
// Check if element exists
document.querySelector('grid-layout-improved').shadowRoot.querySelector('.background')

// Check its styles
document.querySelector('grid-layout-improved').shadowRoot.querySelector('.background').style.backgroundImage

// Check all styles
document.querySelector('grid-layout-improved').shadowRoot.querySelector('.background').getAttribute('style')
```

## What Changed in Latest Update

✅ Proper async template rendering via `hass.callWS`
✅ Template results are trimmed
✅ Enhanced console logging with JSON.stringify
✅ Separate logging for raw and trimmed values
✅ Background updates when hass state changes
✅ Verification logging after element creation

Clear your cache and try again! The new console logs will show exactly what's happening with your template.
