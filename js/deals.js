// ==========================================================
// The Flavour Lounge - Special Deals Logic
// ==========================================================

// 1. Array of 6 Pakistani restaurant deals with required fields
const deals = [
    {
        id: 1,
        name: "Karachi Chicken Dum Biryani Feast",
        items: "2 Full Chicken Dum Biryani plates, 2 Shami Kababs, Mint Raita, and 2 Chilled Soft Drinks.",
        oldPrice: 1800,
        newPrice: 1350,
        category: "Biryani",
        badge: "Freshly Prepared",
        alt: "Steaming Karachi Chicken Dum Biryani served with Shami Kababs and Mint Raita"
    },
    {
        id: 2,
        name: "Seekh Kabab & Malai Boti Platter",
        items: "4 Charcoal Beef Seekh Kababs, 6 Creamy Chicken Malai Boti pieces, 2 Garlic Naans, and Tamarind Chutney.",
        oldPrice: 2500,
        newPrice: 1750,
        category: "BBQ",
        badge: "Chef's Spotlight",
        alt: "Grilled Seekh Kabab and Chicken Malai Boti BBQ platter with Garlic Naans"
    },
    {
        id: 3,
        name: "Lahori Family Karahi Combo",
        items: "Full Chicken Makhni Karahi, 4 Fresh Roghni Naans, Kachumber Salad, and 1.5L Family Drink.",
        oldPrice: 3600,
        newPrice: 2880,
        category: "Combos",
        badge: "Available",
        alt: "Traditional Lahori Chicken Karahi combo with Roghni Naans and salad"
    },
    {
        id: 4,
        name: "Shahi Mutton Sindhi Biryani Deal",
        items: "Aromatic Mutton Sindhi Biryani cooked with plums and saffron, served with Zeera Raita and Salad.",
        oldPrice: 2200,
        newPrice: 1650,
        category: "Biryani",
        badge: "Available",
        alt: "Shahi Mutton Sindhi Biryani garnished with fried onions and fresh coriander"
    },
    {
        id: 5,
        name: "Charcoal Tikka & Paratha Duo",
        items: "2 Spicy Charcoal Chicken Tikkas (Leg and Chest), 2 Crispy Tandoori Parathas, and Green Chutney.",
        oldPrice: 1500,
        newPrice: 1200,
        category: "BBQ",
        badge: "Freshly Prepared",
        alt: "Charcoal grilled Chicken Tikka pieces served with crispy Tandoori Parathas"
    },
    {
        id: 6,
        name: "Mint Margarita & Kashmiri Chai Pair",
        items: "1 Chilled Fresh Mint Lemonade Pitcher paired with 2 Hot Pistachio Kashmiri Pink Chais.",
        oldPrice: 1200,
        newPrice: 840,
        category: "Drinks",
        badge: "Available",
        alt: "Refreshing Mint Lemonade pitcher alongside cups of Kashmiri Pink Chai"
    }
];

// 2. Calculate discount percentage dynamically from oldPrice and newPrice
function calculateDiscount(oldPrice, newPrice) {
    const savings = oldPrice - newPrice;
    return Math.round((savings / oldPrice) * 100);
}

// 3. Format number as Pakistani Rupees (e.g., Rs. 1,350)
function formatPrice(amount) {
    return "Rs. " + amount.toLocaleString("en-PK");
}

// 4. Generate a lightweight local SVG dish banner so every <img> works offline with zero broken links
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

// 5. Render deal cards into the Bootstrap grid
function renderDeals(selectedCategory) {
    const dealsGrid = document.getElementById("dealsGrid");
    dealsGrid.innerHTML = "";

    // Filter deals by category, or show all if "All" is selected
    const filteredDeals = selectedCategory === "All"
        ? deals
        : deals.filter(function (deal) {
            return deal.category === selectedCategory;
        });

    // Build and insert one Bootstrap column card per deal
    filteredDeals.forEach(function (deal) {
        const discountPercent = calculateDiscount(deal.oldPrice, deal.newPrice);
        const imageSrc = createDishImage(deal.name, deal.category);

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        col.innerHTML = `
            <article class="card deal-card h-100">
                <div class="deal-img-wrapper">
                    <img src="${imageSrc}" class="deal-img" alt="${deal.alt}">
                    <span class="discount-badge">${discountPercent}% OFF</span>
                </div>
                <div class="card-body d-flex flex-column p-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="category-tag">&#9733; ${deal.category}</span>
                        <span class="status-badge">${deal.badge}</span>
                    </div>
                    <h2 class="h5 fw-bold deal-title mb-2">${deal.name}</h2>
                    <p class="deal-items flex-grow-1 mb-3">${deal.items}</p>
                    <div class="d-flex align-items-baseline gap-2 mb-3">
                        <span class="new-price">${formatPrice(deal.newPrice)}</span>
                        <span class="old-price">${formatPrice(deal.oldPrice)}</span>
                    </div>
                    <button type="button" class="btn btn-order w-100" data-deal-id="${deal.id}">
                        Add Deal to Cart
                    </button>
                </div>
            </article>
        `;

        dealsGrid.appendChild(col);
    });
}

// 6. Add selected deal to localStorage cart and update navbar badge
function addDealToCart(dealId) {
    const selectedDeal = deals.find(function (deal) {
        return deal.id === dealId;
    });

    if (!selectedDeal) {
        return;
    }

    // Read existing cart items from localStorage or start with an empty array
    const cart = JSON.parse(localStorage.getItem("flavourLoungeCart")) || [];
    const existingItem = cart.find(function (item) {
        return item.id === "deal-" + selectedDeal.id;
    });

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: "deal-" + selectedDeal.id,
            name: selectedDeal.name,
            price: selectedDeal.newPrice,
            quantity: 1
        });
    }

    localStorage.setItem("flavourLoungeCart", JSON.stringify(cart));
    updateCartBadge();
    showOrderFeedback(selectedDeal.name);
}

// 7. Update the Cart item counter in the navbar
function updateCartBadge() {
    const cartCountElement = document.getElementById("cartCount");
    const cart = JSON.parse(localStorage.getItem("flavourLoungeCart")) || [];
    const totalItems = cart.reduce(function (sum, item) {
        return sum + item.quantity;
    }, 0);

    cartCountElement.textContent = totalItems;
}

// 8. Show Mint Green confirmation banner when a deal is added
function showOrderFeedback(dealName) {
    const feedback = document.getElementById("dealFeedback");
    feedback.textContent = "Order Confirmed: \"" + dealName + "\" added to your cart.";
    feedback.classList.remove("d-none");
}

// 9. Setup event listeners once the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Render all 6 deals initially and sync cart badge
    renderDeals("All");
    updateCartBadge();

    // Handle category filter button clicks
    const filterContainer = document.getElementById("categoryFilters");
    filterContainer.addEventListener("click", function (event) {
        const clickedButton = event.target.closest(".filter-btn");
        if (!clickedButton) {
            return;
        }

        // Update active button styling
        const allButtons = filterContainer.querySelectorAll(".filter-btn");
        allButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });
        clickedButton.classList.add("active");

        // Re-render grid with selected category
        const category = clickedButton.getAttribute("data-category");
        renderDeals(category);
    });

    // Handle "Add Deal to Cart" clicks using event delegation
    const dealsGrid = document.getElementById("dealsGrid");
    dealsGrid.addEventListener("click", function (event) {
        const orderButton = event.target.closest(".btn-order");
        if (!orderButton) {
            return;
        }

        const dealId = Number(orderButton.getAttribute("data-deal-id"));
        addDealToCart(dealId);
    });
});
