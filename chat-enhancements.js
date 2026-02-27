// Chat enhancements - Adds tag button to user profile modal

class ChatEnhancer {
  constructor() {
    this.currentUsername = null;
    this.dropdownOpen = false;
    this.init();
  }

  init() {
    // Wait for the page to fully load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupObserver());
    } else {
      this.setupObserver();
    }
  }

  setupObserver() {
    // Watch for user profile modals appearing
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Small delay to let the modal fully render
            setTimeout(() => {
              this.checkForUserModal(node);
              // Also check for channel page buttons
              this.checkForChannelPageButtons(node);
            }, 100);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also check for any existing modals and channel page buttons
    this.checkForUserModal(document.body);

    // Try to add channel page tag button with delays to handle slow loading
    setTimeout(() => this.addChannelPageTagButton(), 500);
    setTimeout(() => this.addChannelPageTagButton(), 1500);
    setTimeout(() => this.addChannelPageTagButton(), 3000);
  }

  checkForUserModal(element) {
    // Look for user profile modals - try multiple selectors
    let modalContainers = element.querySelectorAll('div.max-w-81');

    // Fallback: look for modals with specific structure
    if (modalContainers.length === 0 && element.classList && element.classList.contains('max-w-81')) {
      modalContainers = [element];
    }

    console.log('[Blaze Tag Extension] Found potential modal containers:', modalContainers.length);

    for (const modalContainer of modalContainers) {
      // Skip if we've already processed this modal
      if (modalContainer.querySelector('.blaze-tag-button')) {
        console.log('[Blaze Tag Extension] Skipping - already has tag button');
        continue;
      }

      // Extract username first to verify this is a user modal
      const username = this.extractUsername(modalContainer);
      console.log('[Blaze Tag Extension] Extracted username:', username);

      if (!username) {
        console.log('[Blaze Tag Extension] Skipping - no username found');
        continue;
      }

      this.currentUsername = username;

      // Look for existing button container
      let buttonContainer = modalContainer.querySelector('div.mt-3.flex.flex-row');

      if (buttonContainer) {
        // Button container exists (other user's modal with Follow/Gift buttons)
        console.log('[Blaze Tag Extension] Found button container, adding tag button');
        this.addTagButton(buttonContainer, username);
        this.watchModalContainer(buttonContainer, username);
      } else {
        // No button container (channel owner's modal) - create one
        console.log('[Blaze Tag Extension] No button container, creating for channel owner');
        buttonContainer = this.createButtonContainerForOwner(modalContainer, username);
        if (buttonContainer) {
          this.watchModalContainer(buttonContainer, username);
        }
      }
    }
  }

  createButtonContainerForOwner(modalContainer, username) {
    // Find the section with user info (has flex flex-1 flex-col px-3)
    const userInfoSection = modalContainer.querySelector('.flex.w-full.flex-row.items-start');

    if (!userInfoSection) {
      console.log('[Blaze Tag Extension] Could not find user info section');
      return null;
    }

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mt-3 flex flex-row flex-wrap items-center justify-start gap-1 xl:gap-2';

    // Create tag button without template
    const tagButton = this.createStandaloneTagButton(username);
    buttonContainer.appendChild(tagButton);

    // Insert after user info section
    userInfoSection.parentElement.appendChild(buttonContainer);

    console.log('[Blaze Tag Extension] Created button container for channel owner');
    return buttonContainer;
  }

  createStandaloneTagButton(username) {
    // Create tag button from scratch (no template to clone from)
    const tagButton = document.createElement('button');
    tagButton.type = 'button';
    tagButton.className = 'blaze-tag-button !h-[1.8rem] items-center !rounded-full !px-5 !py-2 text-sm !font-medium transition-[background-color,filter] duration-150 ease-in-out relative isolate inline-flex items-baseline rounded-sm justify-center items-center gap-x-2 font-medium border cursor-pointer text-md focus:outline-hidden filter hover:brightness-85 border-transparent bg-[--btn-border] dark:bg-[--btn-bg] before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-[--btn-bg] before:shadow-sm dark:before:hidden dark:border-white/5 after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] hover:after:bg-[--btn-hover-overlay] text-text border-none [--btn-bg:var(--color-bg-input)] [--btn-icon:var(--color-gray-700)] cursor-pointer';

    tagButton.innerHTML = `
      <span class="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden" aria-hidden="true"></span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
           aria-hidden="true" data-slot="icon" class="stroke-teal-400 !h-4 !w-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
      Tag
    `;

    tagButton.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.toggleDropdown(tagButton, username);
    });

    return tagButton;
  }

  extractUsername(container) {
    // Look for username in the modal structure
    // The username is in: <p data-slot="text" class="cursor-pointer font-semibold...">USERNAME</p>
    const usernameElement = container.querySelector('p[data-slot="text"].cursor-pointer.font-semibold');

    if (usernameElement) {
      const username = usernameElement.textContent.trim();
      console.log('[Blaze Tag Extension] Found username element:', username);
      if (username && username.length > 0 && username.length < 50) {
        return username;
      }
    }

    // Fallback: look for any p[data-slot="text"] that looks like a username
    const textElements = container.querySelectorAll('p[data-slot="text"]');
    for (const el of textElements) {
      const text = el.textContent.trim();
      // Skip elements that contain dates or subscription info
      if (text && text.length > 0 && text.length < 50 &&
          !text.includes('Subscribed') &&
          !text.includes('Following') &&
          !text.includes('months') &&
          !text.includes('202') && // Skip dates
          !text.includes(',')) {
        console.log('[Blaze Tag Extension] Fallback found username:', text);
        return text;
      }
    }

    console.log('[Blaze Tag Extension] Could not extract username');
    return null;
  }

  watchModalContainer(container, username) {
    // Watch for the modal being updated and re-add the button if it disappears
    let isAdding = false; // Prevent infinite loops

    const observer = new MutationObserver((mutations) => {
      // Skip if we're currently adding a button
      if (isAdding) return;

      // Check if tag button still exists
      if (!container.querySelector('.blaze-tag-button')) {
        console.log('[Blaze Tag Extension] Tag button removed by mutation, re-adding');

        isAdding = true;
        setTimeout(() => {
          this.addTagButton(container, username);
          isAdding = false;
        }, 50); // Small delay to let DOM settle
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: false // Only watch direct children, not deep changes
    });

    // Also periodically check if button exists
    const intervalCheck = setInterval(() => {
      if (!document.body.contains(container)) {
        observer.disconnect();
        clearInterval(intervalCheck);
        console.log('[Blaze Tag Extension] Modal closed, stopped watching');
        return;
      }

      // Re-add button if missing
      if (!container.querySelector('.blaze-tag-button') && !isAdding) {
        console.log('[Blaze Tag Extension] Tag button missing on interval check, re-adding');
        isAdding = true;
        this.addTagButton(container, username);
        setTimeout(() => { isAdding = false; }, 100);
      }
    }, 500); // Check every 500ms
  }

  addTagButton(buttonContainer, username) {
    // The container passed is already the button container
    console.log('[Blaze Tag Extension] Adding tag button for user:', username);

    // Find the Gift button to use as a template
    const giftButton = Array.from(buttonContainer.querySelectorAll('button')).find(
      btn => btn.textContent.includes('Gift')
    );

    if (!giftButton) {
      console.log('[Blaze Tag Extension] Could not find Gift button to use as template');
      return;
    }

    // Clone the Gift button to get the exact styling
    const tagButton = giftButton.cloneNode(true);
    tagButton.classList.add('blaze-tag-button');

    // Replace the content with our tag icon and text
    tagButton.innerHTML = `
      <span class="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden" aria-hidden="true"></span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
           aria-hidden="true" data-slot="icon" class="stroke-teal-400 !h-4 !w-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
      Tag
    `;

    tagButton.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.toggleDropdown(tagButton, username);
    });

    console.log('[Blaze Tag Extension] Appending tag button to container');

    // Make sure the button is visible
    tagButton.style.display = '';
    tagButton.style.visibility = 'visible';
    tagButton.style.opacity = '1';

    buttonContainer.appendChild(tagButton);

    // Verify it was added
    setTimeout(() => {
      const found = buttonContainer.querySelector('.blaze-tag-button');
      console.log('[Blaze Tag Extension] Button in DOM after append:', found ? 'YES' : 'NO');
      if (found) {
        console.log('[Blaze Tag Extension] Button computed display:', window.getComputedStyle(found).display);
        console.log('[Blaze Tag Extension] Button computed visibility:', window.getComputedStyle(found).visibility);
      }
    }, 100);
  }

  async toggleDropdown(button, username) {
    // Close any existing dropdown
    const existingDropdown = document.querySelector('.blaze-tag-dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
      this.dropdownOpen = false;
      return;
    }

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'blaze-tag-dropdown';

    // Get user's current tags and all available filters
    const userTags = await BlazeStorage.getUserTags(username);
    const allFilters = await BlazeStorage.getFilters();

    // Build dropdown content
    let dropdownHTML = '<div class="blaze-tag-dropdown-content">';

    // Add filter options
    for (const filter of allFilters) {
      const isChecked = userTags.includes(filter);
      dropdownHTML += `
        <label class="blaze-tag-option">
          <input type="checkbox" value="${this.escapeHtml(filter)}" ${isChecked ? 'checked' : ''}>
          <span>${this.escapeHtml(filter)}</span>
        </label>
      `;
    }

    // Add separator
    dropdownHTML += '<div class="blaze-tag-separator"></div>';

    // Add "Create new filter" option
    dropdownHTML += `
      <div class="blaze-tag-create">
        <button class="blaze-tag-create-btn">+ Create new filter</button>
        <div class="blaze-tag-create-input" style="display: none;">
          <input type="text" placeholder="Filter name..." maxlength="30">
          <button class="blaze-tag-save-btn">Save</button>
          <button class="blaze-tag-cancel-btn">Cancel</button>
        </div>
      </div>
    `;

    dropdownHTML += '</div>';
    dropdown.innerHTML = dropdownHTML;

    // Position dropdown below the button
    const rect = button.getBoundingClientRect();
    dropdown.style.position = 'absolute';
    dropdown.style.top = `${rect.bottom + 5}px`;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.zIndex = '10000';

    document.body.appendChild(dropdown);
    this.dropdownOpen = true;

    // Add event listeners
    this.setupDropdownListeners(dropdown, username);

    // Close dropdown when clicking outside
    setTimeout(() => {
      document.addEventListener('click', this.closeDropdownHandler = (e) => {
        if (!dropdown.contains(e.target) && e.target !== button) {
          dropdown.remove();
          this.dropdownOpen = false;
          document.removeEventListener('click', this.closeDropdownHandler);
        }
      });
    }, 0);
  }

  setupDropdownListeners(dropdown, username) {
    // Checkbox listeners
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', async (e) => {
        const filterName = e.target.value;
        if (e.target.checked) {
          await BlazeStorage.addUserToFilter(username, filterName);
        } else {
          await BlazeStorage.removeUserFromFilter(username, filterName);
        }
      });
    });

    // Create new filter button
    const createBtn = dropdown.querySelector('.blaze-tag-create-btn');
    const createInput = dropdown.querySelector('.blaze-tag-create-input');
    const input = dropdown.querySelector('.blaze-tag-create-input input');
    const saveBtn = dropdown.querySelector('.blaze-tag-save-btn');
    const cancelBtn = dropdown.querySelector('.blaze-tag-cancel-btn');

    createBtn.addEventListener('click', () => {
      createBtn.style.display = 'none';
      createInput.style.display = 'flex';
      input.focus();
    });

    cancelBtn.addEventListener('click', () => {
      createBtn.style.display = 'block';
      createInput.style.display = 'none';
      input.value = '';
    });

    saveBtn.addEventListener('click', async () => {
      const filterName = input.value.trim();
      if (filterName) {
        const success = await BlazeStorage.addFilter(filterName);
        if (success) {
          // Refresh dropdown
          dropdown.remove();
          this.dropdownOpen = false;
          // Could show a success message here
        } else {
          alert('Filter already exists or invalid name');
        }
      }
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveBtn.click();
      }
    });
  }

  checkForChannelPageButtons(element) {
    // Check if this element or its children contain channel page buttons
    const buttonContainers = element.querySelectorAll ?
      element.querySelectorAll('div[class*="flex"][class*="items-center"]') : [];

    for (const container of buttonContainers) {
      const thanksButton = Array.from(container.querySelectorAll('button')).find(btn =>
        btn.textContent.includes('Thanks')
      );

      if (thanksButton && !container.querySelector('.blaze-channel-tag-button')) {
        console.log('[Blaze Tag Extension] Detected channel page buttons via observer');
        this.insertChannelPageTagButton(container, thanksButton);
        break;
      }
    }
  }

  addChannelPageTagButton() {
    console.log('[Blaze Tag Extension] Looking for channel page buttons');

    // Find the button container on the channel page
    // Look for the container with the Thanks, Gift Subs buttons
    const buttonContainers = document.querySelectorAll('div[class*="flex"][class*="items-center"]');

    for (const container of buttonContainers) {
      // Check if this container has "Thanks" button
      const thanksButton = Array.from(container.querySelectorAll('button')).find(btn =>
        btn.textContent.includes('Thanks')
      );

      if (thanksButton && !container.querySelector('.blaze-channel-tag-button')) {
        console.log('[Blaze Tag Extension] Found channel page button container');
        this.insertChannelPageTagButton(container, thanksButton);
        break;
      }
    }
  }

  insertChannelPageTagButton(container, thanksButton) {
    // Extract username from URL (blaze.stream/username)
    const username = window.location.pathname.split('/')[1];

    if (username && username !== '') {
      console.log('[Blaze Tag Extension] Channel username:', username);

      // Create tag button
      const tagButton = this.createChannelPageTagButton(username);

      if (tagButton) {
        // Insert before the Thanks button
        thanksButton.parentElement.insertBefore(tagButton, thanksButton);
        console.log('[Blaze Tag Extension] Added tag button to channel page');
      } else {
        console.error('[Blaze Tag Extension] Failed to create tag button');
      }
    }
  }

  createChannelPageTagButton(username) {
    // Find the "Thanks" button to use as a template
    const allButtons = document.querySelectorAll('button');
    let thanksButton = null;

    for (const btn of allButtons) {
      if (btn.textContent.includes('Thanks')) {
        thanksButton = btn;
        break;
      }
    }

    if (!thanksButton) {
      console.error('[Blaze Tag Extension] Could not find Thanks button to clone styling from');
      return null;
    }

    // Clone the wrapper structure
    const wrapper = thanksButton.parentElement.cloneNode(false);

    // Clone the button with all its classes
    const tagButton = thanksButton.cloneNode(true);
    tagButton.classList.add('blaze-channel-tag-button');

    // Replace the content with tag icon and text
    tagButton.innerHTML = `
      <span class="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden" aria-hidden="true"></span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
           aria-hidden="true" data-slot="icon" class="sm:-ml-1 sm:mr-1 sm:size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
      <span>Tag</span>
    `;

    // Remove any existing click handlers and add our own
    const newButton = tagButton.cloneNode(true);
    newButton.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.toggleDropdown(newButton, username);
    });

    wrapper.appendChild(newButton);
    console.log('[Blaze Tag Extension] Created channel page button by cloning Thanks button');
    return wrapper;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the chat enhancer
const chatEnhancer = new ChatEnhancer();
