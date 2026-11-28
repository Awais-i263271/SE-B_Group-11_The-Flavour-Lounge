
/* ==========================================================================
   THE FLAVOUR LOUNGE - MEMBER 3
   Pages: Rice & Curry, Tandoor Breads, Sides & Add-ons
   Features: Local Food Images, Search, Filters, Add to Cart
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'flavourLoungeCart';
  var FALLBACK_IMAGE = '../images/hero-platter.jpg';

  var CATALOG = {
    'rice-curry': {
      filters: [
        'All',
        'Biryani & Pulao',
        'Karahi & Handi',
        'Signature Curries',
        'Daal & Rice'
      ],
      items: [
        {
          id: 'rc-1',
          name: 'Karachi Chicken Dum Biryani',
          category: 'Biryani & Pulao',
          portion: 'Full Serving',
          rating: '4.9',
          price: 1150,
          description: 'Fragrant basmati rice layered with spiced chicken.',
          image: '../images/menu/rc-1.jpg'
        },
        {
          id: 'rc-2',
          name: 'Shahi Mutton Kunna',
          category: 'Signature Curries',
          portion: 'Clay Pot',
          rating: '4.9',
          price: 1950,
          description: 'Slow-cooked mutton in rich traditional gravy.',
          image: '../images/menu/rc-2.jpg'
        },
        {
          id: 'rc-3',
          name: 'Lahori Chicken Makhni Handi',
          category: 'Karahi & Handi',
          portion: 'Serves 2',
          rating: '4.8',
          price: 1650,
          description: 'Chicken cooked in creamy tomato butter gravy.',
          image: '../images/menu/rc-3.jpg'
        },
        {
          id: 'rc-5',
          name: 'Peshawari Charsi Mutton Karahi',
          category: 'Karahi & Handi',
          portion: 'Half kg',
          rating: '4.9',
          price: 2250,
          description: 'Traditional mutton karahi with tomatoes and ginger.',
          image: '../images/menu/rc-5.jpg'
        },
        {
          id: 'rc-7',
          name: 'Special Daal Makhni',
          category: 'Daal & Rice',
          portion: 'Regular Bowl',
          rating: '4.8',
          price: 850,
          description: 'Creamy black lentils slow-cooked with butter and traditional spices.',
          image: '../images/menu/rc-7.jpg'
        },
        {
          id: 'rc-8',
          name: 'Traditional Daal Chawal',
          category: 'Daal & Rice',
          portion: 'Full Plate',
          rating: '4.9',
          price: 550,
          description: 'Comforting spiced lentils served with steamed white rice.',
          image: '../images/menu/rc-8.jpg'
        }
      ]
    },

    'tandoor-breads': {
      filters: [
        'All',
        'Classic Naans',
        'Stuffed & Specialty',
        'Roti & Parathas'
      ],
      items: [
        {
          id: 'tb-1',
          name: 'Roghni Sesame Naan',
          category: 'Classic Naans',
          portion: '1 Piece',
          rating: '4.9',
          price: 140,
          description: 'Soft naan topped with butter and sesame seeds.',
          image: '../images/menu/tb-1.jpg'
        },
        {
          id: 'tb-2',
          name: 'Roasted Garlic & Coriander Naan',
          category: 'Classic Naans',
          portion: '1 Piece',
          rating: '4.9',
          price: 180,
          description: 'Fresh naan with roasted garlic and coriander.',
          image: '../images/menu/tb-2.jpg'
        },
        {
          id: 'tb-3',
          name: 'Peshawari Almond & Coconut Naan',
          category: 'Stuffed & Specialty',
          portion: '1 Piece',
          rating: '4.8',
          price: 320,
          description: 'Sweet naan filled with nuts and coconut.',
          image: '../images/menu/tb-3.jpg'
        },
        {
          id: 'tb-4',
          name: 'Spiced Keema Stuffed Naan',
          category: 'Stuffed & Specialty',
          portion: '1 Piece',
          rating: '4.9',
          price: 450,
          description: 'Tandoori bread filled with spiced minced meat.',
          image: '../images/menu/tb-4.jpg'
        },
        {
          id: 'tb-5',
          name: 'Flaky Lachha Tandoori Paratha',
          category: 'Roti & Parathas',
          portion: '1 Piece',
          rating: '4.8',
          price: 220,
          description: 'Crispy layered paratha prepared with ghee.',
          image: '../images/menu/tb-5.jpg'
        },
        {
          id: 'tb-6',
          name: 'Whole-Wheat Khamiri Roti',
          category: 'Roti & Parathas',
          portion: '1 Piece',
          rating: '4.7',
          price: 90,
          description: 'Soft traditional whole-wheat tandoori roti.',
          image: '../images/menu/tb-6.jpg'
        }
      ]
    },

    'sides-addons': {
      filters: [
        'All',
        'Raita & Chutneys',
        'Fresh Salads',
        'Crispy Starters'
      ],
      items: [
        {
          id: 'sa-1',
          name: 'Mint & Coriander Raita',
          category: 'Raita & Chutneys',
          portion: '250 ml',
          rating: '4.9',
          price: 180,
          description: 'Chilled yogurt blended with fresh mint and coriander.',
          image: '../images/menu/sa-1.jpg'
        },
        {
          id: 'sa-2',
          name: 'Tamarind & Plum Imli Chutney',
          category: 'Raita & Chutneys',
          portion: '150 ml',
          rating: '4.8',
          price: 160,
          description: 'Sweet and tangy traditional tamarind chutney.',
          image: '../images/menu/sa-2.jpg'
        },
        {
          id: 'sa-3',
          name: 'Fresh Kachumber Garden Salad',
          category: 'Fresh Salads',
          portion: 'Regular Bowl',
          rating: '4.7',
          price: 240,
          description: 'Fresh cucumber, tomatoes, onions and coriander.',
          image: '../images/menu/sa-3.jpg'
        },
        {
          id: 'sa-4',
          name: 'Zeera & Crispy Boondi Raita',
          category: 'Raita & Chutneys',
          portion: '250 ml',
          rating: '4.8',
          price: 210,
          description: 'Creamy yogurt topped with crunchy boondi and cumin.',
          image: '../images/menu/sa-4.jpg'
        },
        {
          id: 'sa-5',
          name: 'Loaded House Masala Fries',
          category: 'Crispy Starters',
          portion: 'Sharing Tray',
          rating: '4.9',
          price: 420,
          description: 'Golden crispy fries tossed in special masala.',
          image: '../images/menu/sa-5.jpg'
        },
        {
          id: 'sa-6',
          name: 'Crispy Vegetable Samosa Trio',
          category: 'Crispy Starters',
          portion: '3 Pieces',
          rating: '4.8',
          price: 360,
          description: 'Crispy pastry filled with spiced potatoes and peas.',
          image: '../images/menu/sa-6.jpg'
        }
      ]
    }
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatPrice(amount) {
    return 'Rs. ' + Number(amount).toLocaleString('en-US');
  }

  function renderFilters(filters, selectedFilter, onFilterChange) {
    var container = document.getElementById('categoryFilters');
    if (!container) return;

    container.innerHTML = '';

    filters.forEach(function (filter) {
      var button = document.createElement('button');

      button.type = 'button';
      button.className = 'm3-filter-btn' +
        (filter === selectedFilter ? ' active' : '');
      button.textContent = filter;

      button.addEventListener('click', function () {
        onFilterChange(filter);
      });

      container.appendChild(button);
    });
  }

  function renderDishes(items, selectedFilter, searchText) {
    var grid = document.getElementById('menuGrid');
    var countEl = document.getElementById('menuCount');

    if (!grid) {
      console.error('menuGrid element not found.');
      return;
    }

    var search = (searchText || '').toLowerCase().trim();

    var filtered = items.filter(function (item) {
      var matchesCategory = selectedFilter === 'All' ||
        item.category === selectedFilter;

      var matchesSearch =
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });

    if (countEl) {
      countEl.textContent = filtered.length +
        (filtered.length === 1 ? ' Dish Available' : ' Dishes Available');
    }

    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML =
        '<div class="col-12 text-center py-5">' +
          '<h3>No results found</h3>' +
          '<p>Try searching for another dish.</p>' +
        '</div>';
      return;
    }

    filtered.forEach(function (dish) {
      var col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4';

      col.innerHTML =
        '<article class="m3-dish-card h-100">' +
          '<div class="m3-dish-media">' +
            '<img src="' + escapeHtml(dish.image) + '"' +
              ' alt="' + escapeHtml(dish.name) + '"' +
              ' class="m3-dish-img"' +
              ' loading="lazy">' +
          '</div>' +
          '<div class="m3-dish-body">' +
            '<span class="m3-dish-category">' +
              escapeHtml(dish.category) +
            '</span>' +
            '<h2 class="m3-dish-title">' +
              escapeHtml(dish.name) +
            '</h2>' +
            '<p class="m3-dish-description">' +
              escapeHtml(dish.description) +
            '</p>' +
            '<div class="m3-dish-meta">' +
              '<span>' + escapeHtml(dish.portion) + '</span>' +
              '<span><i class="bi bi-star-fill"></i> ' +
                escapeHtml(dish.rating) +
              '</span>' +
            '</div>' +
            '<div class="m3-dish-footer">' +
              '<strong class="m3-dish-price">' +
                formatPrice(dish.price) +
              '</strong>' +
              '<button type="button" class="btn btn-flavour-primary m3-add-btn"' +
                ' data-dish-id="' + escapeHtml(dish.id) + '">' +
                '<i class="bi bi-bag-plus"></i> Add to Cart' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</article>';

      var image = col.querySelector('.m3-dish-img');

      image.addEventListener('error', function () {
        if (image.dataset.fallbackApplied === 'true') return;

        image.dataset.fallbackApplied = 'true';
        image.src = FALLBACK_IMAGE;
      });

      grid.appendChild(col);
    });
  }

  function addToSharedCart(dish) {
    var payload = {
      id: String(dish.id),
      name: String(dish.name),
      price: Number(dish.price),
      quantity: 1,
      image: String(dish.image || '')
    };

    if (window.FlavourCart &&
        typeof window.FlavourCart.addItem === 'function') {
      window.FlavourCart.addItem(payload);
      return;
    }

    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var cart = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(cart)) cart = [];

      var existing = cart.find(function (entry) {
        return entry && String(entry.id) === payload.id;
      });

      if (existing) {
        existing.quantity =
          (parseInt(existing.quantity, 10) || 1) + 1;
      } else {
        cart.push(payload);
      }

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart)
      );

      var total = cart.reduce(function (sum, entry) {
        return sum + (parseInt(entry.quantity, 10) || 0);
      }, 0);

      document.querySelectorAll('[data-cart-count], #cart-count')
        .forEach(function (badge) {
          badge.textContent = String(total);
        });

    } catch (error) {
      console.error('Unable to update cart.', error);
    }
  }

  function showAddedToast(dishName) {
    var toastEl = document.getElementById('cartToast');
    var msgEl = document.getElementById('cartToastMessage');

    if (msgEl) {
      msgEl.textContent = dishName + ' added to cart';
    }

    if (!toastEl || typeof bootstrap === 'undefined' ||
        !bootstrap.Toast) {
      return;
    }

    bootstrap.Toast.getOrCreateInstance(toastEl, {
      delay: 2400
    }).show();
  }

  function initializeMember3() {
    var pageKey = document.body.getAttribute('data-member3-page');
    var pageData = CATALOG[pageKey];

    console.log('Member 3 page:', pageKey);

    if (!pageData) {
      console.error('Menu data not found:', pageKey);
      return;
    }

    var currentFilter = 'All';
    var currentSearch = '';
    var searchInput = document.getElementById('menuSearch');

    function updateView(filter) {
      currentFilter = filter;

      renderFilters(
        pageData.filters,
        currentFilter,
        updateView
      );

      renderDishes(
        pageData.items,
        currentFilter,
        currentSearch
      );
    }

    updateView('All');

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentSearch = this.value;

        renderDishes(
          pageData.items,
          currentFilter,
          currentSearch
        );
      });
    }

    if (window.FlavourCart &&
        typeof window.FlavourCart.updateCartBadge === 'function') {
      window.FlavourCart.updateCartBadge();
    }

    var grid = document.getElementById('menuGrid');

    if (grid) {
      grid.addEventListener('click', function (event) {
        var button = event.target.closest('.m3-add-btn');
        if (!button) return;

        var dishId = button.getAttribute('data-dish-id');

        var dish = pageData.items.find(function (item) {
          return item.id === dishId;
        });

        if (!dish) return;

        addToSharedCart(dish);
        showAddedToast(dish.name);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initializeMember3
    );
  } else {
    initializeMember3();
  }

})();
