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
// ADD TO CART
// ==========================================

let cartCount = 0;


function addToCart(productName) {

    cartCount++;

    const cartCounter =
        document.querySelector(".cart-count");

    if (cartCounter) {

        cartCounter.textContent = cartCount;

    }

    alert(
        productName +
        " has been added to your cart."
    );

}



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