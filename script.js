
/* ==========================================
   SHOP NOW
========================================== */

function shopNow() {
    const categories = document.getElementById("categories");

    if (categories) {
        categories.scrollIntoView({ behavior: "smooth" });
    }
}


/* ==========================================
   SEARCH
========================================== */

function searchProducts() {
    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    const searchText = searchInput.value.trim();

    if (searchText === "") {
        alert("Please enter a product to search.");
        return;
    }

    window.location.href =
        "products.html?search=" + encodeURIComponent(searchText);
}


/* ==========================================
   CATEGORY SELECTION
========================================== */

function categorySelected(category) {
    alert("You selected: " + category);
}


/* ==========================================
   SHOPPING CART
========================================== */

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = {};


/* Load products from MySQL */

async function loadProductsFromDatabase() {
    try {
        const response = await fetch(
            "http://localhost:3000/api/products"
        );

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const databaseProducts = await response.json();

        databaseProducts.forEach(product => {
            products[product.name] = {
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image
            };
        });

        console.log("Products loaded:", products);

    } catch (error) {
        console.error("Unable to load products:", error);
    }
}

loadProductsFromDatabase();


/* Add product and selected size to cart */

function addToCart(productName, selectedSize = null) {
    const product = products[productName];

    if (!product) {
        alert("Product not found. Please try again.");
        return;
    }

    if (selectedSize === null || selectedSize === "") {
        alert("Please select a shoe size first.");
        return;
    }

    const existingProduct = cart.find(item =>
        Number(item.id) === Number(product.id) &&
        String(item.size) === String(selectedSize)
    );

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            size: selectedSize,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCounter();

    alert(
        productName + " (Size " + selectedSize +
        ") has been added to your cart."
    );
}


/* ==========================================
   CART COUNTER
========================================== */

function updateCartCounter() {
    const cartCounter = document.querySelector(".cart-count");

    if (cartCounter) {
        const totalQuantity = cart.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        );

        cartCounter.textContent = totalQuantity;
    }
}


/* ==========================================
   INCREASE / DECREASE QUANTITY
========================================== */

window.increaseQuantity = function(productId, size) {
    const item = cart.find(item =>
        Number(item.id) === Number(productId) &&
        (size === undefined ||
         String(item.size) === String(size))
    );

    if (item) {
        item.quantity++;

        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }
};


window.decreaseQuantity = function(productId, size) {
    const item = cart.find(item =>
        Number(item.id) === Number(productId) &&
        (size === undefined ||
         String(item.size) === String(size))
    );

    if (!item) return;

    if (item.quantity > 1) {
        item.quantity--;
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    } else {
        removeItem(productId, size);
    }
};


/* ==========================================
   REMOVE ITEM
========================================== */

function removeItem(productId, size) {
    cart = cart.filter(item =>
        !(
            Number(item.id) === Number(productId) &&
            (size === undefined ||
             String(item.size) === String(size))
        )
    );

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}


/* ==========================================
   DISPLAY CART ITEMS
========================================== */

function displayCart() {
    const cartItems = document.getElementById("cartItems");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';

        const subtotalElement = document.getElementById("cartSubtotal");
        const totalElement = document.getElementById("cartTotal");

        if (subtotalElement) subtotalElement.textContent = "0";
        if (totalElement) totalElement.textContent = "0";

        updateCartCounter();
        return;
    }

    let subtotal = 0;

    cart.forEach(function(item) {
        subtotal += Number(item.price) * Number(item.quantity);

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent =
            "Price: Rs. " + Number(item.price).toLocaleString();

        const sizeText = document.createElement("p");
        sizeText.textContent =
            "Size: " + (item.size || "Not recorded");

        const quantityControls = document.createElement("div");
        quantityControls.className = "cart-quantity";

        const decreaseButton = document.createElement("button");
        decreaseButton.className = "decrease-button";
        decreaseButton.textContent = "−";

        const quantityText = document.createElement("span");
        quantityText.textContent = item.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.className = "increase-button";
        increaseButton.textContent = "+";

        decreaseButton.addEventListener("click", function() {
            decreaseQuantity(item.id, item.size);
        });

        increaseButton.addEventListener("click", function() {
            increaseQuantity(item.id, item.size);
        });

        quantityControls.append(
            decreaseButton,
            quantityText,
            increaseButton
        );

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function() {
            removeItem(item.id, item.size);
        });

        info.append(
            name,
            price,
            sizeText,
            quantityControls,
            removeButton
        );

        cartItem.append(image, info);
        cartItems.appendChild(cartItem);
    });

    const subtotalElement = document.getElementById("cartSubtotal");
    const totalElement = document.getElementById("cartTotal");

    if (subtotalElement) {
        subtotalElement.textContent = subtotal.toLocaleString();
    }

    if (totalElement) {
        totalElement.textContent = subtotal.toLocaleString();
    }

    updateCartCounter();
}


/* ==========================================
   WISHLIST AND PRODUCT HEARTS
========================================== */

document.addEventListener("DOMContentLoaded", function() {
    const wishlist = document.querySelector(".wishlist-icon");

    if (wishlist) {
        wishlist.addEventListener("click", function(event) {
            event.preventDefault();

            const icon = wishlist.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-regular");
                icon.classList.toggle("fa-solid");
            }
        });
    }

    document.querySelectorAll(".product-heart").forEach(function(button) {
        button.addEventListener("click", function() {
            const icon = button.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-regular");
                icon.classList.toggle("fa-solid");
            }
        });
    });

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                searchProducts();
            }
        });
    }
});


/* ==========================================
   NEWSLETTER
========================================== */

function subscribeNewsletter(event) {
    event.preventDefault();

    const emailInput = document.getElementById("emailInput");

    if (!emailInput) return;

    const email = emailInput.value.trim();

    if (email === "") {
        alert("Please enter your email address.");
        return;
    }

    alert("Thank you for subscribing!");
    emailInput.value = "";
}


/* Initialize cart display */

displayCart();
updateCartCounter();
