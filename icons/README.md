# Extension Icons

This folder should contain the extension icons in the following sizes:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

## Creating Icons

You can create simple icons using any image editor or online tool. Here are some options:

### Option 1: Use an online icon generator
1. Visit https://www.favicon-generator.org/
2. Upload a base image (e.g., a tag icon)
3. Generate and download the icons
4. Rename them to match the required names above

### Option 2: Create with HTML/Canvas
1. Open `icon-generator.html` in a browser (included in this folder)
2. Right-click and save each canvas as PNG
3. Rename to the appropriate sizes

### Option 3: Simple placeholder
For testing, you can create solid color squares:
- Use any image editor (GIMP, Photoshop, Paint, etc.)
- Create squares in the sizes above
- Fill with a color (e.g., teal #5eead4)
- Add a simple "B" or tag symbol

## Temporary Workaround

If you don't have icons yet, you can temporarily remove the `icons` section from `manifest.json`, though this is not recommended for production use.
