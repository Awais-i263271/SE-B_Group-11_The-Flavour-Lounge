/**
 * Shared Cart Helper for The Flavour Lounge
 * Persists cart items in localStorage under the key "flavourLoungeCart".
 * Item shape: { id, name, price, quantity, image }
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'flavourLoungeCart';

  /**
   * Normalize a single cart item to ensure consistent types and required fields.
   * @param {Object} item
   * @returns {{ id: string, name: string, price: number, quantity: number, image: string } | null}
   */
  function normalizeItem(item) {
    if (!item || item.id === undefined || item.id === null || item.id === '') {
      return null;
    }

    const parsedPrice = Number(item.price);
    const parsedQuantity = parseInt(item.quantity, 10);

    return {
      id: String(item.id),
      name: String(item.name || 'Unnamed Dish'),
      price: Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0,
      quantity: Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1,
      image: String(item.image || '')
    };
  }

  /**
   * Read and parse the cart array from localStorage.
   * @returns {Array<{ id: string, name: string, price: number, quantity: number, image: string }>}
   */
  function getCart() {
    try {
      const raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.map(normalizeItem).filter(Boolean);
    } catch (err) {
      console.error('FlavourCart: Unable to read cart from localStorage.', err);
      return [];
    }
  }

  /**
   * Persist the cart array to localStorage, update navbar badges, and notify listeners.
   * @param {Array<Object>} cart
   * @returns {Array<{ id: string, name: string, price: number, quantity: number, image: string }>}
   */
  function saveCart(cart) {
    const normalized = Array.isArray(cart)
      ? cart.map(normalizeItem).filter(Boolean)
      : [];

    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (err) {
      console.error('FlavourCart: Unable to save cart to localStorage.', err);
    }

    updateCartBadge();
    global.dispatchEvent(
      new CustomEvent('flavourCartUpdated', {
        detail: {
          cart: normalized,
          totalItems: getTotalItems(normalized),
          totalPrice: getTotalPrice(normalized)
        }
      })
    );

    return normalized;
  }

  /**
   * Add an item to the cart or increment its quantity if it already exists.
   * @param {{ id: string|number, name: string, price: number, quantity?: number, image?: string }} item
   * @returns {Array}
   */
  function addItem(item) {
    const clean = normalizeItem(item);
    if (!clean) {
      throw new Error('FlavourCart.addItem requires an item with a valid id.');
    }

    const cart = getCart();
    const existing = cart.find((entry) => entry.id === clean.id);

    if (existing) {
      existing.quantity += clean.quantity;
      if (clean.name) existing.name = clean.name;
      if (clean.price >= 0) existing.price = clean.price;
      if (clean.image) existing.image = clean.image;
    } else {
      cart.push(clean);
    }

    return saveCart(cart);
  }

  /**
   * Update an existing item's quantity; removes the item if quantity <= 0.
   * @param {string|number} id
   * @param {number} quantity
   * @returns {Array}
   */
  function updateQuantity(id, quantity) {
    const targetId = String(id);
    const parsedQty = parseInt(quantity, 10);

    if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
      return removeItem(targetId);
    }

    const cart = getCart();
    const item = cart.find((entry) => entry.id === targetId);
    if (!item) {
      return cart;
    }

    item.quantity = parsedQty;
    return saveCart(cart);
  }

  /**
   * Remove an item from the cart by its id.
   * @param {string|number} id
   * @returns {Array}
   */
  function removeItem(id) {
    const targetId = String(id);
    const cart = getCart().filter((entry) => entry.id !== targetId);
    return saveCart(cart);
  }

  /**
   * Clear all items from the cart.
   * @returns {Array}
   */
  function clearCart() {
    return saveCart([]);
  }

  /**
   * Get total quantity of all items in the cart.
   * @param {Array} [cart]
   * @returns {number}
   */
  function getTotalItems(cart) {
    const items = Array.isArray(cart) ? cart : getCart();
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  /**
   * Get total price of all items in the cart.
   * @param {Array} [cart]
   * @returns {number}
   */
  function getTotalPrice(cart) {
    const items = Array.isArray(cart) ? cart : getCart();
    const total = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
      0
    );
    return Math.round(total * 100) / 100;
  }

  /**
   * Update all cart count badge elements in the DOM.
   * @param {string} [selector='[data-cart-count], #cart-count']
   */
  function updateCartBadge(selector) {
    if (typeof document === 'undefined') {
      return;
    }
    const targetSelector = selector || '[data-cart-count], #cart-count';
    const badges = document.querySelectorAll(targetSelector);
    const count = getTotalItems();

    badges.forEach((badge) => {
      badge.textContent = String(count);
    });
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      updateCartBadge();
    });
  }

  global.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY) {
      updateCartBadge();
    }
  });

  global.FlavourCart = {
    STORAGE_KEY: STORAGE_KEY,
    getCart: getCart,
    saveCart: saveCart,
    addItem: addItem,
    updateQuantity: updateQuantity,
    removeItem: removeItem,
    clearCart: clearCart,
    getTotalItems: getTotalItems,
    getTotalPrice: getTotalPrice,
    updateCartBadge: updateCartBadge
  };
})(window);
