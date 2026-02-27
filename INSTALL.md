# Installation Guide

## Prerequisites

Before installing the extension, you need to generate the icon files.

### Step 1: Generate Icons

You have several options:

#### Option A: Use the icon generator (Easiest)
1. Open `icons/icon-generator.html` in your web browser
2. Click the "Download" button under each icon
3. Save the files as `icon16.png`, `icon48.png`, and `icon128.png`
4. Place all three files in the `icons` folder

#### Option B: Use online tools
1. Visit https://www.favicon-generator.org/
2. Upload a base image
3. Generate icons in sizes 16x16, 48x48, and 128x128
4. Save them in the `icons` folder with the correct names

#### Option C: Skip icons temporarily (for testing only)
1. Open `manifest.json`
2. Remove or comment out the entire `icons` section
3. Note: This is not recommended for distribution

### Step 2: Load the Extension

#### Chrome / Edge / Brave

1. Open your browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

2. Enable **Developer mode** (toggle in the top-right corner)

3. Click **"Load unpacked"**

4. Navigate to and select the `blazeScheduler` folder (the folder containing `manifest.json`)

5. The extension should now appear in your extensions list

6. Navigate to https://blaze.stream to test it out

#### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`

2. Click **"Load Temporary Add-on..."**

3. Navigate to the `blazeScheduler` folder

4. Select the `manifest.json` file

5. The extension should now be loaded (note: temporary add-ons are removed when Firefox closes)

6. Navigate to https://blaze.stream to test it out

### Step 3: Verify Installation

1. Go to https://blaze.stream

2. Open any stream and look at the chat

3. Click on a username in the chat to open their profile modal

4. You should see a new **"Tag"** button next to the Heart and Gift buttons

5. Go to the main dashboard (https://blaze.stream/)

6. Click on the "Highest Votes" dropdown

7. Scroll down - you should see a "My Tags" section with your custom filters

## Troubleshooting

### Extension doesn't load
- Make sure all files are in the correct location
- Check that `manifest.json` is valid JSON (no syntax errors)
- If icons are missing, try Option C above to temporarily skip them
- Check the browser console for any error messages

### Tag button doesn't appear
- Refresh the page (Ctrl+R or Cmd+R)
- Check the browser console for JavaScript errors
- Make sure you're clicking on a username in the chat (not elsewhere)
- Try opening a different stream

### Dropdown doesn't show custom filters
- Make sure you've created at least one tag
- Refresh the dashboard page
- Check that the "Highest Votes" dropdown is opening correctly
- Open browser DevTools and check for errors

### Storage issues
- The extension uses `chrome.storage.sync` API
- Your data syncs across devices if you're signed into your browser
- You can clear data by right-clicking the extension icon and selecting "Options" (if available)

### Firefox-specific issues
- Temporary add-ons are removed when Firefox closes
- For permanent installation in Firefox, the extension needs to be signed
- Visit https://extensionworkshop.com/ for more information

## Updating the Extension

If you make changes to the code:

1. **Chrome/Edge/Brave**: Click the refresh icon on the extension card in `chrome://extensions/`
2. **Firefox**: Click "Reload" in `about:debugging`

## Uninstalling

1. Go to your browser's extensions page
2. Find "Blaze Stream Custom Filters"
3. Click "Remove" or the trash icon
4. Note: This will delete all your custom filters and tags

## Privacy & Data

- All data is stored locally using browser storage APIs
- No data is sent to external servers
- Your tags and filters sync across devices if you use browser sync
- Data is only used to filter streams on blaze.stream

## Support

If you encounter issues:

1. Check the browser console (F12) for errors
2. Verify all files are present and correctly named
3. Try disabling other extensions that might conflict
4. Refresh the blaze.stream page
5. Report issues on the project repository
