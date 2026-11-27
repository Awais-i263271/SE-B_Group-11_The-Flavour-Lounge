// ==========================================================
// The Flavour Lounge - Customer Reviews & Submission Logic
// ==========================================================

// localStorage key where user-submitted reviews are stored
const REVIEWS_STORAGE_KEY = "flavourLoungeReviews";
const MAX_PHOTO_BYTES = 500 * 1024; // 500 KB limit

// Current filter, sort, and form state
let activeFilter = "all";
let activeSort = "newest";
let selectedRating = 0;
let uploadedPhotoDataUrl = null;
let hasValidPhoto = true;

// 6 realistic seed reviews (image can be a path or null for placeholder)
const seedReviews = [
    {
        id: "rev-1",
        name: "Ayesha Khan",
        rating: 5,
        text: "The Karachi Chicken Dum Biryani had fragrant long-grain basmati rice and tender spiced chicken. Arrived piping hot with fresh mint raita.",
        dish: "Karachi Chicken Dum Biryani",
        date: "2026-11-22",
        image: null
    },
    {
        id: "rev-2",
        name: "Bilal Ahmed",
        rating: 5,
        text: "Loved the smoky charcoal aroma on the Seekh Kabab & Malai Boti platter. The garlic naan stayed soft even after delivery.",
        dish: "Seekh Kabab & Malai Boti Platter",
        date: "2026-11-18",
        image: null
    },
    {
        id: "rev-3",
        name: "Fatima Noor",
        rating: 4,
        text: "Rich buttery gravy on the Lahori Chicken Makhni Karahi. Portion was generous enough for our whole family dinner.",
        dish: "Lahori Chicken Makhni Karahi",
        date: "2026-11-14",
        image: null
    },
    {
        id: "rev-4",
        name: "Hamza Tariq",
        rating: 5,
        text: "Best Shahi Mutton Sindhi Biryani in town! Perfect balance of dried plums, saffron, and spice without being overly oily.",
        dish: "Shahi Mutton Sindhi Biryani",
        date: "2026-11-09",
        image: null
    },
    {
        id: "rev-5",
        name: "Sana Malik",
        rating: 4,
        text: "The Mint Margarita was super refreshing and the Kashmiri Pink Chai had a lovely pistachio garnish. Will definitely order again.",
        dish: "Mint Margarita & Kashmiri Chai",
        date: "2026-11-03",
        image: null
    },
    {
        id: "rev-6",
        name: "Usman Raza",
        rating: 3,
        text: "Charcoal Chicken Tikka tasted authentic and well-charred, though delivery took about 15 minutes longer than expected on Friday night.",
        dish: "Charcoal Chicken Tikka & Paratha",
        date: "2026-10-27",
        image: null
    }
];

// Generate a lightweight SVG placeholder image for a dish when review.image is null or missing
function createDishPlaceholder(dishName) {
    const safeDish = String(dishName || "Signature Dish").replace(/&/g, "and");
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="320" viewBox="0 0 600 320">
            <rect width="600" height="320" fill="#800000"/>
            <circle cx="300" cy="135" r="70" fill="#FFF8E7" stroke="#FF6B00" stroke-width="4"/>
            <text x="300" y="132" text-anchor="middle" fill="#800000" font-family="Georgia, serif" font-size="18" font-weight="bold">GUEST REVIEW</text>
            <text x="300" y="156" text-anchor="middle" fill="#FF6B00" font-family="Poppins, sans-serif" font-size="12" font-weight="bold">The Flavour Lounge</text>
            <text x="300" y="268" text-anchor="middle" fill="#FFF8E7" font-family="Georgia, serif" font-size="18" font-weight="bold">${safeDish}</text>
        </svg>
    `;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

// Safely read user-submitted reviews from localStorage using try/catch
function getStoredReviews() {
    try {
        const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

// Save a new user review to localStorage key "flavourLoungeReviews"
// Wrapped in try/catch so a full or unavailable localStorage doesn't crash the page
function saveUserReview(newReview) {
    try {
        const existing = getStoredReviews();
        existing.unshift(newReview);
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(existing));
    } catch (err) {
        // localStorage quota exceeded or unavailable — review is shown in the session but not persisted
        console.warn("Could not save review to localStorage:", err);
    }
}

// Merge stored user reviews with seed reviews and sort newest first by default
function getAllReviews() {
    const userReviews = getStoredReviews();
    const merged = userReviews.concat(seedReviews);

    return merged.slice().sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });
}

// Format a date string into "Nov 22, 2026"
function formatDate(dateString) {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
        return String(dateString || "");
    }
    return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

// Escape HTML special characters for safe rendering
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Build gold star icons HTML for a rating from 0 to 5
function renderStarsHtml(rating) {
    const clamped = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    let starsHtml = "";

    for (let i = 1; i <= 5; i++) {
        if (i <= clamped) {
            starsHtml += '<i class="bi bi-star-fill text-warning me-1" aria-hidden="true"></i>';
        } else {
            starsHtml += '<i class="bi bi-star text-warning me-1" aria-hidden="true"></i>';
        }
    }

    return starsHtml;
}

// Update the average rating and total review count summary at the top
function updateSummaryStats(allReviews) {
    const avgValueEl = document.getElementById("avgRatingValue");
    const avgStarsEl = document.getElementById("avgRatingStars");
    const totalCountEl = document.getElementById("totalReviewsCount");

    const total = allReviews.length;
    if (total === 0) {
        avgValueEl.textContent = "0.0";
        avgStarsEl.innerHTML = renderStarsHtml(0);
        totalCountEl.textContent = "0 Reviews";
        return;
    }

    const sumRatings = allReviews.reduce(function (sum, review) {
        return sum + (Number(review.rating) || 0);
    }, 0);

    const average = (sumRatings / total).toFixed(1);
    avgValueEl.textContent = average;
    avgStarsEl.innerHTML = renderStarsHtml(Math.round(Number(average)));
    totalCountEl.textContent = total + (total === 1 ? " Review" : " Reviews");
}

// Filter reviews by rating category and sort by selected option
function getFilteredAndSortedReviews(allReviews) {
    const filtered = allReviews.filter(function (review) {
        const rating = Number(review.rating) || 0;

        if (activeFilter === "5") {
            return rating === 5;
        }
        if (activeFilter === "4") {
            return rating === 4;
        }
        if (activeFilter === "3-below") {
            return rating <= 3;
        }
        return true;
    });

    return filtered.slice().sort(function (a, b) {
        if (activeSort === "highest") {
            const ratingDiff = (Number(b.rating) || 0) - (Number(a.rating) || 0);
            if (ratingDiff !== 0) {
                return ratingDiff;
            }
        }
        return new Date(b.date) - new Date(a.date);
    });
}

// Render review cards into the Bootstrap grid
function renderReviews() {
    const reviewsGrid = document.getElementById("reviewsGrid");
    const allReviews = getAllReviews();

    updateSummaryStats(allReviews);

    const visibleReviews = getFilteredAndSortedReviews(allReviews);
    reviewsGrid.innerHTML = "";

    if (visibleReviews.length === 0) {
        reviewsGrid.innerHTML = `
            <div class="col-12 text-center">
                <p class="empty-reviews-msg mb-0">No reviews match this filter yet.</p>
            </div>
        `;
        return;
    }

    visibleReviews.forEach(function (review) {
        const safeName = escapeHtml(review.name || "Guest");
        const safeDish = escapeHtml(review.dish || "Signature Dish");
        const safeText = escapeHtml(review.text || "");
        const ratingValue = Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5)));
        const formattedDate = formatDate(review.date);
        const placeholderSrc = createDishPlaceholder(review.dish);
        const imageSrc = review.image ? escapeHtml(review.image) : placeholderSrc;
        const altText = "Photo of " + safeDish + " reviewed by " + safeName;

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        col.innerHTML = `
            <article class="card review-card h-100">
                <div class="review-img-wrapper">
                    <img
                        src="${imageSrc}"
                        class="review-img"
                        alt="${altText}"
                        onerror="this.onerror=null; this.src='${placeholderSrc}';"
                    >
                </div>
                <div class="card-body d-flex flex-column p-4">
                    <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <div>
                            <h2 class="h5 reviewer-name mb-0">${safeName}</h2>
                            <span class="review-date">${formattedDate}</span>
                        </div>
                        <div aria-label="Rated ${ratingValue} out of 5 stars">
                            ${renderStarsHtml(ratingValue)}
                        </div>
                    </div>

                    <p class="review-text flex-grow-1 my-3">${safeText}</p>

                    <div>
                        <span class="dish-badge">
                            <i class="bi bi-award text-orange" aria-hidden="true"></i>
                            ${safeDish}
                        </span>
                    </div>
                </div>
            </article>
        `;

        reviewsGrid.appendChild(col);
    });
}

// ==========================================================
// Interactive Star Rating & Form Validation Helpers
// ==========================================================

// Paint star buttons up to displayValue (used for both selection and hover preview)
function updateStarDisplay(displayValue) {
    const starButtons = document.querySelectorAll("#starRatingInput .star-btn");
    const ratingText = document.getElementById("ratingSelectedText");

    starButtons.forEach(function (btn) {
        const btnValue = Number(btn.getAttribute("data-value"));
        const icon = btn.querySelector("i");
        const isFilled = btnValue <= displayValue;

        icon.className = isFilled ? "bi bi-star-fill text-warning" : "bi bi-star text-warning";

        const isChecked = btnValue === selectedRating;
        btn.setAttribute("aria-checked", isChecked ? "true" : "false");
        btn.setAttribute("tabindex", (isChecked || (selectedRating === 0 && btnValue === 1)) ? "0" : "-1");
    });

    if (selectedRating > 0) {
        ratingText.textContent = selectedRating + (selectedRating === 1 ? " / 5 star" : " / 5 stars");
    } else {
        ratingText.textContent = "Select 1 to 5 stars";
    }
}

// Select a star rating (1-5) and validate immediately
function selectRating(value) {
    selectedRating = Math.max(1, Math.min(5, Number(value)));
    updateStarDisplay(selectedRating);
    validateRating();
}

// Show or clear an error message under a field
function setFieldError(errorId, inputEl, message) {
    const errorEl = document.getElementById(errorId);
    errorEl.textContent = message;

    if (inputEl) {
        if (message) {
            inputEl.classList.add("is-invalid");
        } else {
            inputEl.classList.remove("is-invalid");
        }
    }
}

function validateRating() {
    if (selectedRating < 1 || selectedRating > 5) {
        setFieldError("ratingError", null, "Please select a star rating between 1 and 5.");
        return false;
    }
    setFieldError("ratingError", null, "");
    return true;
}

function validateName() {
    const nameInput = document.getElementById("reviewerName");
    const value = nameInput.value.trim();

    if (!value) {
        setFieldError("nameError", nameInput, "Your name is required.");
        return false;
    }
    if (value.length < 2 || value.length > 40) {
        setFieldError("nameError", nameInput, "Name must be between 2 and 40 characters.");
        return false;
    }
    if (!/^[A-Za-z ]+$/.test(value)) {
        setFieldError("nameError", nameInput, "Name can contain only letters and spaces.");
        return false;
    }

    setFieldError("nameError", nameInput, "");
    return true;
}

function validateDish() {
    const dishSelect = document.getElementById("reviewDish");
    if (!dishSelect.value) {
        setFieldError("dishError", dishSelect, "Please select a dish.");
        return false;
    }
    setFieldError("dishError", dishSelect, "");
    return true;
}

function validateReviewText() {
    const textInput = document.getElementById("reviewText");
    const value = textInput.value.trim();

    if (!value) {
        setFieldError("reviewTextError", textInput, "Please write your review.");
        return false;
    }
    if (value.length < 10 || value.length > 300) {
        setFieldError("reviewTextError", textInput, "Review must be between 10 and 300 characters.");
        return false;
    }

    setFieldError("reviewTextError", textInput, "");
    return true;
}

// Clear uploaded photo state and thumbnail preview
function clearUploadedPhoto() {
    const photoInput = document.getElementById("reviewPhoto");
    const previewWrapper = document.getElementById("photoPreviewWrapper");
    const previewImg = document.getElementById("photoPreview");

    photoInput.value = "";
    uploadedPhotoDataUrl = null;
    hasValidPhoto = true;
    previewImg.src = "";
    previewWrapper.classList.add("d-none");
    setFieldError("photoError", photoInput, "");
}

// Validate optional photo upload (image type + max 500 KB) and load thumbnail preview
function handlePhotoChange() {
    const photoInput = document.getElementById("reviewPhoto");
    const previewWrapper = document.getElementById("photoPreviewWrapper");
    const previewImg = document.getElementById("photoPreview");
    const file = photoInput.files[0];

    if (!file) {
        clearUploadedPhoto();
        return;
    }

    if (!file.type || !file.type.startsWith("image/")) {
        uploadedPhotoDataUrl = null;
        hasValidPhoto = false;
        previewImg.src = "";
        previewWrapper.classList.add("d-none");
        setFieldError("photoError", photoInput, "Only image files (JPG, PNG, WEBP, etc.) are allowed.");
        return;
    }

    if (file.size > MAX_PHOTO_BYTES) {
        uploadedPhotoDataUrl = null;
        hasValidPhoto = false;
        previewImg.src = "";
        previewWrapper.classList.add("d-none");
        setFieldError("photoError", photoInput, "Image size must not exceed 500 KB.");
        return;
    }

    hasValidPhoto = true;
    setFieldError("photoError", photoInput, "");

    const reader = new FileReader();
    reader.onload = function (event) {
        uploadedPhotoDataUrl = event.target.result;
        previewImg.src = uploadedPhotoDataUrl;
        previewWrapper.classList.remove("d-none");
    };
    reader.readAsDataURL(file);
}

// Update the live character counter for the review textarea
function updateCharCounter() {
    const textInput = document.getElementById("reviewText");
    const counterEl = document.getElementById("reviewCharCounter");
    counterEl.textContent = textInput.value.length + " / 300 characters";
}

// Show Bootstrap success toast "Thank you for your review!"
function showReviewSuccessToast() {
    const toastElement = document.getElementById("reviewToast");
    if (!toastElement || typeof bootstrap === "undefined") {
        return;
    }
    const toastInstance = bootstrap.Toast.getOrCreateInstance(toastElement, {
        delay: 2800
    });
    toastInstance.show();
}

// Handle valid form submission
function handleReviewSubmit(event) {
    event.preventDefault();

    const isRatingValid = validateRating();
    const isNameValid = validateName();
    const isDishValid = validateDish();
    const isTextValid = validateReviewText();

    if (!isRatingValid || !isNameValid || !isDishValid || !isTextValid || !hasValidPhoto) {
        return;
    }

    const submitBtn = document.getElementById("submitReviewBtn");
    // Prevent double submissions with a short disabled state
    submitBtn.disabled = true;

    const nameInput = document.getElementById("reviewerName");
    const dishSelect = document.getElementById("reviewDish");
    const textInput = document.getElementById("reviewText");

    const newReview = {
        id: "rev-" + Date.now(),
        name: nameInput.value.trim(),
        rating: selectedRating,
        text: textInput.value.trim(),
        dish: dishSelect.value,
        date: new Date().toISOString(),
        image: uploadedPhotoDataUrl || null
    };

    saveUserReview(newReview);
    renderReviews();

    // Reset form fields, star rating, counter, and photo preview
    document.getElementById("reviewForm").reset();
    selectedRating = 0;
    updateStarDisplay(0);
    updateCharCounter();
    clearUploadedPhoto();
    showReviewSuccessToast();

    setTimeout(function () {
        submitBtn.disabled = false;
    }, 800);
}

// Initialize page and attach all event listeners
document.addEventListener("DOMContentLoaded", function () {
    renderReviews();
    updateStarDisplay(0);
    updateCharCounter();

    if (typeof FlavourCart !== "undefined") {
        FlavourCart.updateCartBadge();
    }

    // Star rating mouse & keyboard listeners
    const starContainer = document.getElementById("starRatingInput");
    const starButtons = starContainer.querySelectorAll(".star-btn");

    starButtons.forEach(function (btn) {
        const value = Number(btn.getAttribute("data-value"));

        btn.addEventListener("click", function () {
            selectRating(value);
        });

        btn.addEventListener("mouseenter", function () {
            updateStarDisplay(value);
        });

        btn.addEventListener("keydown", function (event) {
            if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                event.preventDefault();
                const next = Math.min(5, (selectedRating || value) + 1);
                selectRating(next);
                starButtons[next - 1].focus();
            } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                event.preventDefault();
                const prev = Math.max(1, (selectedRating || value) - 1);
                selectRating(prev);
                starButtons[prev - 1].focus();
            } else if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectRating(value);
            }
        });
    });

    starContainer.addEventListener("mouseleave", function () {
        updateStarDisplay(selectedRating);
    });

    starContainer.addEventListener("focusout", function (event) {
        if (!starContainer.contains(event.relatedTarget)) {
            validateRating();
        }
    });

    // Live validation on blur (and clear errors as user fixes inputs)
    const nameInput = document.getElementById("reviewerName");
    const dishSelect = document.getElementById("reviewDish");
    const textInput = document.getElementById("reviewText");
    const photoInput = document.getElementById("reviewPhoto");
    const removePhotoBtn = document.getElementById("removePhotoBtn");

    nameInput.addEventListener("blur", validateName);
    nameInput.addEventListener("input", function () {
        if (nameInput.classList.contains("is-invalid")) {
            validateName();
        }
    });

    dishSelect.addEventListener("blur", validateDish);
    dishSelect.addEventListener("change", validateDish);

    textInput.addEventListener("blur", validateReviewText);
    textInput.addEventListener("input", function () {
        updateCharCounter();
        if (textInput.classList.contains("is-invalid")) {
            validateReviewText();
        }
    });

    photoInput.addEventListener("change", handlePhotoChange);
    photoInput.addEventListener("blur", function () {
        if (!hasValidPhoto) {
            setFieldError("photoError", photoInput, document.getElementById("photoError").textContent);
        }
    });
    removePhotoBtn.addEventListener("click", clearUploadedPhoto);

    // Form submission listener
    document.getElementById("reviewForm").addEventListener("submit", handleReviewSubmit);

    // Filter and sort listeners
    const filterContainer = document.getElementById("ratingFilters");
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

        activeFilter = clickedButton.getAttribute("data-filter");
        renderReviews();
    });

    const sortSelect = document.getElementById("sortReviews");
    sortSelect.addEventListener("change", function () {
        activeSort = sortSelect.value;
        renderReviews();
    });
});
