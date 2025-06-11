const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItems = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const spanItem = document.getElementById("date-span")

let cart = [];

function addToCart(name, price) {
    const itemExist = cart.find(item => item.name === name)

    if (itemExist) {
        itemExist.quantity += 1;
    } else {
        cart.push({
        name,
        price,
        quantity: 1,
        })
    }

    updateCart();
}

function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "flex-col", "mb-4")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between border-2 border-gray-200 rounded p-2">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                    <button class="remove-cart-btn hover:font-medium hover:text-red-600" data-name="${item.name}">Remover</button>
            </div>
        `

        total += item.price * item.quantity;

        cartItems.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

function removeItem(name) {
    const i = cart.findIndex(item => item.name === name);

    if (i !== -1) {
        const item = cart[i];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCart();
            return;
        }

        cart.splice(i, 1);
        updateCart();
    }
}

function isRestaurantOpen() {
    const date = new Date();
    const hour = date.getHours();
    const day = date.getDay();

    return hour >= 18 && hour <= 22 && day != 1;
}


cartBtn.addEventListener("click", function() {
    updateCart();
    cartModal.style.display = "flex";
})

cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
})

menu.addEventListener("click", function(event) {
    let parentBtn = event.target.closest(".add-cart-btn");
    
    if (parentBtn) {
        const name = parentBtn.getAttribute("data-name");
        const price = parseFloat(parentBtn.getAttribute("data-price"));

        addToCart(name, price);
    }
})

cartItems.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-cart-btn")) {
        const name = event.target.getAttribute("data-name");

        removeItem(name);
    }
})

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-600");
        addressWarn.classList.add("hidden");
    }
})

checkoutBtn.addEventListener("click", function() {
    const isOpen = isRestaurantOpen();

    if (!isOpen) {
        Toastify({
            text: "Lamentamos, o restaurante está fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #8E0E00, #000000)",
            },
        }).showToast();

        return;
    }
    
    if (cart.length === 0) {
        return;
    }

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-600");
        return;
    }

    const cartItems = cart.map((item) => {
        return (
            `Item: ${item.name} Quantidade: ${item.quantity} Preço: R$${item.price} | `
        )
    }).join("");

    const message = encodeURIComponent(cartItems);
    const phone = "19993125285";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    cart = [];
    updateCart();
})

const isOpen = isRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-600");
    spanItem.classList.add("bg-green-500");
} else {
    spanItem.classList.remove("bg-green-500");
    spanItem.classList.add("bg-red-600");
}