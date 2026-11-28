/**
 * JavaScript for the Chinese Cuisine Page (pages/chinese.html)
 * Handles sub-category filtering (Starters, Mains, Noodles & Rice, Sauces) and Add to Cart actions.
 */

// Timer ID used to auto-hide the confirmation toast after a few seconds
let chineseToastTimer = null;

/**
 * Show only the Chinese category sections that match the chosen filter
 * ("all", "starters", "mains", "noodles-rice", or "sauces").
 * Updates the visible item count in the filter toolbar.
 * @param {string} selectedCategory - The category key from the clicked filter button.
 */
function filterChineseDishes(selectedCategory) {
  const sections = document.querySelectorAll('.chinese-category-section');
  let visibleItemCount = 0;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const sectionCategory = section.getAttribute('data-section-category');

    if (selectedCategory === 'all' || sectionCategory === selectedCategory) {
      section.classList.remove('d-none');
      const cardsInSection = section.querySelectorAll('.bistro-card');
      visibleItemCount += cardsInSection.length;
    } else {
      section.classList.add('d-none');
    }
  }

  const counterElement = document.getElementById('chinese-visible-count');
  if (counterElement) {
    counterElement.textContent = String(visibleItemCount);
  }
}

/**
 * Highlight the clicked filter button and set aria-pressed for keyboard/screen-reader accessibility.
 * Keeps the active Tangerine Orange button state synced with what is shown on screen.
 * @param {NodeList} allButtons - All Chinese category filter buttons.
 * @param {HTMLElement} activeButton - The button that was clicked.
 */
function updateChineseFilterButtons(allButtons, activeButton) {
  for (let i = 0; i < allButtons.length; i++) {
    const button = allButtons[i];
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
  }

  activeButton.classList.add('active');
  activeButton.setAttribute('aria-pressed', 'true');
}

/**
 * Display the Mint Green confirmation toast at the bottom-right when an item is added.
 * Resets any active hide timer so multiple quick clicks stay visible long enough to read.
 * @param {string} dishName - The name of the dish added to the cart.
 */
function showChineseCartToast(dishName) {
  const toastElement = document.getElementById('cart-toast');
  const toastMessage = document.getElementById('cart-toast-message');

  if (!toastElement || !toastMessage) {
    return;
  }

  toastMessage.textContent = dishName + ' added — Order Confirmed!';
  toastElement.classList.add('show');

  if (chineseToastTimer !== null) {
    clearTimeout(chineseToastTimer);
  }

  chineseToastTimer = setTimeout(function () {
    toastElement.classList.remove('show');
  }, 2600);
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
}

/**
 * Set up all event listeners for the Chinese Cuisine page after the HTML loads.
 * Connects sub-category filter buttons and Add to Cart buttons.
 */
function initChinesePage() {
  const filterButtons = document.querySelectorAll('[data-chinese-filter]');
  const addButtons = document.querySelectorAll('.add-to-cart-btn');

  // Set up sub-category filtering
  for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener('click', function () {
      const selectedCategory = this.getAttribute('data-chinese-filter');
      updateChineseFilterButtons(filterButtons, this);
      filterChineseDishes(selectedCategory);
    });
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
