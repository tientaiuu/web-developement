// Sidebar navigation
document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".content-section");

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");

      const targetId = item.getAttribute("data-target");
      sections.forEach((section) => {
        section.classList.toggle("hidden", section.id !== targetId);
      });
    });
  });
});

// API tỉnh - quận - phường
fetch("https://provinces.open-api.vn/api/?depth=1")
  .then(res => res.json())
  .then(data => {
    const provinceSelect = document.getElementById("province");
    data.forEach(p => {
      provinceSelect.innerHTML += `<option value="${p.code}">${p.name}</option>`;
    });
  });

document.getElementById("province").addEventListener("change", function () {
  const code = this.value;
  fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
    .then(res => res.json())
    .then(data => {
      const districtSelect = document.getElementById("district");
      districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
      data.districts.forEach(d => {
        districtSelect.innerHTML += `<option value="${d.code}">${d.name}</option>`;
      });
    });
});

document.getElementById("district").addEventListener("change", function () {
  const code = this.value;
  fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
    .then(res => res.json())
    .then(data => {
      const wardSelect = document.getElementById("ward");
      wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
      data.wards.forEach(w => {
        wardSelect.innerHTML += `<option value="${w.code}">${w.name}</option>`;
      });
    });
});

// Đổi ảnh đại diện
function changeAvatar(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('avatar-preview').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Xóa ảnh đại diện
function removeAvatar() {
  document.getElementById('avatar-preview').src = 'assets/images/ava.png';
  document.getElementById('avatar-input').value = '';
}

/// ------------------- DATE PICKER -------------------
flatpickr("#birthdate", {
  dateFormat: "d/m/Y",
  maxDate: "today",
  defaultDate: null,
  altInput: true,
  altFormat: "d/m/Y"
});

// ------------------- LƯU THÔNG TIN TÀI KHOẢN -------------------
function saveUserInfo() {
  const name = document.getElementById("input-name").value;
  const phone = document.getElementById("input-phone").value;
  const email = document.getElementById("input-email").value;
  //const addressIndex = document.getElementById("selected-address").value;
  const addressIndex = parseInt(document.getElementById("selected-address").value, 10);
  
  // Hiển thị tên ở sidebar
  if (name.trim()) {
    document.getElementById("sidebar-name").textContent = name;
  }

  const info = {
    name,
    phone,
    email,
    addressIndex // địa chỉ sẽ được lấy theo chỉ số từ localStorage
  };

  localStorage.setItem("shippingInfo", JSON.stringify(info));
  alert("Thông tin đã được lưu!");
}

// ------------------- THÊM & HIỂN THỊ ĐỊA CHỈ GIAO HÀNG -------------------
const addressListContainer = document.getElementById("address-list");
const addBtn = document.querySelector(".add-btn");
const province = document.getElementById("province");
const district = document.getElementById("district");
const ward = document.getElementById("ward");
const detailInput = document.querySelector('input[placeholder="Nhập địa chỉ chi tiết"]');

function renderAddresses() {
  const addressList = JSON.parse(localStorage.getItem("deliveryAddresses")) || [];
  addressListContainer.innerHTML = "";

  addressList.forEach((addr, index) => {
    const html = `
      <div class="address-card" data-index="${index}">
        <button class="remove-btn"><span class="x-icon">×</span></button>
        <div class="flex gap-4">
          <div class="w-24 h-24 rounded-xl overflow-hidden bg-gray-200">
            <img src="assets/images/address.png" class="w-full h-full object-cover" />
          </div>
          <div>
            <h3 class="font-semibold text-black mb-1">${addr.province}</h3>
            <p class="text-sm text-[#292d32] mb-1">${addr.district}</p>
            <p class="text-sm text-[#292d32]">${addr.detail}</p>
          </div>
        </div>
      </div>`;
    addressListContainer.insertAdjacentHTML("beforeend", html);
  });

  // Gắn sự kiện xóa
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.closest(".address-card").dataset.index;
      const list = JSON.parse(localStorage.getItem("deliveryAddresses")) || [];
      list.splice(index, 1);
      localStorage.setItem("deliveryAddresses", JSON.stringify(list));
      renderAddresses();
      loadAddressOptions();
    });
  });
}

addBtn.addEventListener("click", () => {
  const provinceName = province.options[province.selectedIndex]?.text || "";
  const districtName = district.options[district.selectedIndex]?.text || "";
  const wardName = ward.options[ward.selectedIndex]?.text || "";
  const detail = detailInput.value.trim();

  if (!provinceName || !districtName || !wardName || !detail) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  const newAddress = {
    province: provinceName,
    district: districtName,
    ward: wardName,
    detail,
    full: `${detail}, ${wardName}, ${districtName}, ${provinceName}`
  };

  const addressList = JSON.parse(localStorage.getItem("deliveryAddresses")) || [];
  addressList.push(newAddress);
  localStorage.setItem("deliveryAddresses", JSON.stringify(addressList));
  renderAddresses();
  loadAddressOptions();

  // Reset
  province.value = "";
  district.innerHTML = '<option value="">Chọn quận/huyện</option>';
  ward.innerHTML = '<option value="">Chọn phường/xã</option>';
  detailInput.value = "";

  alert("Địa chỉ đã được thêm!");
});

// ------------------- LOAD DROPDOWN ĐỊA CHỈ CHO TÀI KHOẢN -------------------
function loadAddressOptions() {
  const select = document.getElementById('selected-address');
  if (!select) return; // tránh lỗi nếu không có select

  const addresses = JSON.parse(localStorage.getItem('deliveryAddresses')) || [];
  select.innerHTML = `<option value="">Chọn địa chỉ đã lưu</option>`;

  addresses.forEach((addr, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${addr.detail}, ${addr.ward}, ${addr.district}, ${addr.province}`;
    select.appendChild(option);
  });

  // Nếu đã lưu trước đó thì chọn lại đúng địa chỉ cũ
  const savedInfo = JSON.parse(localStorage.getItem("shippingInfo"));
  if (savedInfo?.addressIndex !== undefined) {
    select.value = savedInfo.addressIndex;
  }
}

// ------------------- LOAD THÔNG TIN NGƯỜI DÙNG -------------------
function loadUserInfo() {
  const info = JSON.parse(localStorage.getItem("shippingInfo"));
  if (!info) return;

  document.getElementById("input-name").value = info.name || "";
  document.getElementById("input-phone").value = info.phone || "";
  document.getElementById("input-email").value = info.email || "";

  if (info.addressIndex !== undefined) {
    const addressDropdown = document.getElementById("selected-address");
    if (addressDropdown) {
      addressDropdown.value = info.addressIndex;
    }
  }
}

// ------------------- INIT -------------------
document.addEventListener("DOMContentLoaded", () => {
  const savedInfo = JSON.parse(localStorage.getItem("shippingInfo"));
  if (savedInfo?.name) {
    document.getElementById("sidebar-name").textContent = savedInfo.name;
  }
  renderAddresses();
  loadAddressOptions();
  loadUserInfo();
});
