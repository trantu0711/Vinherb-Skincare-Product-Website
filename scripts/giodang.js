// --- Hàm lấy thông tin sản phẩm ---
function getProductInfo() {
  const name = document.getElementById("namesp").innerText.trim();
  const code = document.getElementById("masp").innerText.trim();
  const priceText = document.getElementById("giasp").innerText.trim();
  const price = parseInt(priceText.replace(/\D/g, "")); // loại bỏ ký tự không phải số

  return {
    code: code,
    name: name,
    price: price,
    quantity: 1,
  };
}

// --- Thêm sản phẩm vào giỏ hàng ---
function addToCart() {
  const product = getProductInfo();
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find((item) => item.code === product.code);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`🛒 Đã thêm "${product.name}" vào giỏ hàng!`);
}

// --- Hiển thị giỏ hàng ---
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const div = document.getElementById("cart-body");
  const totalElement = document.getElementById("total");
  let total = 0;
  div.innerHTML = "";

  if (cart.length === 0) {
    div.innerHTML = `<div style="text-align:center; padding: 20px;">Giỏ hàng trống</div>`;
    totalElement.innerText = "";
    return;
  }

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const row = document.createElement("div");
    row.classList.add("cart-item");
    row.innerHTML = `
      <div class="cart-product-info">
        <div class="cart-product-text">
          <h6>${item.name}</h6>
          <div class="cart-product-code">Mã: ${item.code}</div>
        </div>
      </div>

      <div class="cart-price">${item.price.toLocaleString()}đ</div>

      <div class="quantity-control">
        <button class="minus" data-code="${item.code}">-</button>
        <span>${item.quantity}</span>
        <button class="plus" data-code="${item.code}">+</button>
      </div>

      <div class="cart-total">${itemTotal.toLocaleString()}đ</div>

      <div class="cart-remove"><a href="#" class="remove" data-code="${
        item.code
      }">Xoá</a></div>
    `;
    div.appendChild(row);
  });

  totalElement.innerText = `Tổng cộng: ${total.toLocaleString()}đ`;

  attachCartEvents(); // gắn lại sự kiện sau khi render
}

// --- Gắn sự kiện cho các nút (xóa, +, -) ---
function attachCartEvents() {
  // Xóa sản phẩm
  document.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const code = this.getAttribute("data-code");
      removeFromCart(code);
    });
  });

  // Nút tăng số lượng
  document.querySelectorAll(".plus").forEach((btn) => {
    btn.addEventListener("click", function () {
      const code = this.getAttribute("data-code");
      updateQuantity(code, 1);
    });
  });

  // Nút giảm số lượng
  document.querySelectorAll(".minus").forEach((btn) => {
    btn.addEventListener("click", function () {
      const code = this.getAttribute("data-code");
      updateQuantity(code, -1);
    });
  });
}

// --- Cập nhật số lượng sản phẩm ---
function updateQuantity(code, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart.find((item) => item.code === code);

  if (!product) return;

  product.quantity += change;

  if (product.quantity <= 0) {
    // Xóa nếu số lượng <= 0
    cart = cart.filter((item) => item.code !== code);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(); // render lại giao diện
}

// --- Xóa sản phẩm khỏi giỏ hàng ---
function removeFromCart(code) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.code !== code);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// --- Khi trang tải ---
document.addEventListener("DOMContentLoaded", function () {
  // Trang sản phẩm
  const addButton = document.querySelector(
    ".button_DH .button_mua:nth-child(2) button"
  );
  if (addButton) addButton.addEventListener("click", addToCart);

  // Trang giỏ hàng
  if (window.location.pathname.includes("giohang.html")) {
    renderCart();
  }
});

function goToCheckout() {
  // sang trang checkout chỉ cần đọc lại localStorage,
  // không cần lưu thêm biến phụ
  window.location.href = "checkout.html";
}
