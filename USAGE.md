# Usage Guide

This guide will walk you through using the Blaze Stream Custom Filters extension.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Tagging Streamers](#tagging-streamers)
3. [Creating Custom Filters](#creating-custom-filters)
4. [Filtering the Dashboard](#filtering-the-dashboard)
5. [Managing Tags](#managing-tags)
6. [Tips & Best Practices](#tips--best-practices)

---

## Getting Started

After installing the extension, navigate to https://blaze.stream. The extension will automatically enhance the site with custom filtering capabilities.

### First Time Setup

1. **Open any stream** on Blaze
2. **Look at the chat** on the right side
3. **Click on any username** in the chat to open their profile modal
4. You should now see a **"Tag"** button next to the Heart and Gift buttons

If you see the Tag button, the extension is working correctly!

---

## Tagging Streamers

### Basic Tagging

1. **Navigate to any Blaze stream**
2. **Click on a username** in the chat to open their profile modal
3. **Click the "Tag" button** (teal-colored button with a tag icon)
4. A dropdown menu will appear showing:
   - **Favorites** (default filter, always present)
   - Any custom filters you've created
   - **+ Create new filter** option

5. **Check the box** next to any filter to tag that streamer
6. You can select multiple filters for the same streamer

### Example

Let's say you want to tag a streamer named "badger" as a favorite:

1. Click on "badger" in chat
2. Click the "Tag" button
3. Check the "Favorites" box
4. The streamer is now tagged!

Now "badger" will appear when you filter the dashboard by "Favorites".

---

## Creating Custom Filters

### Step-by-Step

1. **Open the tag menu** by clicking the Tag button on any user profile modal
2. **Scroll to the bottom** of the dropdown
3. **Click "+ Create new filter"**
4. An input field will appear
5. **Type your filter name** (e.g., "Gaming", "Music", "Friends", "Afternoon Streams")
6. **Click "Save"** (or press Enter)
7. Your new filter is now available!

### Filter Name Guidelines

- Use clear, descriptive names
- Keep names under 30 characters
- Names are case-sensitive
- You can't create duplicate filter names
- "Favorites" is reserved and always present

### Examples of Custom Filters

Here are some ideas for custom filters:

- **By Category**: Gaming, Music, Art, Coding, Chatting
- **By Time**: Morning Streams, Afternoon Streams, Late Night
- **By Relationship**: Friends, Favorite Creators, Mutual Follows
- **By Content Type**: Educational, Entertainment, Chill Vibes
- **By Game**: Minecraft, Fortnite, Valorant, etc.

---

## Filtering the Dashboard

Once you've tagged streamers and created filters, you can use them to filter the main dashboard.

### How to Filter

1. **Go to the main Blaze dashboard** (https://blaze.stream/)
2. **Look for the filter dropdown** (currently shows "Highest Votes")
3. **Click the dropdown** to open it
4. **Scroll down** past the default options (Highest Votes, Popular Channels, etc.)
5. You'll see a **"My Tags"** section
6. **Click on any of your custom filters** (e.g., "Favorites")
7. The dashboard will now show **only** streamers you've tagged with that filter

### Returning to All Streams

To see all streams again:
1. Click the filter dropdown
2. Select one of the default options like "Highest Votes" or "Popular Channels"

---

## Managing Tags

### Adding Multiple Tags

You can tag the same streamer with multiple filters:

1. Open their profile modal
2. Click the Tag button
3. Check multiple boxes (e.g., both "Favorites" and "Gaming")
4. The streamer will appear in both filtered views

### Removing Tags

To remove a tag from a streamer:

1. Open their profile modal
2. Click the Tag button
3. **Uncheck** the filter you want to remove
4. The change is saved automatically

### Viewing Tagged Streamers

To see which streamers are in a specific filter:

1. Go to the main dashboard
2. Open the filter dropdown
3. Select your custom filter
4. Only streamers with that tag will be displayed

---

## Tips & Best Practices

### Organization Strategies

**Strategy 1: Category-Based**
- Create filters for different content types
- Tag streamers based on what they usually stream
- Easy to find specific content types

**Strategy 2: Priority-Based**
- Create filters like "Must Watch", "Check Daily", "When Available"
- Helps prioritize which streams to watch first

**Strategy 3: Time-Based**
- Create filters based on when streamers usually go live
- "Morning", "Afternoon", "Evening", "Late Night"
- Useful if you watch streams at specific times

**Strategy 4: Relationship-Based**
- "Close Friends", "Acquaintances", "New Discoveries"
- Helps maintain connections with different levels of relationships

### Performance Tips

- The extension is lightweight and shouldn't impact site performance
- Tags are stored locally and sync via browser sync (if enabled)
- No limit on the number of filters or tagged streamers

### Keyboard Shortcuts

When creating a new filter:
- Press **Enter** to save
- Press **Escape** (or click Cancel) to cancel

### Data Persistence

- Your tags and filters are saved in browser storage
- They persist across browser sessions
- If you use browser sync (Chrome/Edge), they sync across devices
- Uninstalling the extension will delete all data

### Bulk Operations

Currently, the extension doesn't support bulk tagging. You need to tag streamers individually. This is intentional to keep the tagging process thoughtful and organized.

### Managing Many Filters

If you create many filters:
- The dropdown scrolls, so you can create as many as needed
- Consider using clear naming conventions
- Group related filters with prefixes (e.g., "Game: Minecraft", "Game: Fortnite")

---

## Common Workflows

### Workflow 1: Daily Stream Routine

1. Open Blaze dashboard
2. Select "Favorites" filter
3. See which of your favorite streamers are live
4. Visit their streams

### Workflow 2: Discovering New Streamers

1. Browse streams normally (without filter)
2. When you find someone you like, click their name in chat
3. Tag them appropriately (e.g., "New Discoveries")
4. Later, filter by "New Discoveries" to check on them

### Workflow 3: Organizing by Game

1. Create filters for games you watch (e.g., "Minecraft", "Valorant")
2. Tag streamers based on what they play
3. When you're in the mood for a specific game, filter by that game
4. Find streams playing that game instantly

---

## Troubleshooting

### Tag button not appearing?

- Make sure you're clicking on a username **in the chat**
- Try refreshing the page
- Check that the extension is enabled in your browser

### Tags not saving?

- Check browser console (F12) for errors
- Verify you have storage permissions enabled
- Try creating a simple tag name without special characters

### Filter not working on dashboard?

- Make sure you've actually tagged some streamers with that filter
- Refresh the dashboard page
- Check that you're on the main dashboard (https://blaze.stream/)

### Can't find tagged streamer?

- Remember: filters only show **currently live** streamers
- If a tagged streamer is offline, they won't appear in any filter
- Tags persist, so they'll show up next time they're live

---

## Advanced Usage

### Combining with Existing Filters

The custom filters work alongside Blaze's existing filters:
- You can still use "Highest Votes", "Popular Channels", etc.
- Custom filters are just additional options

### Export/Import (Manual)

Currently, the extension doesn't have export/import features, but your data is stored in `chrome.storage.sync`. Advanced users can:

1. Open browser DevTools (F12)
2. Go to Console
3. Run: `chrome.storage.sync.get(['blaze_custom_filters', 'blaze_user_tags'], console.log)`
4. This will show your data (useful for debugging or manual backup)

---

## Feedback & Feature Requests

If you have ideas for new features or improvements, consider:
- Opening an issue on the project repository
- Forking the project and adding features yourself
- Sharing your use cases to help improve the extension

---

## Quick Reference

| Action | Steps |
|--------|-------|
| Tag a streamer | Click username in chat → Click "Tag" button → Select filters |
| Create filter | Tag button → "+ Create new filter" → Enter name → Save |
| Filter dashboard | Dashboard → Click "Highest Votes" dropdown → Select custom filter |
| Remove tag | Tag button → Uncheck filter |
| View tagged streamers | Dashboard → Select filter from dropdown |

---

Happy streaming! 🎥✨
