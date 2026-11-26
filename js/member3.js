/* ==========================================================================
   The Flavour Lounge - Member 3 Interactive Catalog & Cart Logic
   Powers:
     - pages/rice-curry.html
     - pages/tandoor-breads.html
     - pages/sides-addons.html
   Cart Integration:
     - Uses window.FlavourCart.addItem() from js/cart.js
     - Preserves localStorage key "flavourLoungeCart"
     - Preserves item shape: { id, name, price, quantity, image }
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'flavourLoungeCart';

  /**
   * Generate a crisp Dark Bistro inline SVG dish graphic so every cart item
   * carries a valid, dependency-free image URI across pages (including cart.html).
   */
  function createDishSvg(title, categoryLabel, motif) {
    var safeTitle = String(title).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var safeCat = String(categoryLabel).toUpperCase().replace(/&/g, '&amp;');

    var motifShapes = {
      rice:
        '<ellipse cx="300" cy="166" rx="92" ry="30" fill="#181512" stroke="#F59E0B" stroke-width="3"/>' +
        '<path d="M214 166 Q300 102 386 166 Z" fill="#FAF3E0" opacity="0.92"/>' +
        '<path d="M242 150 Q300 116 358 150" fill="none" stroke="#FF6B00" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M270 104 Q264 86 276 74 M300 98 Q294 80 306 68 M330 104 Q324 86 336 74" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>',
      bread:
        '<ellipse cx="300" cy="154" rx="108" ry="52" fill="#241F1C" stroke="#F59E0B" stroke-width="3"/>' +
        '<ellipse cx="282" cy="148" rx="68" ry="36" fill="#FAF3E0" stroke="#FF6B00" stroke-width="3"/>' +
        '<ellipse cx="324" cy="160" rx="60" ry="32" fill="#FAF3E0" opacity="0.9" stroke="#F59E0B" stroke-width="2.5"/>' +
        '<circle cx="272" cy="144" r="4" fill="#FF6B00"/><circle cx="294" cy="154" r="3.5" fill="#181512"/>' +
        '<circle cx="328" cy="158" r="4" fill="#FF6B00"/>',
      side:
        '<circle cx="262" cy="152" r="54" fill="#181512" stroke="#F59E0B" stroke-width="3"/>' +
        '<circle cx="262" cy="152" r="38" fill="#FAF3E0" opacity="0.92"/>' +
        '<circle cx="262" cy="152" r="14" fill="#10B981"/>' +
        '<circle cx="348" cy="158" r="44" fill="#181512" stroke="#FF6B00" stroke-width="3"/>' +
        '<circle cx="348" cy="158" r="28" fill="#FF6B00" opacity="0.88"/>'
    };

    var art = motifShapes[motif] || motifShapes.rice;

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="375" viewBox="0 0 600 375">' +
      '<defs>' +
      '<radialGradient id="bgGlow" cx="50%" cy="42%" r="60%">' +
      '<stop offset="0%" stop-color="#241F1C"/>' +
      '<stop offset="100%" stop-color="#181512"/>' +
      '</radialGradient>' +
      '</defs>' +
      '<rect width="600" height="375" fill="url(#bgGlow)"/>' +
      '<rect x="18" y="18" width="564" height="339" rx="22" fill="none" stroke="#F59E0B" stroke-opacity="0.28" stroke-width="1.5"/>' +
      art +
      '<text x="300" y="258" text-anchor="middle" fill="#F59E0B" font-family="Poppins, sans-serif" font-size="13" font-weight="600" letter-spacing="2">' +
      safeCat +
      '</text>' +
      '<text x="300" y="294" text-anchor="middle" fill="#FAF3E0" font-family="Georgia, serif" font-size="22" font-weight="700">' +
      safeTitle +
      '</text>' +
      '<text x="300" y="326" text-anchor="middle" fill="#FF6B00" font-family="Poppins, sans-serif" font-size="12" font-weight="600">THE FLAVOUR LOUNGE</text>' +
      '</svg>';

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  /**
   * Catalog data organized by Member 3 page key.
   */
  var CATALOG = {
    'rice-curry': {
      filters: ['All', 'Biryani & Pulao', 'Karahi & Handi', 'Signature Curries'],
      items: [
        {
          id: 'rc-1',
          name: 'Karachi Chicken Dum Biryani',
          category: 'Biryani & Pulao',
          portion: 'Full Serving',
          rating: '4.9',
          price: 1150,
          description: 'Fragrant aged basmati layered with saffron, caramelized onions, and spiced chicken steamed on slow dum.',
          image: createDishSvg('Karachi Chicken Dum Biryani', 'Biryani & Pulao', 'rice')
        },
        {
          id: 'rc-2',
          name: 'Shahi Mutton Kunna',
          category: 'Signature Curries',
          portion: 'Clay Pot',
          rating: '4.9',
          price: 1950,
          description: 'Tender slow-braised mutton simmered overnight with roasted black cumin, cardamom, and silky bone marrow gravy.',
          image: createDishSvg('Shahi Mutton Kunna', 'Signature Curries', 'rice')
        },
        {
          id: 'rc-3',
          name: 'Lahori Chicken Makhni Handi',
          category: 'Karahi & Handi',
          portion: 'Serves 2',
          rating: '4.8',
          price: 1650,
          description: 'Char-kissed boneless chicken folded into a rich tomato-butter reduction finished with cream and fenugreek.',
          image: createDishSvg('Lahori Chicken Makhni Handi', 'Karahi & Handi', 'rice')
        },
        {
          id: 'rc-4',
          name: 'Kabuli Afghani Lamb Pulao',
          category: 'Biryani & Pulao',
          portion: 'Full Serving',
          rating: '4.8',
          price: 1750,
          description: 'Delicately spiced long-grain rice cooked in lamb stock and crowned with glazed carrots and sweet raisins.',
          image: createDishSvg('Kabuli Afghani Lamb Pulao', 'Biryani & Pulao', 'rice')
        },
        {
          id: 'rc-5',
          name: 'Peshawari Charsi Mutton Karahi',
          category: 'Karahi & Handi',
          portion: 'Half kg',
          rating: '4.9',
          price: 2250,
          description: 'Wok-seared bone-in mutton tossed over high flame with vine tomatoes, julienne ginger, and green chilies.',
          image: createDishSvg('Peshawari Charsi Karahi', 'Karahi & Handi', 'rice')
        },
        {
          id: 'rc-6',
          name: 'Hyderabadi Beef Haleem Bowl',
          category: 'Signature Curries',
          portion: 'Classic Bowl',
          rating: '4.7',
          price: 950,
          description: 'Slow-pounded wheat, lentils, and shredded beef finished with pure ghee, crisp shallots, and fresh lime.',
          image: createDishSvg('Hyderabadi Beef Haleem', 'Signature Curries', 'rice')
        }
      ]
    },
    'tandoor-breads': {
      filters: ['All', 'Classic Naans', 'Stuffed & Specialty', 'Roti & Parathas'],
      items: [
        {
          id: 'tb-1',
          name: 'Roghni Sesame Naan',
          category: 'Classic Naans',
          portion: '1 Piece',
          rating: '4.9',
          price: 140,
          description: 'Pillow-soft clay-oven naan brushed with clarified butter and scattered with toasted white sesame seeds.',
          image: createDishSvg('Roghni Sesame Naan', 'Classic Naans', 'bread')
        },
        {
          id: 'tb-2',
          name: 'Roasted Garlic & Coriander Naan',
          category: 'Classic Naans',
          portion: '1 Piece',
          rating: '4.9',
          price: 180,
          description: 'Blistered tandoori naan glazed with golden roasted garlic butter and freshly chopped garden coriander.',
          image: createDishSvg('Garlic Coriander Naan', 'Classic Naans', 'bread')
        },
        {
          id: 'tb-3',
          name: 'Peshawari Almond & Coconut Naan',
          category: 'Stuffed & Specialty',
          portion: '1 Piece',
          rating: '4.8',
          price: 320,
          description: 'Aromatic sweet-savory naan filled with crushed almonds, pistachios, raisins, and toasted coconut.',
          image: createDishSvg('Peshawari Nut Naan', 'Stuffed & Specialty', 'bread')
        },
        {
          id: 'tb-4',
          name: 'Spiced Keema Stuffed Naan',
          category: 'Stuffed & Specialty',
          portion: '1 Piece',
          rating: '4.9',
          price: 450,
          description: 'Crisp tandoori flatbread generously packed with spiced minced beef, green chilies, and fresh herbs.',
          image: createDishSvg('Spiced Keema Naan', 'Stuffed & Specialty', 'bread')
        },
        {
          id: 'tb-5',
          name: 'Flaky Lachha Tandoori Paratha',
          category: 'Roti & Parathas',
          portion: '1 Piece',
          rating: '4.8',
          price: 220,
          description: 'Multi-layered whole-wheat paratha baked crisp along the glowing clay tandoor wall with pure ghee.',
          image: createDishSvg('Lachha Tandoori Paratha', 'Roti & Parathas', 'bread')
        },
        {
          id: 'tb-6',
          name: 'Whole-Wheat Khamiri Roti',
          category: 'Roti & Parathas',
          portion: '1 Piece',
          rating: '4.7',
          price: 90,
          description: 'Lightly fermented stone-ground wheat roti with a smoky char and soft, airy crumb for rich curries.',
          image: createDishSvg('Khamiri Tandoori Roti', 'Roti & Parathas', 'bread')
        }
      ]
    },
    'sides-addons': {
      filters: ['All', 'Raita & Chutneys', 'Fresh Salads', 'Crispy Starters'],
      items: [
        {
          id: 'sa-1',
          name: 'Mint & Coriander Raita',
          category: 'Raita & Chutneys',
          portion: '250 ml',
          rating: '4.9',
          price: 180,
          description: 'Chilled whipped yogurt blended with fresh garden mint, coriander, roasted cumin, and Himalayan pink salt.',
          image: createDishSvg('Mint & Coriander Raita', 'Raita & Chutneys', 'side')
        },
        {
          id: 'sa-2',
          name: 'Tamarind & Plum Imli Chutney',
          category: 'Raita & Chutneys',
          portion: '150 ml',
          rating: '4.8',
          price: 160,
          description: 'Tangy-sweet slow-reduced tamarind and dried plum glaze balanced with roasted ginger and chili flakes.',
          image: createDishSvg('Imli & Plum Chutney', 'Raita & Chutneys', 'side')
        },
        {
          id: 'sa-3',
          name: 'Fresh Kachumber Garden Salad',
          category: 'Fresh Salads',
          portion: 'Regular Bowl',
          rating: '4.7',
          price: 240,
          description: 'Crisp diced cucumber, vine tomatoes, red onion, and coriander dressed with freshly squeezed lemon juice.',
          image: createDishSvg('Kachumber Garden Salad', 'Fresh Salads', 'side')
        },
        {
          id: 'sa-4',
          name: 'Zeera & Crispy Boondi Raita',
          category: 'Raita & Chutneys',
          portion: '250 ml',
          rating: '4.8',
          price: 210,
          description: 'Creamy spiced yogurt crowned with crunchy gram-flour pearls, toasted cumin seeds, and mild paprika.',
          image: createDishSvg('Zeera Boondi Raita', 'Raita & Chutneys', 'side')
        },
        {
          id: 'sa-5',
          name: 'Loaded House Masala Fries',
          category: 'Crispy Starters',
          portion: 'Sharing Tray',
          rating: '4.9',
          price: 420,
          description: 'Hand-cut golden potatoes tossed in signature chaat masala and served with garlic mayo and imli dip.',
          image: createDishSvg('Loaded Masala Fries', 'Crispy Starters', 'side')
        },
        {
          id: 'sa-6',
          name: 'Crispy Vegetable Samosa Trio',
          category: 'Crispy Starters',
          portion: '3 Pieces',
          rating: '4.8',
          price: 360,
          description: 'Three flaky pastry triangles filled with spiced potatoes, green peas, and roasted coriander, plus mint dip.',
          image: createDishSvg('Vegetable Samosa Trio', 'Crispy Starters', 'side')
        }
      ]
    }
  };

  /**
   * Format PKR price consistently as "Rs. 1,150".
   */
  function formatPrice(amount) {
    var rounded = Math.round(Number(amount) || 0);
    return 'Rs. ' + rounded.toLocaleString('en-US');
  }

  /**
   * Escape HTML special characters before injecting text.
   */
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Add an item through the shared window.FlavourCart helper (from js/cart.js),
   * preserving the exact "flavourLoungeCart" key and 5-field item structure.
   */
  function addToSharedCart(dish) {
    var payload = {
      id: String(dish.id),
      name: String(dish.name),
      price: Number(dish.price),
      quantity: 1,
      image: String(dish.image || '')
    };

    if (window.FlavourCart && typeof window.FlavourCart.addItem === 'function') {
      window.FlavourCart.addItem(payload);
      return;
    }

    // Defensive fallback if js/cart.js has not yet been synced into this branch
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var cart = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(cart)) {
        cart = [];
      }
      var existing = cart.find(function (entry) {
        return entry && String(entry.id) === payload.id;
      });
      if (existing) {
        existing.quantity = (parseInt(existing.quantity, 10) || 1) + 1;
        existing.name = payload.name;
        existing.price = payload.price;
        existing.image = payload.image;
      } else {
        cart.push(payload);
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      var total = cart.reduce(function (sum, entry) {
        return sum + (parseInt(entry.quantity, 10) || 0);
      }, 0);
      document.querySelectorAll('[data-cart-count], #cart-count').forEach(function (badge) {
        badge.textContent = String(total);
      });
    } catch (err) {
      console.error('Member3Cart: Unable to update cart in localStorage.', err);
    }
  }

  /**
   * Show the Bootstrap 5 toast notification when an item is added.
   */
  function showAddedToast(dishName) {
    var toastEl = document.getElementById('cartToast');
    var msgEl = document.getElementById('cartToastMessage');
    if (msgEl) {
      msgEl.textContent = dishName + ' added to cart';
    }
    if (!toastEl || typeof bootstrap === 'undefined' || !bootstrap.Toast) {
      return;
    }
    var toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2400 });
    toastInstance.show();
  }

  /**
   * Render sub-category filter buttons for the active page.
   */
  function renderFilters(filters, activeFilter, onSelect) {
    var container = document.getElementById('categoryFilters');
    if (!container) {
      return;
    }

    container.innerHTML = '';
    filters.forEach(function (label) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn m3-filter-btn' + (label === activeFilter ? ' active' : '');
      btn.setAttribute('data-filter', label);
      btn.textContent = label;
      btn.addEventListener('click', function () {
        onSelect(label);
      });
      container.appendChild(btn);
    });
  }

  /**
   * Render responsive Bootstrap dish cards into #menuGrid.
   */
  function renderDishes(items, selectedFilter) {
    var grid = document.getElementById('menuGrid');
    var countEl = document.getElementById('menuCount');
    if (!grid) {
      return;
    }

    var filtered = selectedFilter === 'All'
      ? items
      : items.filter(function (item) {
          return item.category === selectedFilter;
        });

    if (countEl) {
      countEl.textContent = filtered.length + (filtered.length === 1 ? ' Dish Available' : ' Dishes Available');
    }

    grid.innerHTML = '';

    filtered.forEach(function (dish) {
      var col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4';

      col.innerHTML =
        '<article class="card m3-dish-card h-100">' +
        '  <div class="m3-dish-media">' +
        '    <img src="' + dish.image + '" alt="' + escapeHtml(dish.name) + '" class="m3-dish-img">' +
        '    <div class="m3-dish-scrim"></div>' +
        '    <span class="m3-status-badge"><span class="m3-status-dot" aria-hidden="true"></span>Available</span>' +
        '    <span class="m3-portion-badge">' + escapeHtml(dish.portion) + '</span>' +
        '  </div>' +
        '  <div class="card-body m3-dish-body d-flex flex-column">' +
        '    <div class="d-flex justify-content-between align-items-center mb-2">' +
        '      <span class="m3-category-tag">' + escapeHtml(dish.category) + '</span>' +
        '      <span class="m3-rating" aria-label="Rated ' + escapeHtml(dish.rating) + ' out of 5">' +
        '        <i class="bi bi-star-fill me-1" aria-hidden="true"></i>' + escapeHtml(dish.rating) +
        '      </span>' +
        '    </div>' +
        '    <h2 class="m3-dish-title">' + escapeHtml(dish.name) + '</h2>' +
        '    <p class="m3-dish-desc flex-grow-1 mb-3">' + escapeHtml(dish.description) + '</p>' +
        '    <div class="m3-price-row d-flex justify-content-between align-items-center gap-2 mt-auto">' +
        '      <div>' +
        '        <span class="m3-price-label">Price</span>' +
        '        <span class="m3-dish-price">' + formatPrice(dish.price) + '</span>' +
        '      </div>' +
        '      <button type="button" class="btn btn-flavour-primary m3-add-btn" data-dish-id="' + escapeHtml(dish.id) + '">' +
        '        <i class="bi bi-bag-plus me-1" aria-hidden="true"></i>Add to Cart' +
        '      </button>' +
        '    </div>' +
        '  </div>' +
        '</article>';

      grid.appendChild(col);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var pageKey = document.body.getAttribute('data-member3-page');
    var pageData = CATALOG[pageKey];
    if (!pageData) {
      return;
    }

    var currentFilter = 'All';

    function updateView(filterLabel) {
      currentFilter = filterLabel;
      renderFilters(pageData.filters, currentFilter, updateView);
      renderDishes(pageData.items, currentFilter);
    }

    updateView('All');

    if (window.FlavourCart && typeof window.FlavourCart.updateCartBadge === 'function') {
      window.FlavourCart.updateCartBadge();
    } else {
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        var cart = raw ? JSON.parse(raw) : [];
        if (Array.isArray(cart)) {
          var total = cart.reduce(function (sum, entry) {
            return sum + (parseInt(entry.quantity, 10) || 0);
          }, 0);
          document.querySelectorAll('[data-cart-count], #cart-count').forEach(function (badge) {
            badge.textContent = String(total);
          });
        }
      } catch (err) {
        // Ignore storage read errors when standalone
      }
    }

    var grid = document.getElementById('menuGrid');
    if (grid) {
      grid.addEventListener('click', function (event) {
        var addButton = event.target.closest('.m3-add-btn');
        if (!addButton) {
          return;
        }
        var dishId = addButton.getAttribute('data-dish-id');
        var dish = pageData.items.find(function (entry) {
          return entry.id === dishId;
        });
        if (!dish) {
          return;
        }
        addToSharedCart(dish);
        showAddedToast(dish.name);
      });
    }
  });
})();
