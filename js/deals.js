// ==========================================================
// The Flavour Lounge - Special Deals Logic
// ==========================================================

// Key used in localStorage so cart data is shared and survives page reloads
const CART_STORAGE_KEY = "flavourCart";

// Generate a lightweight local SVG dish image so cards work offline without broken links
function createDishImage(title, category) {
    const safeTitle = title.replace(/&/g, "and");
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="320" viewBox="0 0 600 320">
            <rect width="600" height="320" fill="#181512"/>
            <circle cx="300" cy="145" r="78" fill="#241F1C" stroke="#F59E0B" stroke-width="3"/>
            <circle cx="300" cy="145" r="56" fill="none" stroke="#FF6B00" stroke-width="2" stroke-dasharray="6 5"/>
            <text x="300" y="140" text-anchor="middle" fill="#F59E0B" font-family="Segoe UI, sans-serif" font-size="18" font-weight="bold">${category.toUpperCase()}</text>
            <text x="300" y="166" text-anchor="middle" fill="#FAF3E0" font-family="Segoe UI, sans-serif" font-size="13">The Flavour Lounge</text>
            <text x="300" y="275" text-anchor="middle" fill="#FAF3E0" font-family="Segoe UI, sans-serif" font-size="18" font-weight="600">${safeTitle}</text>
        </svg>
    `;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

// Array of 6 realistic Pakistani restaurant deals
const deals = [
    {
        id: "deal-1",
        name: "Karachi Chicken Dum Biryani Feast",
        items: "2 Full Chicken Dum Biryani plates, 2 Shami Kababs, Mint Raita, and 2 Chilled Soft Drinks.",
        oldPrice: 1800,
        newPrice: 1350,
        category: "Biryani",
        badge: "Freshly Prepared",
        rating: "4.9",
        image: createDishImage("Karachi Chicken Dum Biryani Feast", "Biryani"),
        alt: "Steaming Karachi Chicken Dum Biryani served with Shami Kababs and Mint Raita"
    },
    {
        id: "deal-2",
        name: "Seekh Kabab & Malai Boti Platter",
        items: "4 Charcoal Beef Seekh Kababs, 6 Creamy Chicken Malai Boti pieces, 2 Garlic Naans, and Tamarind Chutney.",
        oldPrice: 2500,
        newPrice: 1750,
        category: "BBQ",
        badge: "Available",
        rating: "4.8",
        image: createDishImage("Seekh Kabab & Malai Boti Platter", "BBQ"),
        alt: "Grilled Seekh Kabab and Chicken Malai Boti BBQ platter with Garlic Naans"
    },
    {
        id: "deal-3",
        name: "Lahori Family Karahi Combo",
        items: "Full Chicken Makhni Karahi, 4 Fresh Roghni Naans, Kachumber Salad, and 1.5L Family Drink.",
        oldPrice: 3600,
        newPrice: 2880,
        category: "Combos",
        badge: "Available",
        rating: "4.9",
        image: createDishImage("Lahori Family Karahi Combo", "Combos"),
        alt: "Traditional Lahori Chicken Karahi combo with Roghni Naans and salad"
    },
    {
        id: "deal-4",
        name: "Shahi Mutton Sindhi Biryani Deal",
        items: "Aromatic Mutton Sindhi Biryani cooked with plums and saffron, served with Zeera Raita and Salad.",
        oldPrice: 2200,
        newPrice: 1650,
        category: "Biryani",
        badge: "Freshly Prepared",
        rating: "4.7",
        image: createDishImage("Shahi Mutton Sindhi Biryani Deal", "Biryani"),
        alt: "Shahi Mutton Sindhi Biryani garnished with fried onions and fresh coriander"
    },
    {
        id: "deal-5",
        name: "Charcoal Tikka & Paratha Duo",
        items: "2 Spicy Charcoal Chicken Tikkas (Leg and Chest), 2 Crispy Tandoori Parathas, and Green Chutney.",
        oldPrice: 1500,
        newPrice: 1200,
        category: "BBQ",
        badge: "Freshly Prepared",
        rating: "4.8",
        image: createDishImage("Charcoal Tikka & Paratha Duo", "BBQ"),
        alt: "Charcoal grilled Chicken Tikka pieces served with crispy Tandoori Parathas"
    },
    {
        id: "deal-6",
        name: "Mint Margarita & Kashmiri Chai Pair",
        items: "1 Chilled Fresh Mint Lemonade Pitcher paired with 2 Hot Pistachio Kashmiri Pink Chais.",
        oldPrice: 1200,
        newPrice: 840,
        category: "Drinks",
        badge: "Available",
        rating: "4.9",
        image: createDishImage("Mint Margarita & Kashmiri Chai Pair", "Drinks"),
        alt: "Refreshing Mint Lemonade pitcher alongside cups of Kashmiri Pink Chai"
    }
];

// Calculate discount percentage dynamically from oldPrice and newPrice
function calculateDiscount(oldPrice, newPrice) {
    const savings = oldPrice - newPrice;
    return Math.round((savings / oldPrice) * 100);
}

// Format number as Pakistani Rupees (e.g., Rs. 1,350)
function formatPrice(amount) {
    return "Rs. " + amount.toLocaleString("en-PK");
}

// Safely read the cart array from localStorage using try/catch
function getCart() {
    try {
        const rawCart = localStorage.getItem(CART_STORAGE_KEY);
        if (!rawCart) {
            return [];
        }
        const parsedCart = JSON.parse(rawCart);
        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
        // Fall back to an empty array if stored JSON is corrupted
        return [];
    }
}

// Save the cart array back to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Update the navbar Cart badge with the total item quantity
function updateCartBadge() {
    const cartCountElement = document.getElementById("cartCount");
    const cart = getCart();
    const totalQty = cart.reduce(function (sum, item) {
        return sum + (Number(item.qty) || 0);
    }, 0);

    cartCountElement.textContent = totalQty;
}

// Show Bootstrap toast message "Added to cart"
function showAddedToCartToast() {
    const toastElement = document.getElementById("cartToast");
    const toastInstance = bootstrap.Toast.getOrCreateInstance(toastElement, {
        delay: 2200
    });
    toastInstance.show();
}

// Add a deal to the cart (increase qty if it already exists, otherwise push with qty 1)
function addToCart(dealId) {
    const selectedDeal = deals.find(function (deal) {
        return deal.id === dealId;
    });

    if (!selectedDeal) {
        return;
    }

    const cart = getCart();
    const existingItem = cart.find(function (item) {
        return item.id === selectedDeal.id;
    });

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id: selectedDeal.id,
            name: selectedDeal.name,
            price: selectedDeal.newPrice,
            qty: 1,
            image: selectedDeal.image
        });
    }

    saveCart(cart);
    updateCartBadge();
    showAddedToCartToast();
}

// Render deal cards into the Bootstrap grid (or show empty message if no deals match)
function renderDeals(selectedCategory) {
    const dealsGrid = document.getElementById("dealsGrid");
    dealsGrid.innerHTML = "";

    const filteredDeals = selectedCategory === "All"
        ? deals
        : deals.filter(function (deal) {
            return deal.category === selectedCategory;
        });

    // Show message when a filter has no matching deals
    if (filteredDeals.length === 0) {
        dealsGrid.innerHTML = `
            <div class="col-12 text-center">
                <p class="empty-deals-msg mb-0">No deals found in this category.</p>
            </div>
        `;
        return;
    }

    // Build and insert one Bootstrap column card per matching deal
    filteredDeals.forEach(function (deal) {
        const discountPercent = calculateDiscount(deal.oldPrice, deal.newPrice);

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        col.innerHTML = `
            <article class="card deal-card h-100">
                <div class="deal-img-wrapper">
                    <img src="${deal.image}" class="deal-img" alt="${deal.alt}">
                    <span class="discount-badge">${discountPercent}% OFF</span>
                </div>
                <div class="card-body d-flex flex-column p-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="category-tag">&#9733; ${deal.category}</span>
                        <span class="status-badge">${deal.badge}</span>
                    </div>
                    <h2 class="h5 fw-bold deal-title mb-2">${deal.name}</h2>
                    <p class="deal-items flex-grow-1 mb-3">${deal.items}</p>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="d-flex align-items-baseline gap-2">
                            <span class="new-price">${formatPrice(deal.newPrice)}</span>
                            <span class="old-price">${formatPrice(deal.oldPrice)}</span>
                        </div>
                        <span class="star-rating" aria-label="Rated ${deal.rating} out of 5">
                            &#9733; ${deal.rating}
                        </span>
                    </div>
                    <button type="button" class="btn btn-order w-100" data-deal-id="${deal.id}">
                        Add to Cart
                    </button>
                </div>
            </article>
        `;

        dealsGrid.appendChild(col);
    });
}

// Initialize page once the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    // Render all deals and sync navbar cart badge from localStorage on load
    renderDeals("All");
    updateCartBadge();

    // Handle category filter clicks
    const filterContainer = document.getElementById("categoryFilters");
    filterContainer.addEventListener("click", function (event) {
        const clickedButton = event.target.closest(".filter-btn");
        if (!clickedButton) {
            return;
        }

        const allButtons = filterContainer.querySelectorAll(".filter-btn");
        allButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });
        clickedButton.classList.add("active");

        const category = clickedButton.getAttribute("data-category");
        renderDeals(category);
    });

    // Handle "Add to Cart" button clicks using event delegation
    const dealsGrid = document.getElementById("dealsGrid");
    dealsGrid.addEventListener("click", function (event) {
        const addButton = event.target.closest(".btn-order");
        if (!addButton) {
            return;
        }

        const dealId = addButton.getAttribute("data-deal-id");
        addToCart(dealId);
    });
});
