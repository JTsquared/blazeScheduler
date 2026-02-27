# Blaze Stream Custom Filters Browser Extension

A browser extension that adds custom tag filtering functionality to Blaze.stream, allowing you to organize and filter streamers into custom groups.

## 🎯 Features

- **Custom Tags**: Create unlimited custom filter groups (e.g., "Favorites", "Gaming", "Music", "Friends")
- **Easy Tagging**: Tag streamers directly from chat user profile modals
- **Dashboard Filtering**: Filter the main dashboard by your custom tags
- **Smart Organization**: Assign multiple tags to the same streamer
- **Sync Support**: Tags sync across devices via browser sync
- **Default "Favorites"**: Comes with a built-in Favorites filter

## 📦 Installation

See **[INSTALL.md](INSTALL.md)** for detailed installation instructions.

**Quick Start:**
1. Generate icons using `icons/icon-generator.html`
2. Load the extension in your browser (Chrome: `chrome://extensions/`, Firefox: `about:debugging`)
3. Visit https://blaze.stream and start tagging!

## 🚀 Usage

See **[USAGE.md](USAGE.md)** for detailed usage instructions.

**Quick Guide:**
1. **Tag a Streamer**: Click on a username in chat → Click "Tag" button → Select tags
2. **Create Custom Filter**: Open tag menu → Click "+ Create new filter" → Enter name
3. **Filter Dashboard**: Go to main dashboard → Click "Highest Votes" dropdown → Select your custom tag

## 📁 File Structure

```
blazeScheduler/
├── manifest.json              # Extension configuration (Manifest V3)
├── storage.js                 # Storage API wrapper for managing filters and tags
├── chat-enhancements.js       # Content script: adds tag button to chat modals
├── dashboard-filters.js       # Content script: adds filters to dashboard dropdown
├── styles.css                 # Styling for custom UI elements
├── icons/                     # Extension icons (16x16, 48x48, 128x128)
│   ├── icon-generator.html    # Tool to generate icon files
│   └── README.md              # Icon generation instructions
├── README.md                  # This file
├── INSTALL.md                 # Installation guide
└── USAGE.md                   # Detailed usage guide
```

## 🔧 Technical Details

- **Manifest Version**: V3 (compatible with modern Chrome/Edge/Firefox)
- **Storage**: Uses `chrome.storage.sync` API for cross-device synchronization
- **Permissions**: Only requests `storage` permission and `https://blaze.stream/*` host access
- **Injection**: Content scripts run at `document_idle` for optimal performance
- **Framework**: Vanilla JavaScript (no dependencies)

## 🎨 Customization

You can customize the extension by editing:
- **styles.css**: Change colors, sizes, animations
- **storage.js**: Modify storage behavior or add new features
- **chat-enhancements.js**: Customize tag button appearance or dropdown behavior
- **dashboard-filters.js**: Adjust filtering logic

## 🐛 Troubleshooting

**Tag button not appearing?**
- Refresh the page
- Check browser console for errors
- Verify extension is enabled

**Filters not showing on dashboard?**
- Create at least one custom tag first
- Refresh the dashboard
- Check that you're on https://blaze.stream/

**Data not syncing?**
- Ensure browser sync is enabled
- Check that you're signed into your browser account

See **[INSTALL.md](INSTALL.md)** for more troubleshooting tips.

## 🔒 Privacy & Security

- **No external connections**: All data stays in your browser
- **No tracking**: Extension doesn't collect or transmit any data
- **Open source**: All code is visible and auditable
- **Minimal permissions**: Only requests essential permissions

## 📝 License

This project is open source and free to use.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📮 Support

If you encounter issues:
1. Check the [INSTALL.md](INSTALL.md) troubleshooting section
2. Open browser DevTools (F12) and check the console
3. Create an issue with details about your browser and the problem
