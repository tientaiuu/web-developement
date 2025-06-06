// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});

// Search functionality
const searchInput = document.querySelector('.search-input');
if (searchInput) {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value;
      console.log('Searching for:', query);
      // Add search logic here
    }
  });
}

const searchBtnHero = document.querySelector('.search-btn-hero');
if (searchBtnHero && searchInput) {
  searchBtnHero.addEventListener('click', () => {
    const query = searchInput.value;
    console.log('Searching for:', query);
    // Add search logic here
  });
}

