/**
 * JavaScript for the Categories Page (pages/menu.html)
 * Dynamically builds:
 *   1. "The Desi Darbar" (4 category boxes)
 *   2. "Chinese Dragon's Chicken" (1 full-width category box)
 *   3. "Most Loved This Week" (6 dish cards)
 */

// Fallback image used if any dish or category image fails to load
const FALLBACK_IMAGE = '../images/Wajeeha 3304/Karachi Biryani.png';

// Array of 4 Desi Darbar category objects
const desiCategories = [
  {
    name: 'Biryani & Karahi',
    description: 'Saffron dum biryanis and sizzling iron-wok karahis cooked fresh.',
    image: '../images/Wajeeha 3304/Karachi Biryani.png',
    alt: 'Steaming plate of spiced Karachi Biryani garnished with herbs',
    link: 'desi-cuisine.html'
  },
  {
    name: 'Rice & Curry',
    description: 'Slow-simmered traditional curries paired with fragrant basmati rice.',
    image: '../images/Wajeeha 3304/Makhni Karahi.jpg',
    alt: 'Rich creamy Makhni Karahi curry garnished with fresh ginger',
    link: 'rice-curry.html'
  },
  {
    name: 'Tandoor',
    description: 'Blistered garlic, butter, and sesame naans baked in a clay oven.',
    image: '../images/Wajeeha 3304/Garlic Naan.jpg',
    alt: 'Freshly baked Garlic Naan brushed with butter and coriander',
    link: 'tandoor-breads.html'
  },
  {
    name: 'Add-ons',
    description: 'House chutneys, crispy sides, and flavourful sauces to complete your meal.',
    image: '../images/Wajeeha 3304/Sweet Chilli Sauce.png',
    alt: 'Bowl of glossy Sweet Chilli Sauce dipping condiment',
    link: 'sides-addons.html'
  }
];

// Single object representing the full-width Chinese category box
const chineseCategory = {
  name: "Chinese Dragon's Chicken",
  description:
    'Dive into high-flame Indo-Chinese wok cooking featuring crispy Dynamite Chicken, glossy Chicken Manchurian, hand-tossed noodles, aromatic fried rice, and bold house-crafted sauces prepared fresh for delivery.',
  image: '../images/Wajeeha 3304/chinese.jpg',
  alt: 'Assortment of sizzling Chinese Dragon Kitchen dishes served fresh',
  link: 'chinese.html'
};

// Array of 6 Most Loved dishes (mix of Desi and Chinese) with # anchor links
const mostLovedDishes = [
  {
    name: 'Karachi Biryani',
    price: 'Rs. 650',
    image: '../images/Wajeeha 3304/Karachi Biryani.png',
    alt: 'Karachi Biryani with spiced chicken, golden potatoes, and saffron rice',
    link: 'desi-cuisine.html#biryani'
  },
  {
    name: 'Chicken Shinwari Karahi',
    price: 'Rs. 1,650',
    image: '../images/Wajeeha 3304/Chicken Shinwari Karahi.jpg',
    alt: 'Chicken Shinwari Karahi sizzling with fresh tomatoes and ginger',
    link: 'desi-cuisine.html#karahi'
  },
  {
    name: 'Garlic Naan',
    price: 'Rs. 140',
    image: '../images/Wajeeha 3304/Garlic Naan.jpg',
    alt: 'Warm clay-oven Garlic Naan topped with roasted garlic and butter',
    link: 'tandoor-breads.html'
  },
  {
    name: 'Chicken Chow Mein',
    price: 'Rs. 890',
    image: '../images/Wajeeha 3304/Chicken Chow Mein.jpg',
    alt: 'Wok-seared Chicken Chow Mein noodles with stir-fried vegetables',
    link: 'chinese.html#noodles'
  },
  {
    name: 'Chicken Manchurian',
    price: 'Rs. 980',
    image: '../images/Wajeeha 3304/Chicken Manchurian.jpg',
    alt: 'Chicken Manchurian simmered in rich tangy garlic-soy glaze',
    link: 'chinese.html#mains'
  },
  {
    name: 'Dynamite Chicken',
    price: 'Rs. 850',
    image: '../images/Wajeeha 3304/Dynamite Chicken.jpg',
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
 * Build an enlarged category showcase card with full-bleed food image, dark overlay,
 * centered large heading in the middle of the box, and stretched Explore link.
 * Used for both Desi Darbar (2 per row) and the full-width Chinese box at the end.
 * @param {Object} category - Category object { name, description, image, alt, link }.
 * @param {Object} [options] - Optional configuration { featured: boolean, badgeText: string, eyebrowText: string }.
 * @returns {HTMLElement} Rendered category showcase article element.
 */
function createCategoryShowcaseCard(category, options) {
  const opts = options || {};
  const isFeatured = Boolean(opts.featured);

  const card = document.createElement('article');
  card.className = isFeatured
    ? 'category-showcase-card category-showcase-featured'
    : 'category-showcase-card';

  const img = createSafeImage(category.image, category.alt, 'category-showcase-img');

  const overlay = document.createElement('div');
  overlay.className = 'category-showcase-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const badge = document.createElement('span');
  badge.className = 'badge-mint badge-mint-floating';
  badge.innerHTML = isFeatured
    ? '<i class="bi bi-check-circle-fill" aria-hidden="true"></i>' + (opts.badgeText || 'Freshly Prepared')
    : (opts.badgeText || 'Available');

  const content = document.createElement('div');
  content.className = 'category-showcase-content';

  if (opts.eyebrowText) {
    const eyebrow = document.createElement('span');
    eyebrow.className = 'section-eyebrow mb-2';
    eyebrow.textContent = opts.eyebrowText;
    content.appendChild(eyebrow);
  }

  const title = document.createElement(isFeatured ? 'h2' : 'h3');
  title.className = 'category-showcase-title';
  title.textContent = category.name;

  const desc = document.createElement('p');
  desc.className = 'category-showcase-desc';
  desc.textContent = category.description;

  const exploreLink = document.createElement('a');
  exploreLink.href = category.link;
  exploreLink.className = 'btn btn-bistro-primary stretched-link';
  exploreLink.innerHTML = 'Explore <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>';

  content.appendChild(title);
  content.appendChild(desc);
  content.appendChild(exploreLink);

  card.appendChild(img);
  card.appendChild(overlay);
  card.appendChild(badge);
  card.appendChild(content);

  return card;
}

/**
 * Render the 4 enlarged boxes in "The Desi Darbar" section from desiCategories.
 * Responsive grid: 2 across on tablet/desktop (col-md-6), 1 on mobile (col-12).
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

    // Column sizing: 1 across on mobile, 2 across per row on tablet and desktop
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6';

    const card = createCategoryShowcaseCard(category, {
      featured: false,
      badgeText: 'Available',
      eyebrowText: 'Desi Category'
    });

    col.appendChild(card);
    grid.appendChild(col);
  }
}

/**
 * Render the single full-width "Chinese Dragon's Chicken" box at the end of categories.
 * Enlarged full-width showcase box with centered heading in the middle of the box.
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

  const card = createCategoryShowcaseCard(chineseCategory, {
    featured: true,
    badgeText: 'Freshly Prepared',
    eyebrowText: 'Full Wok & Noodle Collection'
  });

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
 * Smoothly scroll to a category section (#desi-darbar or #chinese-dragon)
 * while leaving room for the sticky navigation bar.
 * @param {string} hashValue - Target section hash starting with "#".
 */
function scrollToMenuSection(hashValue) {
  if (!hashValue || hashValue.charAt(0) !== '#') {
    return;
  }

  const targetSection = document.querySelector(hashValue);
  if (!targetSection) {
    return;
  }

  const navbar = document.querySelector('.navbar-bistro');
  const navbarHeight = navbar ? navbar.offsetHeight : 0;
  const sectionTop = targetSection.getBoundingClientRect().top + window.scrollY;
  const scrollTarget = Math.max(0, sectionTop - navbarHeight - 16);

  window.scrollTo({
    top: scrollTarget,
    behavior: 'smooth'
  });
}

/**
 * Initialize the Categories page once the HTML DOM is ready.
 * Calls each render function to build the page sections from JavaScript data.
 */
function initMenuPage() {
  renderDesiDarbar();
  renderChineseFeatureBox();
  renderMostLovedDishes();

  const jumpLinks = document.querySelectorAll('.menu-jump-btn[href^="#"]');
  for (let i = 0; i < jumpLinks.length; i++) {
    jumpLinks[i].addEventListener('click', function (event) {
      const targetHash = this.getAttribute('href');
      if (targetHash && targetHash.charAt(0) === '#') {
        event.preventDefault();
        scrollToMenuSection(targetHash);
      }
    });
  }
}

// Run page setup when the DOM has finished loading
document.addEventListener('DOMContentLoaded', initMenuPage);
