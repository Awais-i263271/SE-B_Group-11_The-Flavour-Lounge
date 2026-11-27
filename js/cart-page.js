// ==========================================================
// The Flavour Lounge - Shopping Cart Page Logic
// Uses the shared window.FlavourCart helper from js/cart.js
// ==========================================================

// localStorage key for applied promo code
const PROMO_STORAGE_KEY = "flavourPromo";

// Order rules and fee constants
const MIN_QTY = 1;
const MAX_QTY = 20;
const DELIVERY_FEE = 50;
const TAX_RATE = 0.05;
const WELCOME_MIN_SUBTOTAL = 1000;

// Fallback SVG image used if an item does not have an image or fails to load
const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">
        <rect width="240" height="180" fill="#800000"/>
        <circle cx="120" cy="82" r="42" fill="#FFF8E7" stroke="#FF6B00" stroke-width="3"/>
        <text x="120" y="87" text-anchor="middle" fill="#800000" font-family="Georgia, serif" font-size="13" font-weight="bold">DISH</text>
        <text x="120" y="152" text-anchor="middle" fill="#FFF8E7" font-family="Poppins, sans-serif" font-size="12">The Flavour Lounge</text>
    </svg>
`);

// Safely read the saved promo object { code, discountAmount } from localStorage
function getSavedPromo() {
    try {
        const rawPromo = localStorage.getItem(PROMO_STORAGE_KEY);
        if (!rawPromo) {
            return null;
        }
        const parsed = JSON.parse(rawPromo);
        return parsed && typeof parsed.code === "string" ? parsed : null;
    } catch (error) {
        return null;
    }
}

// Save applied promo { code, discountAmount } to localStorage
function savePromo(code, discountAmount) {
    localStorage.setItem(
        PROMO_STORAGE_KEY,
        JSON.stringify({ code: code, discountAmount: discountAmount })
    );
}

// Remove saved promo from localStorage
function clearPromo() {
    localStorage.removeItem(PROMO_STORAGE_KEY);
}

// Format money consistently as "Rs. 1,234"
function formatPrice(amount) {
    const rounded = Math.round(Number(amount) || 0);
    return "Rs. " + rounded.toLocaleString("en-US");
}

// Escape HTML special characters so item names render safely
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Display status or error message under the promo code input
function setPromoMessage(message, type) {
    const promoMessage = document.getElementById("promoMessage");
    if (!promoMessage) {
        return;
    }
    promoMessage.textContent = message;
    promoMessage.classList.remove("is-error", "is-success");

    if (type === "error") {
        promoMessage.classList.add("is-error");
    } else if (type === "success") {
        promoMessage.classList.add("is-success");
    }
}

// Validate a promo code against current subtotal and calculate its discount
function evaluatePromoCode(code, subtotal) {
    if (!code) {
        return { valid: false, discountAmount: 0, message: "Please enter a promo code." };
    }

    if (code === "FLAVOUR10") {
        if (subtotal <= 0) {
            return { valid: false, discountAmount: 0, message: "Add items to your cart before applying a promo code." };
        }
        const discount = Math.round(subtotal * 0.10);
        return { valid: true, discountAmount: discount, message: "Promo FLAVOUR10 applied (10% off)." };
    }

    if (code === "WELCOME100") {
        if (subtotal < WELCOME_MIN_SUBTOTAL) {
            return {
                valid: false,
                discountAmount: 0,
                message: "WELCOME100 requires a minimum subtotal of Rs. 1,000."
            };
        }
        return { valid: true, discountAmount: 100, message: "Promo WELCOME100 applied (Rs. 100 off)." };
    }

    return {
        valid: false,
        discountAmount: 0,
        message: "Invalid promo code. Try FLAVOUR10 or WELCOME100."
    };
}

// Calculate and update the Order Summary card (Subtotal, Discount, Delivery, Tax, Total)
function updateOrderSummary(cart) {
    const subtotalElement = document.getElementById("summarySubtotal");
    const discountRow = document.getElementById("discountRow");
    const appliedPromoLabel = document.getElementById("appliedPromoLabel");
    const summaryDiscount = document.getElementById("summaryDiscount");
    const deliveryElement = document.getElementById("summaryDelivery");
    const taxElement = document.getElementById("summaryTax");
    const totalElement = document.getElementById("summaryTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const promoInput = document.getElementById("promoInput");

    // Guard: if FlavourCart failed to load, show zeros and disable checkout
    if (typeof FlavourCart === "undefined") {
        if (subtotalElement) subtotalElement.textContent = "Rs. 0";
        if (deliveryElement) deliveryElement.textContent = "Rs. 0";
        if (taxElement) taxElement.textContent = "Rs. 0";
        if (totalElement) totalElement.textContent = "Rs. 0";
        if (checkoutBtn) {
            checkoutBtn.classList.add("disabled");
            checkoutBtn.setAttribute("aria-disabled", "true");
        }
        return;
    }

    // Calculate subtotal using the shared FlavourCart helper
    const subtotal = FlavourCart.getTotalPrice(cart);
    const isEmpty = cart.length === 0;
    const deliveryFee = isEmpty ? 0 : DELIVERY_FEE;

    let discountAmount = 0;
    const savedPromo = getSavedPromo();

    if (isEmpty) {
        if (savedPromo) {
            clearPromo();
            setPromoMessage("", "");
        }
    } else if (savedPromo) {
        const result = evaluatePromoCode(savedPromo.code, subtotal);
        if (result.valid) {
            discountAmount = result.discountAmount;
            savePromo(savedPromo.code, discountAmount);
            if (!promoInput.value) {
                promoInput.value = savedPromo.code;
            }
            appliedPromoLabel.textContent = savedPromo.code;
            summaryDiscount.textContent = "- " + formatPrice(discountAmount);
            discountRow.classList.remove("d-none");
        } else {
            clearPromo();
            setPromoMessage(result.message, "error");
        }
    }

    if (discountAmount === 0) {
        discountRow.classList.add("d-none");
    }

    // Tax is 5% of the subtotal after discount
    const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
    const tax = isEmpty ? 0 : Math.round(subtotalAfterDiscount * TAX_RATE);
    const total = subtotalAfterDiscount + deliveryFee + tax;

    subtotalElement.textContent = formatPrice(subtotal);
    deliveryElement.textContent = formatPrice(deliveryFee);
    taxElement.textContent = formatPrice(tax);
    totalElement.textContent = formatPrice(total);

    // Disable "Proceed to Checkout" when the cart is empty
    if (isEmpty) {
        checkoutBtn.classList.add("disabled");
        checkoutBtn.setAttribute("aria-disabled", "true");
        checkoutBtn.setAttribute("tabindex", "-1");
    } else {
        checkoutBtn.classList.remove("disabled");
        checkoutBtn.removeAttribute("aria-disabled");
        checkoutBtn.removeAttribute("tabindex");
    }
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
    const cart = FlavourCart.getCart();
    const item = cart.find(function (entry) {
        return entry.id === String(itemId);
    });

    if (!item) {
        return;
    }

    const nextQty = item.quantity + delta;

    if (nextQty < MIN_QTY) {
        showInlineQtyError(itemId, "Minimum quantity is 1.");
        return;
    }

    if (nextQty > MAX_QTY) {
        showInlineQtyError(itemId, "Maximum quantity is 20.");
        return;
    }

    // Update via shared helper (which saves to flavourLoungeCart and syncs navbar badge)
    FlavourCart.updateQuantity(itemId, nextQty);
    renderCart();
}

// Delete an item via shared helper and re-render
function deleteCartItem(itemId) {
    FlavourCart.removeItem(itemId);
    renderCart();
}

// Render all cart rows (or empty cart state), Order Summary, and navbar badge
function renderCart() {
    const cartContainer = document.getElementById("cartContainer");

    // Guard: if FlavourCart helper is unavailable, show empty cart gracefully
    if (typeof FlavourCart === "undefined") {
        console.warn("FlavourCart helper not available — cart.js may have failed to load.");
        if (cartContainer) {
            cartContainer.innerHTML = `
                <div class="empty-cart-box text-center">
                    <p class="empty-cart-badge mb-2">&#9733; Ready When You Are</p>
                    <h2 class="h3 fw-bold empty-cart-title mb-3">Your cart is empty</h2>
                    <p class="text-muted mx-auto mb-4">
                        Explore our freshly prepared Pakistani dishes and chef's combo deals to start your order.
                    </p>
                    <div class="d-flex flex-wrap justify-content-center gap-3">
                        <a href="menu.html" class="btn btn-flavour-primary">Browse Menu</a>
                        <a href="special-deals.html" class="btn btn-flavour-outline">Browse Deals</a>
                    </div>
                </div>
            `;
        }
        updateOrderSummary([]);
        return;
    }

    const cart = FlavourCart.getCart();

    // Keep navbar badge and Order Summary in sync
    FlavourCart.updateCartBadge();
    updateOrderSummary(cart);

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-box text-center">
                <p class="empty-cart-badge mb-2">&#9733; Ready When You Are</p>
                <h2 class="h3 fw-bold empty-cart-title mb-3">Your cart is empty</h2>
                <p class="text-muted mx-auto mb-4">
                    Explore our freshly prepared Pakistani dishes and chef's combo deals to start your order.
                </p>
                <div class="d-flex flex-wrap justify-content-center gap-3">
                    <a href="menu.html" class="btn btn-flavour-primary">Browse Menu</a>
                    <a href="special-deals.html" class="btn btn-flavour-outline">Browse Deals</a>
                </div>
            </div>
        `;
        return;
    }

    let rowsHtml = "";

    // Render each item from shared FlavourCart data ({ id, name, price, quantity, image })
    cart.forEach(function (item) {
        const safeId = escapeHtml(item.id);
        const safeName = escapeHtml(item.name);
        const unitPrice = Number(item.price) || 0;
        const qty = Number(item.quantity) || 1;
        const lineTotal = unitPrice * qty;
        const imageSrc = item.image ? escapeHtml(item.image) : FALLBACK_IMAGE;

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

    cartContainer.innerHTML = rowsHtml;
}

// Handle promo code form submission
function handlePromoSubmit(event) {
    event.preventDefault();

    // Guard against missing FlavourCart
    if (typeof FlavourCart === "undefined") {
        setPromoMessage("Cart not available. Please reload the page.", "error");
        return;
    }

    const promoInput = document.getElementById("promoInput");
    const rawCode = promoInput.value.trim().toUpperCase();
    const cart = FlavourCart.getCart();
    const subtotal = FlavourCart.getTotalPrice(cart);

    const result = evaluatePromoCode(rawCode, subtotal);

    if (!result.valid) {
        setPromoMessage(result.message, "error");
        return;
    }

    savePromo(rawCode, result.discountAmount);
    setPromoMessage(result.message, "success");
    updateOrderSummary(cart);
}

// Initialize cart page once the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Wrap full init in try/catch so a corrupted cart never crashes the page
    try {
        renderCart();

        const restoredPromo = getSavedPromo();
        if (restoredPromo && typeof FlavourCart !== "undefined" && FlavourCart.getCart().length > 0) {
            setPromoMessage("Promo " + restoredPromo.code + " applied.", "success");
        }
    } catch (err) {
        console.warn("Cart init error:", err);
        // Render empty cart as a safe fallback
        const cartContainer = document.getElementById("cartContainer");
        if (cartContainer) {
            cartContainer.innerHTML = `
                <div class="empty-cart-box text-center">
                    <h2 class="h3 fw-bold empty-cart-title mb-3">Your cart is empty</h2>
                    <div class="d-flex flex-wrap justify-content-center gap-3">
                        <a href="menu.html" class="btn btn-flavour-primary">Browse Menu</a>
                        <a href="special-deals.html" class="btn btn-flavour-outline">Browse Deals</a>
                    </div>
                </div>
            `;
        }
    }

    const cartContainer = document.getElementById("cartContainer");
    const promoForm = document.getElementById("promoForm");
    const checkoutBtn = document.getElementById("checkoutBtn");

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
            deleteCartItem(removeBtn.getAttribute("data-item-id"));
        }
    });

    promoForm.addEventListener("submit", handlePromoSubmit);

    checkoutBtn.addEventListener("click", function (event) {
        if (checkoutBtn.classList.contains("disabled")) {
            event.preventDefault();
        }
    });
});
