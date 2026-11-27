/**
 * JavaScript for Desi Dastarkhwan (pages/desi-cuisine.html)
 * Dynamically renders Biryani Bazaar & Karahi Kingdom from JavaScript arrays,
 * powers live search & category filtering, smooth #anchor scrolling,
 * placeholder openCustomizer(dishId), and the smart 3-second Naan suggestion modal.
 */

// Fallback image used if any dish photo fails to load
const DESI_FALLBACK_IMAGE = '../images/Karachi Biryani.png';

// SessionStorage key remembering if the user clicked "No I'm good" on the Naan popup
const NAAN_DISMISSED_SESSION_KEY = 'desiNaanPopupDismissed';

// Teammate page URL where naan can be ordered
const NAAN_PAGE_URL = 'add-ons.html#naan';

// Array of Biryani Bazaar dishes
const biryaniDishes = [
  {
    id: 'biryani-karachi',
    category: 'biryani',
    name: 'Karachi Biryani',
    price: 650,
    rating: '4.9',
    description: 'Bold Karachi-style layered chicken biryani with tender potatoes, saffron, and whole spices.',
    image: '../images/Karachi Biryani.png',
    alt: 'Steaming plate of Karachi Biryani with spiced chicken and golden potatoes'
  },
  {
    id: 'biryani-sindhi',
    category: 'biryani',
    name: 'Sindhi Biryani',
    price: 690,
    rating: '4.8',
    description: 'Tangy and aromatic Sindhi feast featuring green chillies, dried plums, fresh mint, and rich gravy.',
    image: '../images/Sindhi Biryani.png',
    alt: 'Vibrant Sindhi Biryani garnished with mint leaves and green chillies'
  },
  {
    id: 'biryani-hyderabadi',
    category: 'biryani',
    name: 'Hyderabadi Biryani',
    price: 720,
    rating: '4.8',
    description: 'Royal dum biryani marinated in spiced yogurt, kewra water, saffron strands, and crispy onions.',
    image: '../images/Hyderabadi Biryani.png',
    alt: 'Hyderabadi Biryani topped with crispy fried onions and fresh herbs'
  },
  {
    id: 'biryani-lucknowi',
    category: 'biryani',
    name: 'Lucknowi Biryani',
    price: 740,
    rating: '4.8',
    description: 'Delicate Awadhi-style basmati rice infused with slow-simmered yakhni broth and cardamom.',
    image: '../images/Lucknowi Biryani.png',
    alt: 'Fragrant Lucknowi Biryani cooked in delicate spiced yakhni stock'
  },
  {
    id: 'biryani-afghani',
    category: 'biryani',
    name: 'Afghani Biryani',
    price: 750,
    rating: '4.8',
    description: 'Long-grain rice layered with tender meat, sweet caramelized raisins, and julienned carrots.',
    image: '../images/Afghani Biryani.png',
    alt: 'Afghani Biryani garnished with sweet raisins and sautéed carrots'
  },
  {
    id: 'biryani-beef',
    category: 'biryani',
    name: 'Beef Biryani',
    price: 780,
    rating: '4.9',
    description: 'Slow-braised beef morsels steamed under aromatic saffron basmati rice with roasted garam masala.',
    image: '../images/Beef Biryani.png',
    alt: 'Beef Biryani served hot with tender spiced beef chunks'
  },
  {
    id: 'biryani-matka',
    category: 'biryani',
    name: 'Matka Biryani',
    price: 850,
    rating: '4.9',
    description: 'Sealed and slow-steamed in a traditional clay pot to lock in smoky dum flavour.',
    image: '../images/Matka Biryani.png',
    alt: 'Matka Biryani served straight from a sealed earthen clay pot'
  },
  {
    id: 'biryani-mutton-bbq',
    category: 'biryani',
    name: 'Mutton BBQ Biryani',
    price: 990,
    rating: '5.0',
    description: 'Charcoal-grilled smoky mutton tikka layered over spiced saffron biryani rice.',
    image: '../images/Mutton BBQ Biryani.png',
    alt: 'Mutton BBQ Biryani crowned with charcoal-grilled mutton pieces'
  }
];

// Array of Karahi Kingdom dishes (9 authentic Pakistani karahis & gosht dishes)
const karahiDishes = [
  {
    id: 'karahi-chicken',
    category: 'karahi',
    name: 'Chicken Karahi',
    price: 1450,
    rating: '4.9',
    description: 'Classic Lahori iron-wok karahi simmered with ripe tomatoes, crushed coriander, and fresh ginger.',
    image: '../images/Chicken Karahi.jpg',
    alt: 'Sizzling Chicken Karahi garnished with ginger juliennes and green chillies'
  },
  {
    id: 'karahi-peshawari',
    category: 'karahi',
    name: 'Chicken Peshawari Karahi',
    price: 1600,
    rating: '4.9',
    description: 'Rustic frontier-style chicken cooked on high flame with vine tomatoes, garlic, and black pepper.',
    image: '../images/Chicken Peshawari Karahi.jpg',
    alt: 'Chicken Peshawari Karahi with bright tomato masala and coriander'
  },
  {
    id: 'karahi-shinwari',
    category: 'karahi',
    name: 'Chicken Shinwari Karahi',
    price: 1650,
    rating: '4.9',
    description: 'Khyber-style wok karahi celebrating pure tomato sweetness, pink salt, and cracked black pepper.',
    image: '../images/Chicken Shinwari Karahi.jpg',
    alt: 'Chicken Shinwari Karahi cooked with whole tomatoes and fresh chillies'
  },
  {
    id: 'karahi-handi',
    category: 'karahi',
    name: 'Chicken Handi Karahi',
    price: 1550,
    rating: '4.8',
    description: 'Boneless chicken tenders slow-simmered in a creamy yogurt, butter, and roasted cumin gravy.',
    image: '../images/Chicken Handi Karahi.jpg',
    alt: 'Creamy Chicken Handi Karahi topped with fresh ginger and cilantro'
  },
  {
    id: 'karahi-makhni',
    category: 'karahi',
    name: 'Makhni Karahi',
    price: 1750,
    rating: '4.9',
    description: 'Velvety butter-finished karahi infused with fenugreek leaves, cashews, and smooth dairy cream.',
    image: '../images/Makhni Karahi.jpg',
    alt: 'Golden Makhni Karahi finished with melted butter and cream'
  },
  {
    id: 'karahi-beef',
    category: 'karahi',
    name: 'Beef Karahi',
    price: 1950,
    rating: '4.8',
    description: 'Fork-tender beef simmered in high-flame iron karahi with roasted whole spices and ginger.',
    image: '../images/Beef Karahi.jpg',
    alt: 'Beef Karahi served sizzling in a rich spiced tomato gravy'
  },
  {
    id: 'karahi-mutton',
    category: 'karahi',
    name: 'Mutton Karahi',
    price: 2450,
    rating: '4.9',
    description: 'Fresh bone-in goat cuts braised with vine tomatoes, desi ghee, crushed cumin, and chillies.',
    image: '../images/Mutton Karahi.jpg',
    alt: 'Traditional Mutton Karahi garnished with sliced ginger and coriander'
  },
  {
    id: 'karahi-mutton-nalli',
    category: 'karahi',
    name: 'Mutton Nalli Karahi',
    price: 2750,
    rating: '5.0',
    description: 'Succulent marrow-rich mutton shanks slow-cooked in a deeply spiced tomato reduction.',
    image: '../images/Mutton Nalli Karahi.jpg',
    alt: 'Mutton Nalli Karahi featuring marrow shanks in dark rich masala'
  },
  {
    id: 'karahi-namkeen-gosht',
    category: 'karahi',
    name: 'Mutton Namkeen Gosht',
    price: 2550,
    rating: '4.9',
    description: 'Traditional Peshawari slow-roasted mutton seasoned gently with rock salt, garlic, and pepper.',
    image: '../images/Mutton Namkeen Gosht.jpg',
    alt: 'Mutton Namkeen Gosht roasted with rock salt and green chillies'
  }
];

// Current filter and search state
let currentFilter = 'all';
let currentSearchText = '';

// Timer & modal tracking variables for the smart Naan popup & Plate Customizer
let toastHideTimer = null;
let naanPopupTimer = null;
let naanModalInstance = null;
let customizerModalInstance = null;

// Portion pricing multipliers & Biryani Aloo add-on price
const PORTION_CONFIG = {
  half: { label: 'Half', multiplier: 0.7 },
  full: { label: 'Full', multiplier: 1.0 },
  family: { label: 'Family', multiplier: 2.0 }
};

const SPICE_LABELS = {
  mild: 'Mild',
  medium: 'Medium',
  spicy: 'Spicy'
};

const ALOO_EXTRA_PRICE = 50;

// Active state of the currently open Plate Customizer modal
const customizerState = {
  dish: null,
  spice: null,
  portion: null,
  aloo: null,
  quantity: 1
};

/**
 * Swap a broken dish image with a valid local fallback image so cards never collapse.
 * Clears onerror after firing once so it cannot loop.
 * @param {HTMLImageElement} imgElement - The image element that failed to load.
 */
function handleDesiImageError(imgElement) {
  imgElement.onerror = null;
  imgElement.src = DESI_FALLBACK_IMAGE;
}

/**
 * Format a numeric price in Pakistani Rupees (for example: 1650 -> "Rs. 1,650").
 * Makes card prices consistent and easy to read.
 * @param {number} amount - Price in PKR.
 * @returns {string} Formatted price label.
 */
function formatRupees(amount) {
  return 'Rs. ' + Number(amount).toLocaleString('en-PK');
}

/**
 * Check whether a dish matches the user's current search text.
 * Matches both dish name and description without case sensitivity.
 * @param {Object} dish - Dish object from biryaniDishes or karahiDishes.
 * @param {string} searchText - Current text from the search box.
 * @returns {boolean} True if the dish matches or the search box is empty.
 */
function dishMatchesSearch(dish, searchText) {
  if (!searchText) {
    return true;
  }
  const cleanSearch = searchText.trim().toLowerCase();
  const nameMatch = dish.name.toLowerCase().indexOf(cleanSearch) !== -1;
  const descMatch = dish.description.toLowerCase().indexOf(cleanSearch) !== -1;
  return nameMatch || descMatch;
}

/**
 * Build a single responsive Bootstrap dish card element for either Biryani or Karahi.
 * Each card includes an image with onerror fallback and a "Customize Your Plate" button.
 * @param {Object} dish - Dish object containing id, name, price, rating, description, image, alt.
 * @returns {HTMLDivElement} Column wrapper containing the rendered card.
 */
function createDesiDishCard(dish) {
  const col = document.createElement('div');
  col.className = 'col-12 col-md-6 col-lg-4';

  const card = document.createElement('article');
  card.className = 'bistro-card';

  // Image container + Mint Green availability badge + Saffron category tag
  const imgWrap = document.createElement('div');
  imgWrap.className = 'bistro-card-img-wrap';

  const img = document.createElement('img');
  img.src = dish.image;
  img.alt = dish.alt;
  img.className = 'bistro-card-img';
  img.onerror = function () {
    handleDesiImageError(this);
  };

  const statusBadge = document.createElement('span');
  statusBadge.className = 'badge-mint badge-mint-floating';
  statusBadge.textContent = 'Available';

  const categoryTag = document.createElement('span');
  categoryTag.className = 'badge-category-tag';
  categoryTag.textContent = dish.category === 'biryani' ? 'Biryani' : 'Karahi';

  imgWrap.appendChild(img);
  imgWrap.appendChild(statusBadge);
  imgWrap.appendChild(categoryTag);

  // Card body
  const body = document.createElement('div');
  body.className = 'bistro-card-body';

  const headerRow = document.createElement('div');
  headerRow.className = 'd-flex justify-content-between align-items-start gap-2 mb-1';

  const title = document.createElement('h3');
  title.className = 'dish-title';
  title.textContent = dish.name;

  const rating = document.createElement('span');
  rating.className = 'dish-rating';
  rating.innerHTML = '<i class="bi bi-star-fill" aria-hidden="true"></i> ' + dish.rating;

  headerRow.appendChild(title);
  headerRow.appendChild(rating);

  const description = document.createElement('p');
  description.className = 'dish-description';
  description.textContent = dish.description;

  const footerRow = document.createElement('div');
  footerRow.className =
    'd-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25';

  const price = document.createElement('span');
  price.className = 'dish-price';
  price.textContent = formatRupees(dish.price);

  const customizeBtn = document.createElement('button');
  customizeBtn.type = 'button';
  customizeBtn.className = 'btn btn-bistro-primary btn-sm customize-plate-btn';
  customizeBtn.setAttribute('data-dish-id', dish.id);
  customizeBtn.innerHTML = '<i class="bi bi-sliders me-1" aria-hidden="true"></i>Customize Your Plate';
  customizeBtn.addEventListener('click', function () {
    openCustomizer(dish.id);
  });

  footerRow.appendChild(price);
  footerRow.appendChild(customizeBtn);

  body.appendChild(headerRow);
  body.appendChild(description);
  body.appendChild(footerRow);

  card.appendChild(imgWrap);
  card.appendChild(body);
  col.appendChild(card);

  return col;
}

/**
 * Filter a dish array by the current search text and render matching cards into a grid container.
 * Returns how many dishes were rendered so the caller knows whether to hide the section.
 * @param {Array<Object>} dishes - Source array (biryaniDishes or karahiDishes).
 * @param {string} gridId - DOM id of the row container.
 * @returns {number} Count of dishes rendered in this section.
 */
function renderCategoryGrid(dishes, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) {
    return 0;
  }

  grid.innerHTML = '';
  let renderedCount = 0;

  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    if (dishMatchesSearch(dish, currentSearchText)) {
      grid.appendChild(createDesiDishCard(dish));
      renderedCount++;
    }
  }

  return renderedCount;
}

/**
 * Render both Biryani Bazaar and Karahi Kingdom based on the active filter and search box.
 * Shows "No dishes found" when neither section has any matching dishes.
 */
function renderDesiMenu() {
  const biryaniSection = document.getElementById('biryani');
  const karahiSection = document.getElementById('karahi');
  const noResultsSection = document.getElementById('no-dishes-message');
  const counterElement = document.getElementById('desi-visible-count');

  let biryaniCount = 0;
  let karahiCount = 0;

  if (currentFilter === 'all' || currentFilter === 'biryani') {
    biryaniCount = renderCategoryGrid(biryaniDishes, 'biryani-grid');
  }

  if (currentFilter === 'all' || currentFilter === 'karahi') {
    karahiCount = renderCategoryGrid(karahiDishes, 'karahi-grid');
  }

  if (biryaniSection) {
    if (biryaniCount > 0) {
      biryaniSection.classList.remove('d-none');
    } else {
      biryaniSection.classList.add('d-none');
    }
  }

  if (karahiSection) {
    if (karahiCount > 0) {
      karahiSection.classList.remove('d-none');
    } else {
      karahiSection.classList.add('d-none');
    }
  }

  const totalMatches = biryaniCount + karahiCount;

  if (counterElement) {
    counterElement.textContent = String(totalMatches);
  }

  if (noResultsSection) {
    if (totalMatches === 0) {
      noResultsSection.classList.remove('d-none');
    } else {
      noResultsSection.classList.add('d-none');
    }
  }
}

/**
 * Update active visual styling and aria-pressed state on the All / Biryani / Karahi buttons.
 * Ensures screen readers and keyboard users know which filter is active.
 * @param {NodeList} allButtons - All filter buttons.
 * @param {HTMLElement} activeButton - The clicked filter button.
 */
function setActiveFilterButton(allButtons, activeButton) {
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].classList.remove('active');
    allButtons[i].setAttribute('aria-pressed', 'false');
  }
  activeButton.classList.add('active');
  activeButton.setAttribute('aria-pressed', 'true');
}

/**
 * Show a temporary Mint Green notification banner at the bottom-right corner.
 * Used here to give feedback when the placeholder customizer is clicked.
 * @param {string} messageText - Message to display in the toast.
 */
function showDesiToast(messageText) {
  const toastElement = document.getElementById('cart-toast');
  const toastMessage = document.getElementById('cart-toast-message');

  if (!toastElement || !toastMessage) {
    return;
  }

  toastMessage.textContent = messageText;
  toastElement.classList.add('show');

  if (toastHideTimer !== null) {
    clearTimeout(toastHideTimer);
  }

  toastHideTimer = setTimeout(function () {
    toastElement.classList.remove('show');
  }, 2600);
}

/**
 * Find a dish object by its id across both Biryani and Karahi arrays.
 * Helps openCustomizer(dishId) look up the selected dish cleanly.
 * @param {string} dishId - Unique id of the dish.
 * @returns {Object | null} The matching dish object, or null if not found.
 */
function findDesiDishById(dishId) {
  const allDishes = biryaniDishes.concat(karahiDishes);
  for (let i = 0; i < allDishes.length; i++) {
    if (allDishes[i].id === dishId) {
      return allDishes[i];
    }
  }
  return null;
}

/**
 * Calculate the adjusted Rupee price for a given portion key ("half", "full", or "family").
 * Rounds to the nearest 10 Rs for clean PKR pricing; defaults to basePrice before selection.
 * @param {number} basePrice - Base dish price in PKR.
 * @param {string | null} portionKey - Selected portion key or null.
 * @returns {number} Portion price in PKR.
 */
function getPortionPrice(basePrice, portionKey) {
  if (!portionKey || !PORTION_CONFIG[portionKey]) {
    return basePrice;
  }
  return Math.round((basePrice * PORTION_CONFIG[portionKey].multiplier) / 10) * 10;
}

/**
 * Compute the single-plate price including portion adjustment and optional Biryani Aloo (+Rs. 50).
 * @returns {number} Unit price in PKR.
 */
function calculateCustomizerUnitPrice() {
  if (!customizerState.dish) {
    return 0;
  }
  let unitPrice = getPortionPrice(customizerState.dish.price, customizerState.portion);
  if (customizerState.dish.category === 'biryani' && customizerState.aloo === 'yes') {
    unitPrice += ALOO_EXTRA_PRICE;
  }
  return unitPrice;
}

/**
 * Compute the live total price (unit price multiplied by selected quantity).
 * @returns {number} Total price in PKR.
 */
function calculateCustomizerTotalPrice() {
  return calculateCustomizerUnitPrice() * customizerState.quantity;
}

/**
 * Show or hide the inline customizer validation error message.
 * @param {boolean} show - True to display the error alert, false to hide it.
 * @param {string} [message] - Optional error text override.
 */
function toggleCustomizerError(show, message) {
  const errorBox = document.getElementById('customizer-error');
  const errorText = document.getElementById('customizer-error-text');
  if (!errorBox) {
    return;
  }
  if (show) {
    if (errorText && message) {
      errorText.textContent = message;
    }
    errorBox.classList.remove('d-none');
  } else {
    errorBox.classList.add('d-none');
  }
}

/**
 * Refresh the quantity counter, minus button state, and live adjusted total price in the modal.
 */
function updateCustomizerSummaryUI() {
  const qtyValueEl = document.getElementById('customizer-qty-value');
  const qtyMinusBtn = document.getElementById('customizer-qty-minus');
  const totalPriceEl = document.getElementById('customizer-total-price');

  if (qtyValueEl) {
    qtyValueEl.textContent = String(customizerState.quantity);
  }
  if (qtyMinusBtn) {
    qtyMinusBtn.disabled = customizerState.quantity <= 1;
  }
  if (totalPriceEl) {
    totalPriceEl.textContent = formatRupees(calculateCustomizerTotalPrice());
  }
}

/**
 * Check whether every required customization option has been selected for the active dish.
 * Biryani requires Spice-o-Meter, Portion Size, and Aloo option; Karahi requires Spice and Portion.
 * @returns {boolean} True when all required options are chosen.
 */
function validateCustomizerSelections() {
  if (!customizerState.dish) {
    return false;
  }
  if (!customizerState.spice || !customizerState.portion) {
    return false;
  }
  if (customizerState.dish.category === 'biryani' && !customizerState.aloo) {
    return false;
  }
  return true;
}

/**
 * Clear all radio inputs inside the customizer modal so no option is pre-selected on open.
 */
function resetCustomizerInputs() {
  const modalEl = document.getElementById('plateCustomizerModal');
  if (!modalEl) {
    return;
  }
  const radioInputs = modalEl.querySelectorAll('input[type="radio"]');
  for (let i = 0; i < radioInputs.length; i++) {
    radioInputs[i].checked = false;
  }
}

/**
 * Open the Biryani & Karahi Plate Customizer modal for the clicked dish.
 * Populates dish details, portion prices, shows/hides the Biryani Aloo question, and resets state.
 * @param {string} dishId - The id of the dish the user wants to customize.
 */
function openCustomizer(dishId) {
  const dish = findDesiDishById(dishId);
  if (!dish) {
    return;
  }

  customizerState.dish = dish;
  customizerState.spice = null;
  customizerState.portion = null;
  customizerState.aloo = null;
  customizerState.quantity = 1;

  const isBiryani = dish.category === 'biryani';
  const dishImageEl = document.getElementById('customizer-dish-image');
  const dishCategoryEl = document.getElementById('customizer-dish-category');
  const dishNameEl = document.getElementById('customizer-dish-name');
  const basePriceEl = document.getElementById('customizer-base-price');
  const alooSectionEl = document.getElementById('customizer-aloo-section');

  if (dishImageEl) {
    dishImageEl.src = dish.image;
    dishImageEl.alt = dish.alt;
    dishImageEl.onerror = function () {
      handleDesiImageError(this);
    };
  }
  if (dishCategoryEl) {
    dishCategoryEl.textContent = isBiryani ? 'Biryani Bazaar' : 'Karahi Kingdom';
  }
  if (dishNameEl) {
    dishNameEl.textContent = dish.name;
  }
  if (basePriceEl) {
    basePriceEl.textContent = formatRupees(dish.price);
  }

  // Update Half / Full / Family price previews for this dish
  const halfPriceEl = document.getElementById('portion-half-price');
  const fullPriceEl = document.getElementById('portion-full-price');
  const familyPriceEl = document.getElementById('portion-family-price');

  if (halfPriceEl) {
    halfPriceEl.textContent = formatRupees(getPortionPrice(dish.price, 'half'));
  }
  if (fullPriceEl) {
    fullPriceEl.textContent = formatRupees(getPortionPrice(dish.price, 'full'));
  }
  if (familyPriceEl) {
    familyPriceEl.textContent = formatRupees(getPortionPrice(dish.price, 'family'));
  }

  // Show the Aloo question only for Biryani dishes
  if (alooSectionEl) {
    if (isBiryani) {
      alooSectionEl.classList.remove('d-none');
    } else {
      alooSectionEl.classList.add('d-none');
    }
  }

  resetCustomizerInputs();
  toggleCustomizerError(false);
  updateCustomizerSummaryUI();

  if (customizerModalInstance) {
    customizerModalInstance.show();
  }
}

/**
 * Validate selections, add the customized dish to FlavourCart, close the popup,
 * and show a confirmation toast ("Added to cart successfully!").
 */
function handleCustomizerAddToCart() {
  if (!customizerState.dish) {
    return;
  }

  if (!validateCustomizerSelections()) {
    toggleCustomizerError(true, 'Please select the given options first.');
    return;
  }

  toggleCustomizerError(false);

  const dish = customizerState.dish;
  const isBiryani = dish.category === 'biryani';
  const portionLabel = PORTION_CONFIG[customizerState.portion].label;
  const spiceLabel = SPICE_LABELS[customizerState.spice];
  const optionParts = [portionLabel, spiceLabel];

  if (isBiryani) {
    optionParts.push(customizerState.aloo === 'yes' ? 'With Aloo' : 'No Aloo');
  }

  const cartItemId =
    dish.id +
    '__' +
    customizerState.spice +
    '__' +
    customizerState.portion +
    (isBiryani ? '__aloo-' + customizerState.aloo : '');

  onDesiDishAddedToCart({
    id: cartItemId,
    name: dish.name + ' (' + optionParts.join(', ') + ')',
    price: calculateCustomizerUnitPrice(),
    quantity: customizerState.quantity,
    image: dish.image,
    category: dish.category
  });

  if (customizerModalInstance) {
    customizerModalInstance.hide();
  }

  showDesiToast(dish.name + ' added to cart successfully!');
}

/**
 * Attach change listeners to a named radio group in the customizer modal.
 * @param {HTMLElement} modalEl - Root modal element.
 * @param {string} inputName - Radio group name attribute.
 * @param {'spice'|'portion'|'aloo'} stateKey - Target property in customizerState.
 * @param {boolean} updatesPrice - Whether changing this option affects the price display.
 */
function bindCustomizerRadioGroup(modalEl, inputName, stateKey, updatesPrice) {
  const radios = modalEl.querySelectorAll('input[name="' + inputName + '"]');
  for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', function () {
      customizerState[stateKey] = this.value;
      if (updatesPrice) {
        updateCustomizerSummaryUI();
      }
      if (validateCustomizerSelections()) {
        toggleCustomizerError(false);
      }
    });
  }
}

/**
 * Wire up the Plate Customizer Bootstrap modal, option radio listeners,
 * quantity stepper (+/-), and Add to Cart validation button.
 */
function initPlateCustomizer() {
  const modalEl = document.getElementById('plateCustomizerModal');
  if (!modalEl) {
    return;
  }

  if (window.bootstrap && window.bootstrap.Modal) {
    customizerModalInstance = new window.bootstrap.Modal(modalEl);
  }

  bindCustomizerRadioGroup(modalEl, 'customizerSpice', 'spice', false);
  bindCustomizerRadioGroup(modalEl, 'customizerPortion', 'portion', true);
  bindCustomizerRadioGroup(modalEl, 'customizerAloo', 'aloo', true);

  const qtyMinusBtn = document.getElementById('customizer-qty-minus');
  const qtyPlusBtn = document.getElementById('customizer-qty-plus');
  const addToCartBtn = document.getElementById('customizer-add-to-cart-btn');

  if (qtyMinusBtn) {
    qtyMinusBtn.addEventListener('click', function () {
      if (customizerState.quantity > 1) {
        customizerState.quantity--;
        updateCustomizerSummaryUI();
      }
    });
  }

  if (qtyPlusBtn) {
    qtyPlusBtn.addEventListener('click', function () {
      customizerState.quantity++;
      updateCustomizerSummaryUI();
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', handleCustomizerAddToCart);
  }
}

/* ==========================================================================
   Smart Naan Recommendation Popup Logic
   ========================================================================== */

/**
 * Check whether the shared localStorage cart already contains any item whose
 * name includes the given keyword (such as "naan"), ignoring letter case.
 * @param {string} categoryKeyword - Keyword to search for in cart item names.
 * @returns {boolean} True if at least one matching item is in the cart.
 */
function cartHasCategoryItem(categoryKeyword) {
  if (!categoryKeyword) {
    return false;
  }

  let cartItems = [];
  if (window.FlavourCart && typeof window.FlavourCart.getCart === 'function') {
    cartItems = window.FlavourCart.getCart();
  } else {
    try {
      const rawCart = window.localStorage.getItem('flavourLoungeCart');
      cartItems = rawCart ? JSON.parse(rawCart) : [];
    } catch (error) {
      cartItems = [];
    }
  }

  const target = String(categoryKeyword).toLowerCase();

  for (let i = 0; i < cartItems.length; i++) {
    const itemName = String(cartItems[i].name || '').toLowerCase();
    if (itemName.indexOf(target) !== -1) {
      return true;
    }
  }

  return false;
}

/**
 * Check if the user already dismissed the Naan suggestion modal in this browser tab session.
 * Uses sessionStorage so it resets automatically when the browser session ends.
 * @returns {boolean} True if dismissed earlier in this session.
 */
function isNaanPopupDismissedThisSession() {
  try {
    return window.sessionStorage.getItem(NAAN_DISMISSED_SESSION_KEY) === 'true';
  } catch (error) {
    return false;
  }
}

/**
 * Cancel any waiting 3-second Naan popup timer.
 * Called when naan is added to the cart or when a newer karahi add resets the timer.
 */
function cancelNaanPopupTimer() {
  if (naanPopupTimer !== null) {
    clearTimeout(naanPopupTimer);
    naanPopupTimer = null;
  }
}

/**
 * Check whether the Naan suggestion Bootstrap modal is currently open on screen.
 * Prevents two modals from stacking if the user adds multiple karahis quickly.
 * @returns {boolean} True if the modal is currently visible.
 */
function isNaanModalCurrentlyOpen() {
  const modalElement = document.getElementById('naanSuggestionModal');
  return Boolean(modalElement && modalElement.classList.contains('show'));
}

/**
 * Show the Bootstrap modal asking "You can't eat karahi with a spoon. Order naan?".
 * Re-checks all guard conditions right before opening so stale timers never fire.
 */
function showNaanSuggestionModal() {
  if (isNaanPopupDismissedThisSession()) {
    return;
  }
  if (cartHasCategoryItem('naan')) {
    return;
  }
  if (isNaanModalCurrentlyOpen()) {
    return;
  }

  if (naanModalInstance) {
    naanModalInstance.show();
  }
}

/**
 * Start a 3-second countdown to suggest naan after a karahi dish is added to the cart.
 * Clears any earlier timer first so rapid karahi additions never stack multiple popups.
 */
function scheduleNaanPopup() {
  // Do not schedule if user already said "No I'm good" this session
  if (isNaanPopupDismissedThisSession()) {
    return;
  }

  // Do not schedule if the cart already contains naan
  if (cartHasCategoryItem('naan')) {
    return;
  }

  // Do not stack another popup if the modal is already open
  if (isNaanModalCurrentlyOpen()) {
    return;
  }

  // Cancel any previous pending 3-second timer before starting a fresh one
  cancelNaanPopupTimer();

  naanPopupTimer = setTimeout(function () {
    naanPopupTimer = null;
    showNaanSuggestionModal();
  }, 3000);
}

/**
 * Helper called whenever a dish is successfully added to the cart from Desi Dastarkhwan.
 * Saves the item to FlavourCart and triggers the 3-second smart Naan popup for karahi dishes.
 * @param {Object} dishItem - Cart item object { id, name, price, quantity, image, category }.
 */
function onDesiDishAddedToCart(dishItem) {
  if (window.FlavourCart && typeof window.FlavourCart.addItem === 'function') {
    window.FlavourCart.addItem({
      id: dishItem.id,
      name: dishItem.name,
      price: dishItem.price,
      quantity: dishItem.quantity || 1,
      image: dishItem.image
    });
  }

  // If the added item itself is naan, cancel any waiting popup immediately
  if (String(dishItem.name || '').toLowerCase().indexOf('naan') !== -1) {
    cancelNaanPopupTimer();
    return;
  }

  // If a karahi dish was added, schedule the 3-second naan suggestion
  if (dishItem.category === 'karahi') {
    scheduleNaanPopup();
  }
}

/**
 * Set up the Bootstrap modal instance, button handlers ("Yeah sure" / "No I'm good"),
 * and cart listeners that cancel the timer if naan is added during the 3-second wait.
 */
function initSmartNaanPopup() {
  const modalElement = document.getElementById('naanSuggestionModal');
  const yesButton = document.getElementById('naan-yes-btn');
  const noButton = document.getElementById('naan-no-btn');

  if (modalElement && window.bootstrap && window.bootstrap.Modal) {
    naanModalInstance = new window.bootstrap.Modal(modalElement);
  }

  // "Yeah sure" closes the modal and goes to add-ons.html#naan
  if (yesButton) {
    yesButton.addEventListener('click', function () {
      cancelNaanPopupTimer();
      if (naanModalInstance) {
        naanModalInstance.hide();
      }
      window.location.href = NAAN_PAGE_URL;
    });
  }

  // "No I'm good" saves dismissal in sessionStorage and closes the modal
  if (noButton) {
    noButton.addEventListener('click', function () {
      cancelNaanPopupTimer();
      try {
        window.sessionStorage.setItem(NAAN_DISMISSED_SESSION_KEY, 'true');
      } catch (error) {
        // Ignore storage errors if private browsing restricts sessionStorage
      }
      if (naanModalInstance) {
        naanModalInstance.hide();
      }
    });
  }

  // Cancel any waiting timer immediately if naan gets added to the cart in this tab
  window.addEventListener('flavourCartUpdated', function () {
    if (cartHasCategoryItem('naan')) {
      cancelNaanPopupTimer();
      if (isNaanModalCurrentlyOpen() && naanModalInstance) {
        naanModalInstance.hide();
      }
    }
  });

  // Also cancel any waiting timer if naan is added from another open browser tab
  window.addEventListener('storage', function (event) {
    if (event.key === 'flavourLoungeCart' && cartHasCategoryItem('naan')) {
      cancelNaanPopupTimer();
      if (isNaanModalCurrentlyOpen() && naanModalInstance) {
        naanModalInstance.hide();
      }
    }
  });
}

/* ==========================================================================
   Smooth Anchor Scrolling & Page Initialization
   ========================================================================== */

/**
 * Smoothly scroll to a section matching the URL #hash (such as #biryani or #karahi)
 * with a top offset equal to the sticky navbar height plus breathing room.
 * @param {string} hashValue - Target hash string starting with "#".
 */
function scrollToSectionWithOffset(hashValue) {
  if (!hashValue || hashValue.length < 2) {
    return;
  }

  const targetSection = document.querySelector(hashValue);
  if (!targetSection) {
    return;
  }

  const navbar = document.querySelector('.navbar-bistro');
  const navbarHeight = navbar ? navbar.offsetHeight : 0;
  const extraOffset = 16;

  const sectionTop = targetSection.getBoundingClientRect().top + window.scrollY;
  const scrollTarget = Math.max(0, sectionTop - navbarHeight - extraOffset);

  window.scrollTo({
    top: scrollTarget,
    behavior: 'smooth'
  });
}

/**
 * Reset search input and category filter back to "All" and re-render every dish.
 * Triggered when the user clicks "Show All Dishes" inside the "No dishes found" panel.
 */
function resetDesiFilters() {
  const searchInput = document.getElementById('dish-search-input');
  const allFilterBtn = document.querySelector('[data-desi-filter="all"]');
  const filterButtons = document.querySelectorAll('[data-desi-filter]');

  currentFilter = 'all';
  currentSearchText = '';

  if (searchInput) {
    searchInput.value = '';
  }

  if (allFilterBtn) {
    setActiveFilterButton(filterButtons, allFilterBtn);
  }

  renderDesiMenu();
}

/**
 * Initialize Desi Dastarkhwan once the DOM is loaded:
 * renders dish arrays, connects search/filter controls, sets up the smart Naan popup,
 * and scrolls smoothly if a #hash anchor is present in the URL.
 */
function initDesiPage() {
  const filterButtons = document.querySelectorAll('[data-desi-filter]');
  const searchInput = document.getElementById('dish-search-input');
  const resetButton = document.getElementById('reset-filters-btn');
  const heroAnchorLinks = document.querySelectorAll('.bistro-hero a[href^="#"]');

  // Render Biryani Bazaar and Karahi Kingdom from JS arrays
  renderDesiMenu();

  // Filter buttons: All, Biryani, Karahi
  for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener('click', function () {
      currentFilter = this.getAttribute('data-desi-filter');
      setActiveFilterButton(filterButtons, this);
      renderDesiMenu();
    });
  }

  // Live search input
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      currentSearchText = this.value;
      renderDesiMenu();
    });
  }

  // "Show All Dishes" button inside the "No dishes found" state
  if (resetButton) {
    resetButton.addEventListener('click', resetDesiFilters);
  }

  // Smooth scrolling for hero buttons (#biryani, #karahi) with sticky header offset
  for (let i = 0; i < heroAnchorLinks.length; i++) {
    heroAnchorLinks[i].addEventListener('click', function (event) {
      const targetHash = this.getAttribute('href');
      if (targetHash && targetHash.charAt(0) === '#') {
        event.preventDefault();
        scrollToSectionWithOffset(targetHash);
      }
    });
  }

  // Initialize Plate Customizer modal & Smart Naan suggestion modal
  initPlateCustomizer();
  initSmartNaanPopup();

  // If the page opened with a #hash (like desi-cuisine.html#karahi), scroll smoothly after rendering
  if (window.location.hash) {
    scrollToSectionWithOffset(window.location.hash);
  }
}

// Expose key functions globally so customizer & browser console can call them directly
window.openCustomizer = openCustomizer;
window.cartHasCategoryItem = cartHasCategoryItem;
window.scheduleNaanPopup = scheduleNaanPopup;
window.onDesiDishAddedToCart = onDesiDishAddedToCart;

// Start Desi Dastarkhwan when the HTML document has finished loading
document.addEventListener('DOMContentLoaded', initDesiPage);
