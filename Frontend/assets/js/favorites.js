// ==== favorites.js ====

// LocalStorage helpers
function getWishlist()  { return JSON.parse(localStorage.getItem('wishlistItems') || '[]'); }
function saveWishlist(list) {
  localStorage.setItem('wishlistItems', JSON.stringify(list));
  updateWishlistCount();
}

// Badge count
function updateWishlistCount() {
  const cnt = getWishlist().length;
  const el = document.getElementById('wishlist-count');
  if (el) el.textContent = cnt;
}

// Render panel
function renderWishlistPanel() {
  const list = getWishlist();
  const container = document.getElementById('wishlist-items');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<p class="text-gray-500">Chưa có sách yêu thích.</p>`;
  } else {
    container.innerHTML = list.map(item => `
      <div class="flex gap-3 items-center border-b pb-2">
        <img src="${item.image}" alt="${item.title}"
             class="w-12 h-16 object-cover rounded" />
        <div class="flex-1">
          <p class="font-medium">${item.title}</p>
          <p class="text-sm text-gray-500">${item.author}</p>
          <!-- Hiển thị giá theo style Giỏ hàng -->
          <div class="text-primarynavy font-semibold">
            ${item.price.toLocaleString('vi-VN')}₫
          </div>
        </div>
        <button onclick="toggleWishlist('${item.id}')"
                class="text-red-500 hover:underline text-xl">&times;</button>
      </div>
    `).join('');
  }
}

// Toggle single book
function toggleWishlist(bookOrId) {
  const list = getWishlist();
  const isObj = typeof bookOrId === 'object';
  const bookId = isObj ? (bookOrId.id || bookOrId._id) : bookOrId;
  const idx = list.findIndex(i => i.id === bookId);

  if (idx !== -1) {
    list.splice(idx, 1); // remove
  } else {
    let title, author, image, price;

    if (isObj) {
      title  = bookOrId.title || '';
      author = bookOrId.author?.name || bookOrId.author || '';
      image  = bookOrId.image || bookOrId.imageUrl || '';
      price  = bookOrId.price || 0;
    } else {
      // Trang chi tiết: ưu tiên lấy từ window.currentBook nếu có
      if (typeof window.currentBook === 'object' && (window.currentBook._id == bookId || window.currentBook.id == bookId)) {
        const book = window.currentBook;
        title  = book.title || '';
        author = book.author?.name || book.author || '';
        image  = book.imageUrl || book.image || '';
        price  = book.price || 0;
      } else {
        // Trang danh sách
        const card = document.querySelector(`.book-card-item[data-id="${bookId}"]`);
        title  = card?.querySelector('h3')?.innerText.trim()
              || document.getElementById('bookTitle')?.innerText.trim() || '';
        author = card?.querySelector('p.text-gray-600')?.innerText.trim()
              || document.getElementById('bookAuthor')?.innerText.trim() || '';
        image  = card?.querySelector('img')?.src
              || document.getElementById('bookImage')?.src || '';
        // Lấy giá từ data-price hoặc .font-semibold hoặc #bookPrice
        const rawPrice = card?.getAttribute('data-price')
              || card?.querySelector('.font-semibold')?.innerText.replace(/[^\d]/g,'')
              || document.getElementById('bookPrice')?.innerText.replace(/[^\d]/g,'')
              || '0';
        price = Number(rawPrice);
      }
    }

    list.push({ id: bookId, title, author, image, price });
  }

  saveWishlist(list);
  renderWishlistPanel();
  updateWishlistCount();

  document
    .querySelectorAll(`.book-card-item[data-id="${bookId}"] .fav-btn i, .wishlist-btn i`)
    .forEach(i => {
      i.classList.toggle('ri-star-fill', idx === -1);
      i.classList.toggle('ri-star-line',  idx !== -1);
    });
}

// Slide panel
function openWishlistPanel() {
  const panel = document.getElementById('wishlistPanel');
  panel.classList.remove('hidden');
  requestAnimationFrame(() => panel.classList.remove('translate-x-full'));
}
function closeWishlistPanel() {
  const panel = document.getElementById('wishlistPanel');
  panel.classList.add('translate-x-full');
  panel.addEventListener('transitionend', function cb(e) {
    if (e.propertyName === 'transform') {
      panel.classList.add('hidden');
      panel.removeEventListener('transitionend', cb);
    }
  });
}

// Init listeners
function initWishlistHeader() {
  const openBtn  = document.getElementById('wishlistBtn');
  const closeBtn = document.getElementById('closeWishlistPanel');
  if (openBtn)  openBtn.addEventListener('click',  e => { e.stopPropagation(); openWishlistPanel(); renderWishlistPanel(); });
  if (closeBtn) closeBtn.addEventListener('click', e => { e.stopPropagation(); closeWishlistPanel(); });
  document.addEventListener('mousedown', e => {
    const panel = document.getElementById('wishlistPanel');
    if (panel && !panel.classList.contains('hidden') && !panel.contains(e.target) && e.target !== openBtn) {
      closeWishlistPanel();
    }
  });
}

// Buttons on cards/detail
function initWishlistButtons() {
  document.querySelectorAll('.fav-btn, .wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const bookId = btn.closest('.book-card-item')?.getAttribute('data-id')
                   || document.getElementById('bookInfoRow')?.innerText.match(/ID:\s*([^|]+)/)?.[1].trim();
      if (bookId) toggleWishlist(bookId);
    });
  });
}

// === khởi tạo ===
function initWishlistFeature() {
  initWishlistHeader();
  initWishlistButtons();
  updateWishlistCount();
  renderWishlistPanel();
}


// Nếu header được load động (SPA, hoặc sau khi fetch header.html), cho phép gọi lại thủ công
window.initWishlistHeader = initWishlistHeader;
window.initWishlistButtons = initWishlistButtons;
window.updateWishlistCount = updateWishlistCount;
window.renderWishlistPanel = renderWishlistPanel;
window.toggleWishlist = toggleWishlist;  // nếu cần gọi inline
