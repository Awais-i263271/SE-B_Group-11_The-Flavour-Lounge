/**
 * JavaScript for the Categories Page (pages/menu.html)
 * Dynamically builds:
 *   1. "The Desi Darbar" (4 category boxes)
 *   2. "Chinese Dragon's Chicken" (1 full-width category box)
 *   3. "Most Loved This Week" (6 dish cards)
 */

// Fallback image used if any dish or category image fails to load
const FALLBACK_IMAGE = '../images/Karachi Biryani.png';

// Array of 4 Desi Darbar category objects
const desiCategories = [
  {
    name: 'Biryani & Karahi',
    description: 'Saffron dum biryanis and sizzling iron-wok karahis cooked fresh.',
    image: '../images/Karachi Biryani.png',
    alt: 'Steaming plate of spiced Karachi Biryani garnished with herbs',
    link: 'desi-cuisine.html'
  },
  {
    name: 'Rice & Curry',
    description: 'Slow-simmered traditional curries paired with fragrant basmati rice.',
    image: '../images/Makhni Karahi.jpg',
    alt: 'Rich creamy Makhni Karahi curry garnished with fresh ginger',
    link: 'rice-curry.html'
  },
  {
    name: 'Tandoor',
    description: 'Blistered garlic, butter, and sesame naans baked in a clay oven.',
    image: '../images/Garlic Naan.jpg',
    alt: 'Freshly baked Garlic Naan brushed with butter and coriander',
    link: 'tandoor.html'
  },
  {
    name: 'Add-ons',
    description: 'House chutneys, crispy sides, and flavourful sauces to complete your meal.',
    image: '../images/Sweet Chilli Sauce.png',
    alt: 'Bowl of glossy Sweet Chilli Sauce dipping condiment',
    link: 'add-ons.html'
  }
];

// Single object representing the full-width Chinese category box
const chineseCategory = {
  name: "Chinese Dragon's Chicken",
  description:
    'Dive into high-flame Indo-Chinese wok cooking featuring crispy Dynamite Chicken, glossy Chicken Manchurian, hand-tossed noodles, aromatic fried rice, and bold house-crafted sauces prepared fresh for delivery.',
  image: '../images/Chicken Manchurian.jpg',
  alt: 'Glossy wok-tossed Chicken Manchurian garnished with spring onions',
  link: 'chinese.html'
};

// Array of 6 Most Loved dishes (mix of Desi and Chinese) with # anchor links
const mostLovedDishes = [
  {
    name: 'Karachi Biryani',
    price: 'Rs. 650',
    image: '../images/Karachi Biryani.png',
    alt: 'Karachi Biryani with spiced chicken, golden potatoes, and saffron rice',
    link: 'desi-cuisine.html#biryani'
  },
  {
    name: 'Chicken Shinwari Karahi',
    price: 'Rs. 1,650',
    image: '../images/Chicken Shinwari Karahi.jpg',
    alt: 'Chicken Shinwari Karahi sizzling with fresh tomatoes and ginger',
    link: 'desi-cuisine.html#karahi'
  },
  {
    name: 'Garlic Naan',
    price: 'Rs. 140',
    image: '../images/Garlic Naan.jpg',
    alt: 'Warm clay-oven Garlic Naan topped with roasted garlic and butter',
    link: 'tandoor.html'
  },
  {
    name: 'Chicken Chow Mein',
    price: 'Rs. 890',
    image: '../images/Chicken Chow Mein.jpg',
    alt: 'Wok-seared Chicken Chow Mein noodles with stir-fried vegetables',
    link: 'chinese.html#noodles'
  },
  {
    name: 'Chicken Manchurian',
    price: 'Rs. 980',
    image: '../images/Chicken Manchurian.jpg',
    alt: 'Chicken Manchurian simmered in rich tangy garlic-soy glaze',
    link: 'chinese.html#mains'
  },
  {
    name: 'Dynamite Chicken',
    price: 'Rs. 850',
    image: '../images/Dynamite Chicken.jpg',
    alt: 'Crispy Dynamite Chicken drizzled with spicy creamy sauce',
    link: 'chinese.html#starters'
  }
];

/**
 * Replace a broken image with the default fallback image so the card layout never breaks.
 * Clears onerror after running once to prevent infinite retry loops.
 * @param {HTMLImageElement} imgElement - The image element that failed to load.
 */
function handleImageError(imgElement) {
  imgElement.onerror = null;
  imgElement.src = FALLBACK_IMAGE;
}

/**
 * Create an <img> element with a meaningful alt attribute and automatic fallback on error.
 * Keeps image creation consistent across all category boxes and dish cards.
 * @param {string} srcPath - Relative path to the image file.
 * @param {string} altText - Descriptive alternative text for accessibility.
 * @param {string} cssClass - CSS classes to style the image.
 * @returns {HTMLImageElement} Configured image element.
 */
function createSafeImage(srcPath, altText, cssClass) {
  const img = document.createElement('img');
  img.src = srcPath;
  img.alt = altText;
  img.className = cssClass;
  img.onerror = function () {
    handleImageError(this);
  };
  return img;
}

/**
 * Display a friendly empty-state message inside a container when an array has no items.
 * Prevents blank sections from appearing if data is temporarily empty.
 * @param {HTMLElement} container - Target container element.
 * @param {string} messageText - Friendly message to show to the user.
 */
function renderEmptyMessage(container, messageText) {
  const wrapper = document.createElement('div');
  wrapper.className = 'col-12';

  const box = document.createElement('div');
  box.className = 'bistro-empty-state';

  const text = document.createElement('p');
  text.className = 'mb-0 fs-5';
  text.textContent = messageText;

  box.appendChild(text);
  wrapper.appendChild(box);
  container.appendChild(wrapper);
}

/**
 * Render the 4 equal-sized boxes in "The Desi Darbar" section from desiCategories.
 * Responsive grid: 4 across on desktop (col-lg-3), 2 on tablet (col-md-6), 1 on mobile (col-12).
 */
function renderDesiDarbar() {
  const grid = document.getElementById('desi-darbar-grid');
  if (!grid) {
    return;
  }

  grid.innerHTML = '';

  if (!Array.isArray(desiCategories) || desiCategories.length === 0) {
    renderEmptyMessage(grid, 'Nothing here yet, check back soon!');
    return;
  }

  for (let i = 0; i < desiCategories.length; i++) {
    const category = desiCategories[i];

    // Column sizing: 1 across on mobile, 2 on tablet, 4 on desktop
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-3';

    const card = document.createElement('article');
    card.className = 'bistro-card';

    // Image wrapper with Mint Green badge
    const imgWrap = document.createElement('div');
    imgWrap.className = 'bistro-card-img-wrap';
    const img = createSafeImage(category.image, category.alt, 'bistro-card-img');

    const badge = document.createElement('span');
    badge.className = 'badge-mint badge-mint-floating';
    badge.textContent = 'Available';

    imgWrap.appendChild(img);
    imgWrap.appendChild(badge);

    // Card body with title, one-line description, and Explore link
    const body = document.createElement('div');
    body.className = 'bistro-card-body';

    const title = document.createElement('h3');
    title.className = 'dish-title';
    title.textContent = category.name;

    const desc = document.createElement('p');
    desc.className = 'dish-description';
    desc.textContent = category.description;

    // Real <a> link with stretched-link so the whole card and button are keyboard/click accessible
    const exploreLink = document.createElement('a');
    exploreLink.href = category.link;
    exploreLink.className = 'btn btn-bistro-primary btn-sm align-self-start stretched-link';
    exploreLink.innerHTML = 'Explore <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>';

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(exploreLink);

    card.appendChild(imgWrap);
    card.appendChild(body);
    col.appendChild(card);
    grid.appendChild(col);
  }
}

/**
 * Render the single full-width "Chinese Dragon's Chicken" box from chineseCategory.
 * Stays full width on all screen sizes and is roughly double the height of the Desi boxes.
 */
function renderChineseFeatureBox() {
  const container = document.getElementById('chinese-feature-container');
  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (!chineseCategory || !chineseCategory.name) {
    renderEmptyMessage(container, 'Nothing here yet, check back soon!');
    return;
  }

  const card = document.createElement('article');
  card.className = 'bistro-card bistro-featured-box';

  const row = document.createElement('div');
  row.className = 'row g-0 h-100';

  // Left half: Large featured food image
  const imgCol = document.createElement('div');
  imgCol.className = 'col-12 col-lg-6 bistro-card-img-wrap';

  const img = createSafeImage(chineseCategory.image, chineseCategory.alt, 'bistro-featured-img');

  const badge = document.createElement('span');
  badge.className = 'badge-mint badge-mint-floating';
  badge.innerHTML = '<i class="bi bi-check-circle-fill" aria-hidden="true"></i>Freshly Prepared';

  imgCol.appendChild(img);
  imgCol.appendChild(badge);

  // Right half: Larger heading, longer description, and Explore <a> button
  const textCol = document.createElement('div');
  textCol.className = 'col-12 col-lg-6 d-flex';

  const body = document.createElement('div');
  body.className = 'bistro-card-body justify-content-center p-4 p-lg-5';

  const eyebrow = document.createElement('span');
  eyebrow.className = 'section-eyebrow';
  eyebrow.textContent = 'Full Wok & Noodle Collection';

  const heading = document.createElement('h2');
  heading.className = 'display-6 mb-3';
  heading.textContent = chineseCategory.name;

  const desc = document.createElement('p');
  desc.className = 'text-offwhite-muted fs-6 mb-4';
  desc.textContent = chineseCategory.description;

  const exploreBtn = document.createElement('a');
  exploreBtn.href = chineseCategory.link;
  exploreBtn.className = 'btn btn-bistro-primary align-self-start stretched-link';
  exploreBtn.innerHTML = 'Explore <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i>';

  body.appendChild(eyebrow);
  body.appendChild(heading);
  body.appendChild(desc);
  body.appendChild(exploreBtn);

  textCol.appendChild(body);
  row.appendChild(imgCol);
  row.appendChild(textCol);
  card.appendChild(row);
  container.appendChild(card);
}

/**
 * Render the "Most Loved This Week" dish cards from mostLovedDishes.
 * Responsive grid: 3 across on desktop (col-lg-4), 2 on tablet (col-md-6), 1 on mobile (col-12).
 */
function renderMostLovedDishes() {
  const grid = document.getElementById('most-loved-grid');
  if (!grid) {
    return;
  }

  grid.innerHTML = '';

  if (!Array.isArray(mostLovedDishes) || mostLovedDishes.length === 0) {
    renderEmptyMessage(grid, 'Nothing here yet, check back soon!');
    return;
  }

  for (let i = 0; i < mostLovedDishes.length; i++) {
    const dish = mostLovedDishes[i];

    // Column sizing: 1 across on mobile, 2 on tablet, 3 on desktop
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';

    const card = document.createElement('article');
    card.className = 'bistro-card';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'bistro-card-img-wrap';
    const img = createSafeImage(dish.image, dish.alt, 'bistro-card-img');

    const badge = document.createElement('span');
    badge.className = 'badge-mint badge-mint-floating';
    badge.textContent = 'Most Loved';

    imgWrap.appendChild(img);
    imgWrap.appendChild(badge);

    const body = document.createElement('div');
    body.className = 'bistro-card-body';

    const title = document.createElement('h3');
    title.className = 'dish-title mb-3';
    title.textContent = dish.name;

    // Footer row with Saffron Gold price and real <a> Explore link
    const footerRow = document.createElement('div');
    footerRow.className =
      'd-flex justify-content-between align-items-center mt-auto pt-2 border-top border-secondary border-opacity-25';

    const price = document.createElement('span');
    price.className = 'dish-price';
    price.textContent = dish.price;

    const exploreLink = document.createElement('a');
    exploreLink.href = dish.link;
    exploreLink.className = 'btn btn-bistro-primary btn-sm stretched-link';
    exploreLink.innerHTML = 'Explore <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>';

    footerRow.appendChild(price);
    footerRow.appendChild(exploreLink);

    body.appendChild(title);
    body.appendChild(footerRow);

    card.appendChild(imgWrap);
    card.appendChild(body);
    col.appendChild(card);
    grid.appendChild(col);
  }
}

/**
 * Initialize the Categories page once the HTML DOM is ready.
 * Calls each render function to build the page sections from JavaScript data.
 */
function initMenuPage() {
  renderDesiDarbar();
  renderChineseFeatureBox();
  renderMostLovedDishes();
}

// Run page setup when the DOM has finished loading
document.addEventListener('DOMContentLoaded', initMenuPage);
