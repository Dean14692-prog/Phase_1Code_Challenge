// Select the DOM elements
const itemList = document.getElementById("item-list");
const newItemInput = document.getElementById("new-item");
const addItemBtn = document.getElementById("add-item-btn");

// Fetch items from the server (using async/await)
async function fetchItems() {
  try {
    const response = await fetch("http://localhost:3000/items");
    const items = await response.json();
    renderItems(items); // Render the items once fetched
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

// Render the items in the DOM
function renderItems(items) {
  itemList.innerHTML = ""; // Clear the list before adding new items
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.name; // Add the item name to the li

    // Create a delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteItem(item.id); // Set the delete item function on click

    li.appendChild(deleteBtn); // Add the button to the list item
    itemList.appendChild(li); // Add the list item to the item list
  });
}

// Add a new item to the list (using async/await)
async function addItem() {
  const itemName = newItemInput.value.trim(); // Get the value from the input
  if (itemName === "") return; 

  const newItem = { name: itemName }; // Create the new item object

  try {
    // Send a POST request to add the new item to the server
    const response = await fetch("http://localhost:3000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(newItem), // Send the new item as JSON
    });

    if (!response.ok) {
      throw new Error("Failed to add item");
    }

    const addedItem = await response.json(); // Get the newly added item from the server

    // Add the new item to the DOM directly
    const li = document.createElement("li");
    li.textContent = addedItem.name; // Add the item name

    // Create a delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteItem(addedItem.id); // Set delete functionality

    li.appendChild(deleteBtn); // Append the delete button to the list item
    itemList.appendChild(li); // Append the item to the list

    // Clear the input field after adding the item
    newItemInput.value = "";
  } catch (error) {
    console.error("Error adding item:", error);
  }
}

// Delete an item (using async/await)
async function deleteItem(itemId) {
  try {
    // Send a DELETE request to remove the item from the server
    await fetch(`http://localhost:3000/items/${itemId}`, {
      method: "DELETE",
    });

    // After deleting the item, re-fetch and render the list
    fetchItems();
  } catch (error) {
    console.error("Error deleting item:", error);
  }
}

// Add event listeners to handle user actions
addItemBtn.addEventListener("click", addItem);
newItemInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addItem();
  }
});

// Fetch and display items when the page loads
fetchItems();
