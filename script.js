const apiUrl = "http://localhost:3000";

// Function to add an item to the cart
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", async () => {
    const itemName = button.getAttribute("data-item");
    const itemPrice = parseFloat(button.getAttribute("data-price"));

    // Check if the item already exists in the cart
    let response = await fetch(`${apiUrl}/cart`);
    let cartItems = await response.json();
    let existingItem = cartItems.find((item) => item.name === itemName);

    if (existingItem) {
      // Update quantity
      existingItem.quantity += 1;
      await fetch(`${apiUrl}/cart/${existingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(existingItem),
      });
    } else {
      // Add new item
      await fetch(`${apiUrl}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: itemName, price: itemPrice, quantity: 1 }),
      });
    }

    alert(`${itemName} added to cart!`);
    updateCart();
  });
});

// Function to display the cart items
async function updateCart() {
  const response = await fetch(`${apiUrl}/cart`);
  const cartItems = await response.json();

  const cartItemsList = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  cartItemsList.innerHTML = ""; // Clear existing items
  let total = 0;

  cartItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} (x${item.quantity}) - $${(
      item.price * item.quantity
    ).toFixed(2)}`;
    cartItemsList.appendChild(li);
    total += item.price * item.quantity;
  });

  totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Function to handle checkout
async function checkout() {
  const response = await fetch(`${apiUrl}/cart`);
  const cartItems = await response.json();

  if (cartItems.length > 0) {
    await fetch(`${apiUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartItems,
        date: new Date().toISOString(),
      }),
    });

    // Clear the cart
    await Promise.all(
      cartItems.map((item) =>
        fetch(`${apiUrl}/cart/${item.id}`, { method: "DELETE" })
      )
    );

    alert("Checkout complete! Thank you for your order.");
    updateCart();
  } else {
    alert("Your cart is empty.");
  }
}

// Initial cart update on page load
updateCart();
c;
