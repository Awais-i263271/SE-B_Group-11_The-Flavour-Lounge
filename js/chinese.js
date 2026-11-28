/**
 * JavaScript for the Chinese Cuisine Page (pages/chinese.html)
 * Handles live dish search filtering and Add to Cart actions.
 */

// Timer ID used to auto-hide the confirmation toast after a few seconds
let chineseToastTimer = null;

// Bootstrap Modal instance and active dish name for Noodle Dynasty utensil popup
let noodleUtensilModalInstance = null;
let lastOrderedNoodleName = '';

/**
 * Filter Chinese dish cards across all sections by the user's search text.
 * Hides sections with zero matches, updates the visible dish count, and toggles
 * the empty-search state message when nothing matches.
 * @param {string} searchText - Current value from the Chinese search input.
 */
function filterChineseDishesBySearch(searchText) {
  const cleanSearch = (searchText || '').trim().toLowerCase();
  const sections = document.querySelectorAll('.chinese-category-section');
  const noResultsSection = document.getElementById('no-dishes-message');
  const counterElement = document.getElementById('chinese-visible-count');
  let visibleItemCount = 0;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const cards = section.querySelectorAll('.bistro-card');
    let sectionVisibleCount = 0;

    for (let j = 0; j < cards.length; j++) {
      const card = cards[j];
      const col = card.parentElement;
      const titleEl = card.querySelector('.dish-title');
      const descEl = card.querySelector('.dish-description');
      const tagEl = card.querySelector('.badge-category-tag');

      const searchableText = [
        titleEl ? titleEl.textContent : '',
        descEl ? descEl.textContent : '',
        tagEl ? tagEl.textContent : ''
      ].join(' ').toLowerCase();

      const matches = !cleanSearch || searchableText.indexOf(cleanSearch) !== -1;

      if (col) {
        col.classList.toggle('d-none', !matches);
      }

      if (matches) {
        sectionVisibleCount++;
        visibleItemCount++;
      }
    }

    section.classList.toggle('d-none', sectionVisibleCount === 0);
  }

  if (counterElement) {
    counterElement.textContent = String(visibleItemCount);
  }

  if (noResultsSection) {
    noResultsSection.classList.toggle('d-none', visibleItemCount > 0);
  }
}

/**
 * Reset the Chinese search input and show all dishes again.
 */
function resetChineseSearch() {
  const searchInput = document.getElementById('chinese-search-input');
  if (searchInput) {
    searchInput.value = '';
  }
  filterChineseDishesBySearch('');
}

/**
 * Display a confirmation message in the bottom-right toast banner.
 * Resets any active hide timer so multiple quick clicks stay visible long enough to read.
 * @param {string} messageText - Message text to display inside the toast.
 */
function showChineseToastMessage(messageText) {
  const toastElement = document.getElementById('cart-toast');
  const toastMessage = document.getElementById('cart-toast-message');

  if (!toastElement || !toastMessage) {
    return;
  }

  toastMessage.textContent = messageText;
  toastElement.classList.add('show');

  if (chineseToastTimer !== null) {
    clearTimeout(chineseToastTimer);
  }

  chineseToastTimer = setTimeout(function () {
    toastElement.classList.remove('show');
  }, 2600);
}

/**
 * Display the Mint Green confirmation toast at the bottom-right when an item is added.
 * @param {string} dishName - The name of the dish added to the cart.
 */
function showChineseCartToast(dishName) {
  showChineseToastMessage(dishName + ' added — Order Confirmed!');
}

/**
 * Open the Fork vs. Chopsticks modal when a dish from Noodle Dynasty is ordered.
 * @param {string} dishName - The ordered noodle dish name.
 */
function openNoodleUtensilModal(dishName) {
  lastOrderedNoodleName = dishName || 'your noodles';

  if (noodleUtensilModalInstance) {
    noodleUtensilModalInstance.show();
  }
}

/**
 * Handle choosing Fork or Chopsticks in the Noodle Dynasty popup and close the modal.
 * @param {string} utensilLabel - Chosen utensil label ("Fork" or "Chopsticks").
 */
function handleUtensilChoice(utensilLabel) {
  if (noodleUtensilModalInstance) {
    noodleUtensilModalInstance.hide();
  }

  const dishSuffix = lastOrderedNoodleName ? ' for ' + lastOrderedNoodleName : '';
  showChineseToastMessage(utensilLabel + ' selected' + dishSuffix + ' — no charges apply!');
}

/**
 * Temporarily turn the clicked Add to Cart button Mint Green with "Added!".
 * Restores the original button text after 1.4 seconds.
 * @param {HTMLElement} button - The Add to Cart button element.
 */
function flashChineseButtonAdded(button) {
  const originalHtml = button.getAttribute('data-original-html') || button.innerHTML;
  button.setAttribute('data-original-html', originalHtml);

  button.classList.add('is-confirmed');
  button.innerHTML = '<i class="bi bi-check-lg me-1" aria-hidden="true"></i>Added!';

  setTimeout(function () {
    button.classList.remove('is-confirmed');
    button.innerHTML = originalHtml;
  }, 1400);
}

/**
 * Read dish details from the clicked button's data-* attributes and add it to FlavourCart.
 * Persists the order in localStorage and updates the navbar cart badge.
 * @param {HTMLElement} button - The clicked Add to Cart button.
 */
function addChineseDishToCart(button) {
  const dishItem = {
    id: button.getAttribute('data-id'),
    name: button.getAttribute('data-name'),
    price: Number(button.getAttribute('data-price')),
    quantity: 1,
    image: button.getAttribute('data-image')
  };

  if (window.FlavourCart) {
    window.FlavourCart.addItem(dishItem);
  }

  flashChineseButtonAdded(button);
  showChineseCartToast(dishItem.name);

  if (button.closest('#noodle-dynasty')) {
    openNoodleUtensilModal(dishItem.name);
  }
}

/**
 * Set up all event listeners for the Chinese Cuisine page after the HTML loads.
 * Connects live search filtering, reset button, Noodle Dynasty utensil popup, and Add to Cart buttons.
 */
function initChinesePage() {
  const searchInput = document.getElementById('chinese-search-input');
  const resetButton = document.getElementById('reset-filters-btn');
  const addButtons = document.querySelectorAll('.add-to-cart-btn');
  const utensilModalEl = document.getElementById('noodleUtensilModal');
  const forkBtn = document.getElementById('utensil-fork-btn');
  const chopsticksBtn = document.getElementById('utensil-chopsticks-btn');

  if (utensilModalEl && window.bootstrap && window.bootstrap.Modal) {
    noodleUtensilModalInstance = window.bootstrap.Modal.getOrCreateInstance(utensilModalEl);
  }

  if (forkBtn) {
    forkBtn.addEventListener('click', function () {
      handleUtensilChoice('Fork');
    });
  }

  if (chopsticksBtn) {
    chopsticksBtn.addEventListener('click', function () {
      handleUtensilChoice('Chopsticks');
    });
  }

  // Initialize visible dish count and search filtering
  filterChineseDishesBySearch(searchInput ? searchInput.value : '');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      filterChineseDishesBySearch(this.value);
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', resetChineseSearch);
  }

  // Set up Add to Cart buttons
  for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener('click', function () {
      addChineseDishToCart(this);
    });
  }
}

// Run setup when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initChinesePage);
