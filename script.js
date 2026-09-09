// ==========================================
// SHOP NOW
// ==========================================

function shopNow() {

    const categories = document.getElementById("categories");

    if (categories) {
        categories.scrollIntoView({
            behavior: "smooth"
        });
    }

}



// ==========================================
// SEARCH
// ==========================================

function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    const searchText =
        searchInput.value.trim();

    if (searchText === "") {

        alert("Please enter a product to search.");

        return;
    }

    alert("Searching for: " + searchText);

}



// ==========================================
// CATEGORY SELECTION
// ==========================================

function categorySelected(category) {

    event.preventDefault();

    alert("You selected: " + category);

}



// ==========================================
// SHOPPING CART
// ==========================================

// Get existing cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// Product information
const products = {
    "Nike Air Max 270": {
        id: 1,
        name: "Nike Air Max 270",
        price: 32500,
        image: "images/pic1.webp"
    },

    "Adidas Ultraboost 22": {
        id: 2,
        name: "Adidas Ultraboost 22",
        price: 38000,
        image: "images/pic2.jpg"
    },

    "Puma RS-X": {
        id: 3,
        name: "Puma RS-X",
        price: 27500,
        image: "images/pic3.jpg"
    },

    "New Balance 550": {
        id: 4,
        name: "New Balance 550",
        price: 29500,
        image: "images/pic4.jpg"
    },

    "Nike Air Force 1": {
        id: 5,
        name: "Nike Air Force 1",
        price: 30000,
        image: "images/pic5.jpg"
    }
};


// Add product to cart
function addToCart(productName) {

    const product = products[productName];

    if (!product) {
        alert("Product not found.");
        return;
    }


    // Check whether product already exists
    const existingProduct =
        cart.find(item => item.id === product.id);


    if (existingProduct) {

        // Product already exists → increase quantity
        existingProduct.quantity++;

    } else {

        // New product → add with quantity 1
        cart.push({
            ...product,
            quantity: 1
        });

    }


    // Save cart
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    // Update cart counter
    updateCartCounter();


    alert(
        productName +
        " has been added to your cart."
    );
}


// Update cart badge
function updateCartCounter() {

    const cartCounter =
        document.querySelector(".cart-count");


    if (cartCounter) {

        const totalQuantity =
            cart.reduce(
                (total, item) => total + item.quantity,
                0
            );

        cartCounter.textContent = totalQuantity;
    }
}


// ==========================================
// DISPLAY CART ITEMS
// ==========================================

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");

    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';

        document.getElementById("cartSubtotal").textContent = "0";
        document.getElementById("cartTotal").textContent = "0";

        updateCartCounter();

        return;
    }

    let subtotal = 0;


    cart.forEach(function (item) {

        subtotal += item.price * item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>Price: Rs. ${item.price}</p>


                <div class="cart-quantity">

    <button class="decrease-button" data-id="${item.id}">
        −
    </button>

    <span>${item.quantity}</span>

    <button class="increase-button" data-id="${item.id}">
        +
    </button>

</div>


                <button
                    class="remove-button"
                    onclick="removeItem(${item.id})">
                    Remove
                </button>

            </div>

        `;



        cartItems.appendChild(cartItem);

const decreaseButton = cartItem.querySelector(".decrease-button");
const increaseButton = cartItem.querySelector(".increase-button");

decreaseButton.addEventListener("click", function () {
    decreaseQuantity(item.id);
});

increaseButton.addEventListener("click", function () {
    increaseQuantity(item.id);
});

    
    });

    // Update subtotal
    document.getElementById("cartSubtotal").textContent =
        subtotal;


    // Update total
    document.getElementById("cartTotal").textContent =
        subtotal;


    // Update cart badge
    updateCartCounter();

}

// ==========================================
// INCREASE / DECREASE QUANTITY
// ==========================================



window.increaseQuantity = function(productId) {

    const item = cart.find(function(item) {
        return Number(item.id) === Number(productId);
    });

    if (item) {
        item.quantity = item.quantity + 1;

        localStorage.setItem("cart", JSON.stringify(cart));

        displayCart();
    }
};


window.decreaseQuantity = function(productId) {

    const item = cart.find(function(item) {
        return Number(item.id) === Number(productId);
    });

    if (!item) {
        return;
    }

    if (item.quantity > 1) {

        item.quantity = item.quantity - 1;

        localStorage.setItem("cart", JSON.stringify(cart));

        displayCart();

    } else {

        removeItem(productId);
    }
};

// ==========================================
// REMOVE ITEM
// ==========================================

function removeItem(productId) {

    cart =
        cart.filter(item => item.id !== productId);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


// Display cart when page loads
displayCart();
updateCartCounter();

// ==========================================
// NAVIGATION WISHLIST
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const wishlist =
            document.querySelector(".wishlist-icon");

        if (wishlist) {

            wishlist.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const icon =
                        wishlist.querySelector("i");

                    icon.classList.toggle(
                        "fa-regular"
                    );

                    icon.classList.toggle(
                        "fa-solid"
                    );

                }
            );

        }


        // ==================================
        // PRODUCT HEART BUTTONS
        // ==================================

        const productHearts =
            document.querySelectorAll(
                ".product-heart"
            );


        productHearts.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const icon =
                            button.querySelector("i");

                        icon.classList.toggle(
                            "fa-regular"
                        );

                        icon.classList.toggle(
                            "fa-solid"
                        );

                    }
                );

            }
        );

    }
);



// ==========================================
// NEWSLETTER
// ==========================================

function subscribeNewsletter(event) {

    event.preventDefault();

    const email =
        document.getElementById(
            "emailInput"
        ).value.trim();


    if (email === "") {

        alert(
            "Please enter your email address."
        );

        return;
    }


    alert(
        "Thank you for subscribing!"
    );


    document.getElementById(
        "emailInput"
    ).value = "";

}