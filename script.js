// Select DOM elements
const itemList = document.getElementById("item-list");
const newItemInput = document.getElementById("new-item");
const addItemBtn = document.getElementById("add-item-btn");

// Fetch items from server
const fetchItems = async () => {
  try {
    const response = await fetch("http://localhost:3000/items");
    const items = await response.json();
    renderItems(items);
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

// Render items in the DOM
const renderItems = (items) => {
  itemList.innerHTML = ""; // Clear the list
  items.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} 
      <button onclick="deleteItem(${item.id})">Delete</button>
    `;
    itemList.appendChild(li);
  });
};

// Add item to the list
const addItem = async () => {
  const itemName = newItemInput.value.trim();
  if (itemName === "") return; // Prevent adding empty items

  try {
    // Send a POST request to add the new item
    const response = await fetch("http://localhost:3000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: itemName }),
    });

    // Check if the response is okay
    if (!response.ok) {
      throw new Error("Failed to add item");
    }

    // Get the newly added item from the response
    const newItem = await response.json();

    // Directly render the new item to avoid re-fetching the whole list
    const li = document.createElement("li");
    li.innerHTML = `${newItem.name} <button onclick="deleteItem(${newItem.id})">Delete</button>`;
    itemList.appendChild(li);

    // Clear the input field
    newItemInput.value = "";
  } catch (error) {
    console.error("Error adding item:", error);
  }
};

// Delete item
const deleteItem = async (itemId) => {
  try {
    await fetch(`http://localhost:3000/items/${itemId}`, { method: "DELETE" });
    fetchItems(); // Refresh the list after deletion
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

// Event listeners
addItemBtn.addEventListener("click", addItem);
newItemInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addItem();
  }
});

// Initialize
fetchItems();
