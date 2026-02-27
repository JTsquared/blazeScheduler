// Dashboard filters - Adds custom tag filters to the main dashboard dropdown

class DashboardFilterEnhancer {
  constructor() {
    this.currentFilter = null;
    this.activeFilterUsers = null;
    this.filterObserver = null;
    this.removedElements = [];
    this.isFiltering = false;
    this.filterDebounceTimer = null;
    this.processedUsernames = new Set();
    this.init();
  }

  init() {
    console.log('[Blaze Dashboard] Initializing');

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    console.log('[Blaze Dashboard] Setting up UI');

    // Find and enhance the filter dropdown
    this.findAndEnhanceDropdown();

    // Watch for dropdown menu appearing
    this.observeDropdownMenu();
  }

  async applyCustomFilter(filterName) {
    console.log('[Blaze Dashboard] Applying custom filter:', filterName);

    // Get users in this filter
    const usersInFilter = await BlazeStorage.getUsersInFilter(filterName);
    console.log('[Blaze Dashboard] Users in filter:', usersInFilter);

    if (usersInFilter.length === 0) {
      alert(`No users tagged in "${filterName}". Tag some users first!`);
      return;
    }

    // Clear previous tracking
    this.removedElements = [];
    this.processedUsernames.clear();

    // Store the active filter
    this.currentFilter = filterName;
    this.activeFilterUsers = usersInFilter;

    // Create filtered results container
    this.createFilteredResultsContainer(filterName);

    // Apply filter by cloning matching streams
    console.log('[Blaze Dashboard] Creating filtered view');
    this.createFilteredView(usersInFilter, filterName);

    // Set up continuous filtering for dynamically loaded streams
    this.setupContinuousFiltering();

    console.log('[Blaze Dashboard] Filter applied. Continuous filtering active. To clear, select "Highest Votes".');
  }

  createFilteredResultsContainer(filterName) {
    // Remove any existing filtered container
    const existing = document.getElementById('blaze-filtered-results');
    if (existing) {
      existing.remove();
    }

    // Find the grid container that holds all streams
    const originalGrid = document.querySelector('div.mt-3.grid');
    if (!originalGrid) {
      console.error('[Blaze Dashboard] Could not find stream grid');
      return;
    }

    // Store reference to original grid and its parent container
    this.originalGrid = originalGrid;
    this.originalGridParent = originalGrid.parentElement;

    // Create a new container for filtered results with same styling as original
    const container = document.createElement('div');
    container.id = 'blaze-filtered-results';
    container.className = originalGrid.className; // Copy all classes from original grid

    // Insert the filtered container before the parent container (to avoid skeleton cards)
    if (this.originalGridParent && this.originalGridParent.parentElement) {
      this.originalGridParent.parentElement.insertBefore(container, this.originalGridParent);
    } else {
      // Fallback: insert before the grid itself
      originalGrid.parentElement.insertBefore(container, originalGrid);
    }

    console.log('[Blaze Dashboard] Created filtered results container');
  }

  createFilteredView(usersInFilter, filterName) {
    // Find the filtered results container
    const filteredContainer = document.getElementById('blaze-filtered-results');
    if (!filteredContainer) {
      console.error('[Blaze Dashboard] Filtered container not found');
      return;
    }

    // Clear previous results
    filteredContainer.innerHTML = '';

    // Find all stream card links
    const allStreamLinks = document.querySelectorAll('a[href^="/"]');
    const matchingStreams = [];

    allStreamLinks.forEach(link => {
      const href = link.getAttribute('href');
      const username = href?.substring(1);

      // Check if this is a stream card link
      if (username && !username.includes('/') && username !== '' &&
          link.classList.contains('group') && link.classList.contains('flex')) {

        // Check if it matches our filter
        const matches = usersInFilter.some(filterUsername =>
          filterUsername.toLowerCase() === username.toLowerCase()
        );

        if (matches) {
          matchingStreams.push({ link, username });
          console.log('[Blaze Dashboard] ✓ Found matching stream:', username);
        }
      }
    });

    console.log('[Blaze Dashboard] Found', matchingStreams.length, 'matching streams');

    // Clone matching streams into filtered container
    matchingStreams.forEach(({ link, username }) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'min-w-0';
      const clone = link.cloneNode(true);
      wrapper.appendChild(clone);
      filteredContainer.appendChild(wrapper);

      this.processedUsernames.add(username);
    });

    // Hide the original stream grid
    this.hideOriginalGrid();

    // Show message if no matches
    if (matchingStreams.length === 0) {
      this.showNoStreamsMessage(filterName);
    }
  }

  hideOriginalGrid() {
    // Hide the entire parent container (which includes original grid and skeleton cards)
    if (this.originalGridParent) {
      this.originalGridParent.style.display = 'none';
      console.log('[Blaze Dashboard] Hidden entire original grid parent container');
    } else if (this.originalGrid) {
      // Fallback: just hide the grid itself
      this.originalGrid.style.display = 'none';
      console.log('[Blaze Dashboard] Hidden original grid (fallback)');
    }
  }

  clearCustomFilter() {
    console.log('[Blaze Dashboard] Clearing custom filter - reloading page');

    // Clean up observer and timers
    if (this.filterObserver) {
      this.filterObserver.disconnect();
      this.filterObserver = null;
    }
    if (this.filterDebounceTimer) {
      clearTimeout(this.filterDebounceTimer);
      this.filterDebounceTimer = null;
    }

    // Reset state
    this.currentFilter = null;
    this.activeFilterUsers = null;
    this.processedUsernames.clear();

    // Reload the page to reset everything
    window.location.reload();
  }


  setupContinuousFiltering() {
    // Remove existing observer if any
    if (this.filterObserver) {
      this.filterObserver.disconnect();
    }

    // Watch for new stream items being added (due to virtual scrolling)
    this.filterObserver = new MutationObserver(() => {
      if (!this.currentFilter || !this.activeFilterUsers) {
        return;
      }

      // Debounce the filtering to avoid excessive calls
      if (this.filterDebounceTimer) {
        clearTimeout(this.filterDebounceTimer);
      }

      this.filterDebounceTimer = setTimeout(() => {
        // Prevent re-entrant calls
        if (this.isFiltering) {
          return;
        }

        // Check for newly loaded streams and add matching ones
        this.addNewMatchingStreams(this.activeFilterUsers);
      }, 100); // Wait 100ms after last mutation
    });

    // Observe the original grid for changes (virtual scrolling adds/removes streams)
    if (this.originalGrid) {
      this.filterObserver.observe(this.originalGrid, {
        childList: true,
        subtree: true
      });
      console.log('[Blaze Dashboard] Set up continuous filtering for virtual scrolling');
    } else {
      console.error('[Blaze Dashboard] Cannot set up continuous filtering - original grid not found');
    }
  }

  addNewMatchingStreams(usersInFilter) {
    this.isFiltering = true;

    try {
      const filteredContainer = document.getElementById('blaze-filtered-results');
      if (!filteredContainer) return;

      // Find all stream card links
      const allStreamLinks = document.querySelectorAll('a[href^="/"]');
      let newMatches = 0;

      allStreamLinks.forEach(link => {
        const href = link.getAttribute('href');
        const username = href?.substring(1);

        // Check if this is a stream card link
        if (username && !username.includes('/') && username !== '' &&
            link.classList.contains('group') && link.classList.contains('flex')) {

          // Skip if we've already processed this username
          if (this.processedUsernames.has(username)) {
            return;
          }

          // Check if it matches our filter
          const matches = usersInFilter.some(filterUsername =>
            filterUsername.toLowerCase() === username.toLowerCase()
          );

          if (matches) {
            console.log('[Blaze Dashboard] ✓ Adding newly loaded stream:', username);
            const wrapper = document.createElement('div');
            wrapper.className = 'min-w-0';
            const clone = link.cloneNode(true);
            wrapper.appendChild(clone);
            filteredContainer.appendChild(wrapper);

            this.processedUsernames.add(username);
            newMatches++;
          }
        }
      });

      if (newMatches > 0) {
        console.log('[Blaze Dashboard] Added', newMatches, 'new matching streams');
      }
    } finally {
      this.isFiltering = false;
    }
  }


  showNoStreamsMessage(filterName) {
    // Remove any existing message
    const existingMessage = document.querySelector('.blaze-no-streams-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Find the filtered container
    const filteredContainer = document.getElementById('blaze-filtered-results');
    if (!filteredContainer) {
      console.error('[Blaze Dashboard] Could not find filtered container for message');
      return;
    }

    // Create no streams message
    const message = document.createElement('div');
    message.className = 'blaze-no-streams-message';
    message.style.cssText = 'grid-column: 1 / -1; padding: 60px 20px; text-align: center; color: rgba(255,255,255,0.6);';
    message.innerHTML = `
      <p style="font-size: 20px; font-weight: 600; margin-bottom: 12px; color: rgba(255,255,255,0.8);">
        No live streams found in "${this.escapeHtml(filterName)}"
      </p>
      <p style="font-size: 14px; color: rgba(255,255,255,0.5);">
        The tagged users are currently offline. Try a different filter or check back later.
      </p>
    `;

    filteredContainer.appendChild(message);
    console.log('[Blaze Dashboard] Displayed no streams message');
  }


  findAndEnhanceDropdown() {
    // Look for the "Highest Votes" button
    const buttons = document.querySelectorAll('button');

    for (const button of buttons) {
      if (button.textContent.includes('Highest Votes') ||
          button.textContent.includes('Popular Channels') ||
          button.textContent.includes('New Channels') ||
          button.textContent.includes('Recently Started')) {
        this.filterButton = button;
        break;
      }
    }

    if (this.filterButton) {
      // Add click listener to detect when dropdown opens
      this.filterButton.addEventListener('click', () => {
        setTimeout(() => this.enhanceDropdownMenu(), 100);
      });
    }
  }

  observeDropdownMenu() {
    // Watch for dropdown menu appearing in the DOM
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if this is a dropdown menu
            const dropdowns = node.querySelectorAll('[role="menu"], [class*="dropdown"]');
            if (dropdowns.length > 0 || node.getAttribute('role') === 'menu') {
              this.enhanceDropdownMenu();
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  async enhanceDropdownMenu() {
    // Get all custom filters first
    const customFilters = await BlazeStorage.getFilters();
    if (customFilters.length === 0) return;

    // Find all option elements (HeadlessUI uses role="option")
    const allOptions = Array.from(document.querySelectorAll('[role="option"]'));

    console.log('[Blaze Dashboard] Found options:', allOptions.length);
    allOptions.forEach(opt => console.log('[Blaze Dashboard] Option text:', opt.textContent.trim()));

    // Look for the "Recently Started" option as it's the last default option
    let recentlyStartedOption = null;
    for (const option of allOptions) {
      const text = option.textContent.trim();
      if (text === 'Recently Started') {
        recentlyStartedOption = option;
        break;
      }
    }

    // Add click handlers to built-in filter options to clear custom filtering
    const builtInFilters = ['Highest Votes', 'Popular Channels', 'New Channels', 'Recently Started'];
    allOptions.forEach(option => {
      const text = option.textContent.trim();
      if (builtInFilters.includes(text)) {
        option.addEventListener('click', () => {
          // Only clear if a custom filter is currently active
          if (this.currentFilter) {
            console.log('[Blaze Dashboard] Built-in filter clicked, clearing custom filter');
            this.clearCustomFilter();
          }
        });
      }
    });

    if (!recentlyStartedOption) {
      console.log('[Blaze Dashboard] Could not find Recently Started option');
      return;
    }

    console.log('[Blaze Dashboard] Found Recently Started option');

    // Check if we've already added our filters by looking after this option
    if (recentlyStartedOption.nextElementSibling?.classList.contains('blaze-custom-filter-marker')) {
      console.log('[Blaze Dashboard] Already added filters, skipping');
      return;
    }

    // Create a marker element so we don't add duplicates
    const marker = document.createElement('div');
    marker.className = 'blaze-custom-filter-marker';
    marker.style.display = 'none';

    // Insert marker after the "Recently Started" option
    recentlyStartedOption.parentElement.insertBefore(marker, recentlyStartedOption.nextSibling);
    console.log('[Blaze Dashboard] Inserted marker after Recently Started');

    // Add each custom filter as an option
    for (const filter of customFilters) {
      console.log('[Blaze Dashboard] Adding filter:', filter);
      const filterOption = this.createFilterOption(filter, recentlyStartedOption);
      // Insert after the marker
      marker.parentElement.insertBefore(filterOption, marker.nextSibling);
      console.log('[Blaze Dashboard] Inserted filter option for:', filter);
    }
  }

  createFilterOption(filterName, templateOption) {
    // Clone the template option to get all the correct classes and structure
    const option = templateOption.cloneNode(true);

    // Add our custom class
    option.classList.add('blaze-custom-filter-option');

    // Generate a unique ID
    option.id = `blaze-custom-filter-${filterName.replace(/\s+/g, '-').toLowerCase()}`;

    // Find the span that contains the text and replace it
    const textSpan = option.querySelector('span[class*="block"]');
    if (textSpan) {
      textSpan.textContent = filterName;
    }

    // Add click handler
    option.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log('[Blaze Dashboard] Custom filter clicked:', filterName);

      // Close dropdown
      document.body.click();

      // Update button text
      if (this.filterButton) {
        const textSpan = this.filterButton.querySelector('span');
        if (textSpan) {
          textSpan.textContent = filterName;
        }
      }

      // Apply the custom filter (fetches fresh data)
      await this.applyCustomFilter(filterName);
    });

    return option;
  }


  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the dashboard filter enhancer
const dashboardFilterEnhancer = new DashboardFilterEnhancer();
