function formatCurrency(num) {
  return Number(num).toLocaleString("vi-VN") + " VNĐ";
}

function updateTotals() {
  let subtotal = 0;
  document.querySelectorAll(".product-item").forEach(item => {
    const price = parseFloat(item.dataset.price);
    const quantity = parseInt(item.querySelector(".quantity-input").value);
    const itemTotal = price * quantity;
    item.querySelector(".item-total").textContent = formatCurrency(itemTotal);
    subtotal += itemTotal;
  });

  const tax = Math.round(subtotal * 0.135);
  const total = subtotal + tax;

  document.getElementById("subtotal").textContent = formatCurrency(subtotal);
  document.getElementById("tax").textContent = formatCurrency(tax);
  document.getElementById("total").textContent = formatCurrency(total);
}

function attachCartEventListeners() {
  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector(".quantity-input");
      input.value = parseInt(input.value) + 1;
      updateTotals();
    });
  });

  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector(".quantity-input");
      const newVal = Math.max(1, parseInt(input.value) - 1);
      input.value = newVal;
      updateTotals();
    });
  });

  document.querySelectorAll(".quantity-input").forEach(input => {
    input.addEventListener("input", () => {
      if (parseInt(input.value) < 1 || isNaN(parseInt(input.value))) {
        input.value = 1;
      }
      updateTotals();
    });
  });

  document.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".product-item").remove();
      updateTotals();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Hiển thị sản phẩm từ giỏ hàng
  const cart = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const productList = document.getElementById("product-list");

  if (productList) {
    if (cart.length === 0) {
      productList.innerHTML = `<p class="text-gray-500 text-sm">Không có sản phẩm nào trong giỏ hàng.</p>`;
    } else {
      productList.innerHTML = "";
      cart.forEach(item => {
        const itemHTML = `
          <div class="product-item flex items-start gap-3 pb-3 border-b border-gray-200" data-price="${item.price}">
            <div class="w-16 h-20 bg-gray-100 flex-shrink-0">
              <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
            </div>
            <div class="flex-grow">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium">${item.title}</h3>
                  <p class="text-sm text-gray-500">By ${item.author}</p>
                </div>
                <button class="remove-item text-gray-400 hover:text-red-500">
                  <i class="ri-close-line"></i>
                </button>
              </div>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center border rounded-md">
                  <button class="decrease w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l-md">-</button>
                  <input type="number" value="${item.quantity}" class="quantity-input w-10 h-8 text-center border-x" min="1">
                  <button class="increase w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-r-md">+</button>
                </div>
                <span class="item-total font-medium">${formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        `;
        productList.insertAdjacentHTML("beforeend", itemHTML);
      });

      attachCartEventListeners();
      updateTotals();
    }
  }

  // Hiển thị thông tin người dùng
  const userInfo = JSON.parse(localStorage.getItem("shippingInfo"));
  const addressList = JSON.parse(localStorage.getItem("deliveryAddresses")) || [];

  if (userInfo) {
    document.getElementById("display-name").textContent = userInfo.name || "";
    document.getElementById("display-phone").textContent = userInfo.phone || "";
    document.getElementById("display-email").textContent = userInfo.email || "";
  }

  const index = parseInt(userInfo?.addressIndex, 10);
  if (!isNaN(index) && addressList[index]) {
    const addr = addressList[index];
    document.getElementById("display-address").textContent =
      `${addr.detail}, ${addr.ward}, ${addr.district}, ${addr.province}`;
  }
});

// Popup đặt hàng thành công
document.getElementById("confirm-payment-btn").addEventListener("click", function () {
  const popup = document.getElementById("success-popup");
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("show"), 10);
});
