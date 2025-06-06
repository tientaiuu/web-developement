// Đảm bảo chỉ gắn 1 lần event listener cho document
document.addEventListener('click', function(e) {
    const userPanel = document.getElementById('userPanel');
    const userBtn = document.getElementById('userBtn');
    if (
      userPanel &&
      !userPanel.classList.contains('hidden') &&
      !userPanel.contains(e.target) &&
      (!userBtn || !userBtn.contains(e.target)) 
    ) {
      closeUserPanel();
    }
  });

  function openUserPanel() {
    const userPanel = document.getElementById('userPanel');
    if (userPanel) {
      userPanel.classList.remove('hidden');
      // Đảm bảo hiệu ứng trượt hoạt động
      setTimeout(() => {
        userPanel.classList.remove('translate-x-full');
      }, 10);
    }
  }

  function closeUserPanel() {
    const userPanel = document.getElementById('userPanel');
    if (userPanel) {
      userPanel.classList.add('translate-x-full');
      // Ẩn panel sau khi hiệu ứng trượt xong (300ms)
      setTimeout(() => {
        userPanel.classList.add('hidden');
      }, 300);
    }
  }

  function initHeaderPanel() {
    const userBtn = document.getElementById('userBtn');
    const userPanel = document.getElementById('userPanel');
    const closeUserPanelBtn = document.getElementById('closeUserPanel');

    if (!userBtn || !userPanel || !closeUserPanelBtn) return;

    userBtn.onclick = openUserPanel;
    closeUserPanelBtn.onclick = closeUserPanel;

    // Đóng panel khi click ra ngoài panel
    document.addEventListener('mousedown', function(e) {
      if (
        userPanel &&
        !userPanel.classList.contains('hidden') &&
        !userPanel.classList.contains('translate-x-full') &&
        !userPanel.contains(e.target) &&
        (!userBtn || !userBtn.contains(e.target))
      ) {
        closeUserPanel();
      }
    });
  }

  // Tải header và footer từ components
  fetch('./components/header.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
      // Gọi hàm khởi tạo panel nếu có
      if (typeof initHeaderPanel === 'function') {
        initHeaderPanel();
      }
    });

  fetch('./components/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer-placeholder').innerHTML = data);
