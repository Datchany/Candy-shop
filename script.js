const BASE_URL = "https://crudcrud.com/api/992c8f6bf18149a0989007137b5f58ed/candies";
const form = document.getElementById("candyForm");
const list = document.getElementById("candyList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const candy = {
    name: form.name.value,
    description: form.description.value,
    price: parseFloat(form.price.value),
    quantity: parseInt(form.quantity.value)
  };

  try {
    const res = await axios.post(BASE_URL, candy);
    displayCandy(res.data);
    form.reset();
  } catch (err) {
    console.error("Error adding candy:", err);
  }
});

function displayCandy(candy) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${candy.name} - ${candy.description} - ${candy.price}rs - ${candy.quantity}
    <button onclick="buyCandy('${candy._id}', 1)">Buy1</button>
    <button onclick="buyCandy('${candy._id}', 2)">Buy2</button>
    <button onclick="buyCandy('${candy._id}', 3)">Buy3</button>
  `;
  li.id = candy._id;
  list.appendChild(li);
}

async function buyCandy(id, quantityToBuy) {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`);
    const updatedQuantity = res.data.quantity - quantityToBuy;
    if (updatedQuantity < 0) return alert("Not enough stock!");

    const updatedCandy = { ...res.data, quantity: updatedQuantity };
    delete updatedCandy._id; // Remove _id before PUT

    await axios.put(`${BASE_URL}/${id}`, updatedCandy);
    document.getElementById(id).remove(); // remove old
    displayCandy({ ...res.data, quantity: updatedQuantity }); // show updated
  } catch (err) {
    console.error("Error updating candy:", err);
  }
}

// On page load
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await axios.get(BASE_URL);
    res.data.forEach(displayCandy);
  } catch (err) {
    console.error("Error loading candies:", err);
  }
});
