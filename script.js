// ==============================
// SHOP NOW BUTTON
// ==============================

function shopNow() {
    alert("Welcome to Sneaker Store!");
}


// ==============================
// SEARCH
// ==============================

function searchProducts() {

    const searchText = document.getElementById("searchInput").value;

    if (searchText.trim() === "") {
        alert("Please enter a product to search.");
    } else {
        alert("Searching for: " + searchText);
    }

}


// ==============================
// CATEGORY SELECTION
// ==============================

function categorySelected(category) {

    alert("You selected: " + category);

}


// ==============================
// ADD TO CART
// ==============================

function addToCart(productName) {

    alert(productName + " has been added to your cart.");

}


// ==============================
// WISHLIST
// ==============================

const wishlistButtons = document.querySelectorAll(".wishlist-icon");

wishlistButtons.forEach(function(button) {

    button.addEventListener("click", function(event) {

        event.preventDefault();

        if (button.textContent.trim() === "♡") {
            button.textContent = "♥";
        } else {
            button.textContent = "♡";
        }

    });

});