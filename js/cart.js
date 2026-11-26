// ==========================================================
// The Flavour Lounge - Shopping Cart Logic
// ==========================================================

// Same localStorage key used by Special Deals and Menu pages
const CART_STORAGE_KEY = "flavourCart";
const MIN_QTY = 1;
const MAX_QTY = 20;

// Fallback SVG image used if an item does not have an image or fails to load
const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">
        <rect width="240" height="180" fill="#181512"/>
        <circle cx="120" cy="82" r="42" fill="#241F1C" stroke="#F59E0B" stroke-width="3"/>
        <text x="120" y="87" text-anchor="middle" fill="#F59E0B" font-family="Segoe UI, sans-serif" font-size="13" font-weight="bold">DISH</text>
        <text x="120" y="152" text-anchor="middle" fill="#FAF3E0" font-family="Segoe UI, sans-serif" font-size="12">The Flavour Lounge</text>
    </svg>
`);

// Safely read and parse the cart array from localStorage
function getCart() {
    try {
        const rawCart = localStorage.getItem(CART_STORAGE_KEY);
        if (!rawCart) {
            return [];
        }
        const parsed = JSON.parse(rawCart);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        // Fall back to an empty array if JSON parsing fails
        return [];
    }
}

// Save the updated cart array back to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Format a numeric price in Pakistani Rupees (e.g., Rs. 1,350)
function formatPrice(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-PK");
}

// Escape HTML special characters so item names render safely
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Update the navbar Cart badge with the total item quantity
function updateCartBadge(cart) {
    const cartCountElement = document.getElementById("cartCount");
    const totalQty = cart.reduce(function (sum, item) {
        return sum + (Number(item.qty) || 0);
    }, 0);

    cartCountElement.textContent = totalQty;
}

// Show a small inline error message inside the row for invalid quantity limits
function showInlineQtyError(itemId, message) {
    const errorElement = document.querySelector(`.qty-error[data-error-id="${CSS.escape(itemId)}"]`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Change an item's quantity (+1 or -1) while enforcing the 1..20 limits
function changeQuantity(itemId, delta) {
    const cart = getCart();
    const item = cart.find(function (entry) {
        return String(entry.id) === String(itemId);
    });

    if (!item) {
        return;
    }

    const currentQty = Number(item.qty) || MIN_QTY;
    const nextQty = currentQty + delta;

    // Prevent going below 1
    if (nextQty < MIN_QTY) {
        showInlineQtyError(itemId, "Minimum quantity is 1.");
        return;
    }

    // Prevent going above 20
    if (nextQty > MAX_QTY) {
        showInlineQtyError(itemId, "Maximum quantity is 20.");
        return;
    }

    item.qty = nextQty;
    saveCart(cart);
    renderCart();
}

// Delete an item from the cart by id, save, and re-render
function removeItem(itemId) {
    const updatedCart = getCart().filter(function (entry) {
        return String(entry.id) !== String(itemId);
    });

    saveCart(updatedCart);
    renderCart();
}

// Render all cart rows (or the empty cart message) and sync the navbar badge
function renderCart() {
    const cartContainer = document.getElementById("cartContainer");
    const cart = getCart();

    // Always keep the navbar badge in sync
    updateCartBadge(cart);

    // Show empty state if there are no items in the cart
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-box text-center mx-auto">
                <p class="empty-cart-badge mb-2">&#9733; Ready When You Are</p>
                <h2 class="h3 fw-bold empty-cart-title mb-3">Your cart is empty</h2>
                <p class="hero-subtitle mx-auto mb-4">
                    Explore our freshly prepared Pakistani dishes and chef's combo deals to start your order.
                </p>
                <div class="d-flex flex-wrap justify-content-center gap-3">
                    <a href="menu.html" class="btn btn-bistro-primary">Browse Menu</a>
                    <a href="special-deals.html" class="btn btn-bistro-outline">Browse Deals</a>
                </div>
            </div>
        `;
        return;
    }

    let grandTotal = 0;
    let totalItems = 0;
    let rowsHtml = "";

    // Build one row per cart item from JavaScript data
    cart.forEach(function (item) {
        const safeId = escapeHtml(item.id);
        const safeName = escapeHtml(item.name || "Menu Item");
        const unitPrice = Number(item.price) || 0;
        const qty = Number(item.qty) || 1;
        const lineTotal = unitPrice * qty;
        const imageSrc = item.image ? escapeHtml(item.image) : FALLBACK_IMAGE;

        grandTotal += lineTotal;
        totalItems += qty;

        rowsHtml += `
            <div class="cart-item-row mb-3" data-item-id="${safeId}">
                <div class="row align-items-center gy-3">
                    <!-- Item Image and Name -->
                    <div class="col-12 col-md-5 d-flex align-items-center gap-3">
                        <img
                            src="${imageSrc}"
                            alt="${safeName}"
                            class="cart-item-img"
                            onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
                        >
                        <div>
                            <h2 class="h6 cart-item-name mb-1">${safeName}</h2>
                            <p class="unit-price mb-0">Unit Price: ${formatPrice(unitPrice)}</p>
                        </div>
                    </div>

                    <!-- Quantity Minus / Plus Control -->
                    <div class="col-6 col-md-3 text-md-center">
                        <div class="qty-control" role="group" aria-label="Quantity for ${safeName}">
                            <button
                                type="button"
                                class="btn-qty btn-minus"
                                data-item-id="${safeId}"
                                aria-label="Decrease quantity of ${safeName}"
                            >-</button>
                            <span class="qty-value">${qty}</span>
                            <button
                                type="button"
                                class="btn-qty btn-plus"
                                data-item-id="${safeId}"
                                aria-label="Increase quantity of ${safeName}"
                            >+</button>
                        </div>
                        <div class="qty-error mt-1" data-error-id="${safeId}" role="alert"></div>
                    </div>

                    <!-- Line Total -->
                    <div class="col-3 col-md-2 text-md-end">
                        <span class="d-block small unit-price">Line Total</span>
                        <span class="line-total">${formatPrice(lineTotal)}</span>
                    </div>

                    <!-- Remove Button -->
                    <div class="col-3 col-md-2 text-end">
                        <button
                            type="button"
                            class="btn-remove"
                            data-item-id="${safeId}"
                        >Remove</button>
                    </div>
                </div>
            </div>
        `;
    });

    // Combine item rows with a simple Order Summary card
    cartContainer.innerHTML = `
        <div class="row g-4">
            <div class="col-lg-8">
                ${rowsHtml}
            </div>
            <div class="col-lg-4">
                <aside class="cart-summary-card">
                    <h2 class="h5 fw-bold mb-3">Cart Summary</h2>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="summary-label">Total Items</span>
                        <span class="fw-semibold">${totalItems}</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <span class="fw-semibold">Grand Total</span>
                        <span class="summary-total">${formatPrice(grandTotal)}</span>
                    </div>
                    <div class="d-grid gap-2">
                        <a href="special-deals.html" class="btn btn-bistro-primary text-center">Browse Deals</a>
                        <a href="menu.html" class="btn btn-bistro-outline text-center">Browse Menu</a>
                    </div>
                </aside>
            </div>
        </div>
    `;
}

// Initialize cart page and attach click event listeners
document.addEventListener("DOMContentLoaded", function () {
    renderCart();

    const cartContainer = document.getElementById("cartContainer");

    // Event delegation for minus, plus, and remove buttons
    cartContainer.addEventListener("click", function (event) {
        const minusBtn = event.target.closest(".btn-minus");
        if (minusBtn) {
            changeQuantity(minusBtn.getAttribute("data-item-id"), -1);
            return;
        }

        const plusBtn = event.target.closest(".btn-plus");
        if (plusBtn) {
            changeQuantity(plusBtn.getAttribute("data-item-id"), 1);
            return;
        }

        const removeBtn = event.target.closest(".btn-remove");
        if (removeBtn) {
            removeItem(removeBtn.getAttribute("data-item-id"));
        }
    });
});
