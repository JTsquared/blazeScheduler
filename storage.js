// Storage module for managing custom filters and tagged users
// Uses chrome.storage.sync API for cross-device synchronization

const BlazeStorage = {
  // Storage keys
  FILTERS_KEY: 'blaze_custom_filters',
  TAGS_KEY: 'blaze_user_tags',

  /**
   * Initialize storage with default "Favorites" filter
   */
  async init() {
    const filters = await this.getFilters();
    if (!filters.includes('Favorites')) {
      filters.unshift('Favorites');
      await this.saveFilters(filters);
    }
  },

  /**
   * Get all custom filters
   * @returns {Promise<string[]>} Array of filter names
   */
  async getFilters() {
    try {
      const result = await chrome.storage.sync.get(this.FILTERS_KEY);
      return result[this.FILTERS_KEY] || ['Favorites'];
    } catch (error) {
      console.error('Error getting filters:', error);
      return ['Favorites'];
    }
  },

  /**
   * Save filters list
   * @param {string[]} filters - Array of filter names
   */
  async saveFilters(filters) {
    try {
      await chrome.storage.sync.set({ [this.FILTERS_KEY]: filters });
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  },

  /**
   * Add a new custom filter
   * @param {string} filterName - Name of the new filter
   * @returns {Promise<boolean>} Success status
   */
  async addFilter(filterName) {
    if (!filterName || filterName.trim() === '') return false;

    const filters = await this.getFilters();
    const trimmedName = filterName.trim();

    // Check if filter already exists (case-insensitive)
    if (filters.some(f => f.toLowerCase() === trimmedName.toLowerCase())) {
      return false;
    }

    filters.push(trimmedName);
    await this.saveFilters(filters);
    return true;
  },

  /**
   * Delete a custom filter and all associated tags
   * @param {string} filterName - Name of the filter to delete
   */
  async deleteFilter(filterName) {
    // Don't allow deleting "Favorites"
    if (filterName === 'Favorites') return;

    const filters = await this.getFilters();
    const updatedFilters = filters.filter(f => f !== filterName);
    await this.saveFilters(updatedFilters);

    // Remove all tags for this filter
    const tags = await this.getAllTags();
    for (const username in tags) {
      tags[username] = tags[username].filter(f => f !== filterName);
      if (tags[username].length === 0) {
        delete tags[username];
      }
    }
    await this.saveAllTags(tags);
  },

  /**
   * Get all user tags
   * @returns {Promise<Object>} Object mapping usernames to array of filter names
   */
  async getAllTags() {
    try {
      const result = await chrome.storage.sync.get(this.TAGS_KEY);
      return result[this.TAGS_KEY] || {};
    } catch (error) {
      console.error('Error getting tags:', error);
      return {};
    }
  },

  /**
   * Save all tags
   * @param {Object} tags - Object mapping usernames to filter arrays
   */
  async saveAllTags(tags) {
    try {
      await chrome.storage.sync.set({ [this.TAGS_KEY]: tags });
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  },

  /**
   * Get filters for a specific user
   * @param {string} username - The username
   * @returns {Promise<string[]>} Array of filter names this user is tagged in
   */
  async getUserTags(username) {
    const tags = await this.getAllTags();
    return tags[username] || [];
  },

  /**
   * Add a user to a filter
   * @param {string} username - The username
   * @param {string} filterName - The filter to add them to
   */
  async addUserToFilter(username, filterName) {
    const tags = await this.getAllTags();

    if (!tags[username]) {
      tags[username] = [];
    }

    if (!tags[username].includes(filterName)) {
      tags[username].push(filterName);
      await this.saveAllTags(tags);
    }
  },

  /**
   * Remove a user from a filter
   * @param {string} username - The username
   * @param {string} filterName - The filter to remove them from
   */
  async removeUserFromFilter(username, filterName) {
    const tags = await this.getAllTags();

    if (tags[username]) {
      tags[username] = tags[username].filter(f => f !== filterName);

      if (tags[username].length === 0) {
        delete tags[username];
      }

      await this.saveAllTags(tags);
    }
  },

  /**
   * Check if a user is in a specific filter
   * @param {string} username - The username
   * @param {string} filterName - The filter to check
   * @returns {Promise<boolean>}
   */
  async isUserInFilter(username, filterName) {
    const userTags = await this.getUserTags(username);
    return userTags.includes(filterName);
  },

  /**
   * Get all users in a specific filter
   * @param {string} filterName - The filter name
   * @returns {Promise<string[]>} Array of usernames
   */
  async getUsersInFilter(filterName) {
    const tags = await this.getAllTags();
    const users = [];

    for (const username in tags) {
      if (tags[username].includes(filterName)) {
        users.push(username);
      }
    }

    return users;
  }
};

// Initialize storage when the script loads
BlazeStorage.init();

// Make it available globally
window.BlazeStorage = BlazeStorage;
