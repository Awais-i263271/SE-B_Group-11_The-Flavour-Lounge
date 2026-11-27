// ==========================================================
// The Flavour Lounge - Special Deals Logic
// Uses the shared window.FlavourCart helper from js/cart.js
// ==========================================================

// Fallback placeholder used by onerror when a deal image fails to load.
// Points to the first deal image; swap for a dedicated placeholder if one exists.
const DEAL_IMG_PLACEHOLDER = "../images/deals/karachi-biryani-feast.jpg";

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
        image: "../images/deals/karachi-biryani-feast.jpg",
        imgWidth: 600,
        imgHeight: 320,
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
        image: "../images/deals/seekh-kabab-malai-boti.jpg",
        imgWidth: 600,
        imgHeight: 320,
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
        image: "../images/deals/lahori-karahi-combo.jpg",
        imgWidth: 600,
        imgHeight: 320,
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
        image: "../images/deals/mutton-sindhi-biryani.jpg",
        imgWidth: 600,
        imgHeight: 320,
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
        image: "../images/deals/tikka-paratha-duo.jpg",
        imgWidth: 600,
        imgHeight: 320,
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
        image: "../images/deals/mint-margarita-kashmiri-chai.jpg",
        imgWidth: 600,
        imgHeight: 320,
        alt: "Refreshing Mint Lemonade pitcher alongside cups of Kashmiri Pink Chai"
    }
];

// Calculate discount percentage dynamically from oldPrice and newPrice
function calculateDiscount(oldPrice, newPrice) {
    const savings = oldPrice - newPrice;
    return Math.round((savings / oldPrice) * 100);
}

// Format money consistently as "Rs. 1,234"
function formatPrice(amount) {
    const rounded = Math.round(Number(amount) || 0);
    return "Rs. " + rounded.toLocaleString("en-US");
}

// Show Bootstrap toast message "Added to cart"
function showAddedToCartToast() {
    const toastElement = document.getElementById("cartToast");
    if (!toastElement || typeof bootstrap === "undefined") {
        return;
    }
    const toastInstance = bootstrap.Toast.getOrCreateInstance(toastElement, {
        delay: 2200
    });
    toastInstance.show();
}

// Add a deal to the shared "flavourLoungeCart" using FlavourCart.addItem()
function addDealToCart(dealId) {
    const selectedDeal = deals.find(function (deal) {
        return deal.id === dealId;
    });

    if (!selectedDeal) {
        return;
    }

    // Guard: only call FlavourCart if it loaded successfully
    if (typeof FlavourCart === "undefined") {
        console.warn("FlavourCart helper not available — cart.js may have failed to load.");
        return;
    }

    // Shared item shape: { id, name, price, quantity, image }
    FlavourCart.addItem({
        id: selectedDeal.id,
        name: selectedDeal.name,
        price: selectedDeal.newPrice,
        quantity: 1,
        image: selectedDeal.image
    });

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

    if (filteredDeals.length === 0) {
        dealsGrid.innerHTML = `
            <div class="col-12 text-center">
                <p class="empty-deals-msg mb-0">No deals found in this category.</p>
            </div>
        `;
        return;
    }

    filteredDeals.forEach(function (deal) {
        const discountPercent = calculateDiscount(deal.oldPrice, deal.newPrice);

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        col.innerHTML = `
            <article class="card deal-card h-100">
                <div class="deal-img-wrapper">
                    <img
                        src="${deal.image}"
                        class="deal-img"
                        alt="${deal.alt}"
                        width="${deal.imgWidth}"
                        height="${deal.imgHeight}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='${DEAL_IMG_PLACEHOLDER}';"
                    >
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
                    <button type="button" class="btn btn-flavour-primary w-100 btn-add-deal" data-deal-id="${deal.id}">
                        Add to Cart
                    </button>
                </div>
            </article>
        `;

        dealsGrid.appendChild(col);
    });
}

// Initialize page once DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    renderDeals("All");

    // Guard: sync cart badge only if the shared helper loaded
    if (typeof FlavourCart !== "undefined") {
        FlavourCart.updateCartBadge();
    }

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

    const dealsGrid = document.getElementById("dealsGrid");
    dealsGrid.addEventListener("click", function (event) {
        const addButton = event.target.closest(".btn-add-deal");
        if (!addButton) {
            return;
        }

        const dealId = addButton.getAttribute("data-deal-id");
        addDealToCart(dealId);
    });
});
