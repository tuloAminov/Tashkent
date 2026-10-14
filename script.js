document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. FIXED HEADER SCROLL EFFECT
  // =========================================================================
  const mainHeader = document.getElementById('mainHeader');
  
  function handleHeaderScroll() {
    if (!mainHeader) return;
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // =========================================================================
  // 2. HERO FULLSCREEN SLIDER
  // =========================================================================
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('#heroDots .dot');
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');
  let currentHeroSlide = 0;
  let heroInterval = null;

  function showHeroSlide(index) {
    if (!heroSlides.length) return;
    heroSlides.forEach(slide => slide.classList.remove('active'));
    heroDots.forEach(dot => dot.classList.remove('active'));

    currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
    heroSlides[currentHeroSlide].classList.add('active');
    if (heroDots[currentHeroSlide]) {
      heroDots[currentHeroSlide].classList.add('active');
    }
  }

  function nextHeroSlide() {
    showHeroSlide(currentHeroSlide + 1);
  }

  function prevHeroSlide() {
    showHeroSlide(currentHeroSlide - 1);
  }

  if (heroNextBtn) heroNextBtn.addEventListener('click', () => { nextHeroSlide(); resetHeroAutoplay(); });
  if (heroPrevBtn) heroPrevBtn.addEventListener('click', () => { prevHeroSlide(); resetHeroAutoplay(); });

  heroDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide'), 10);
      showHeroSlide(idx);
      resetHeroAutoplay();
    });
  });

  function startHeroAutoplay() {
    heroInterval = setInterval(nextHeroSlide, 5000);
  }

  function resetHeroAutoplay() {
    clearInterval(heroInterval);
    startHeroAutoplay();
  }

  startHeroAutoplay();

  // =========================================================================
  // 3. PROMO GALLERY SLIDERS
  // =========================================================================
  function initGallerySlider(sliderId) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    const slides = slider.querySelectorAll('.gallery-slide');
    let currentIndex = 0;

    function updateSlider() {
      slides.forEach((slide) => {
        slide.style.transform = `translateX(-${currentIndex * 100}%)`;
      });
    }

    const prevBtn = document.querySelector(`.nav-btn.btn-prev[data-slider="${sliderId}"]`);
    const nextBtn = document.querySelector(`.nav-btn.btn-next[data-slider="${sliderId}"]`);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
      });
    }
  }

  initGallerySlider('promoSlider1');
  initGallerySlider('promoSlider2');

  // =========================================================================
  // 4. MENU CATEGORY FILTERING
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');
      menuCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || category === cardCat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 5. BOOKING TABLE MODAL
  // =========================================================================
  const bookingModal = document.getElementById('bookingModal');
  const bookingModalClose = document.getElementById('bookingModalClose');
  const bookingForm = document.getElementById('bookingForm');
  const bookDateInput = document.getElementById('bookDate');

  // Set default minimum date to today
  if (bookDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookDateInput.min = today;
    bookDateInput.value = today;
  }

  function openBookingModal() {
    if (bookingModal) {
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBookingModal() {
    if (bookingModal) {
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.btn-book').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.type === 'submit') return;
      e.preventDefault();
      openBookingModal();
    });
  });

  if (bookingModalClose) bookingModalClose.addEventListener('click', closeBookingModal);
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookName').value;
      const phone = document.getElementById('bookPhone').value;
      const guests = document.getElementById('bookGuests').value;
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;

      alert(`Спасибо, ${name}!\n\nВаш столик в ресторане «Ташкент» на ${guests} успешно забронирован на ${date} в ${time}.\nМы свяжемся с вами по номеру ${phone} для подтверждения бронирования.`);
      bookingForm.reset();
      closeBookingModal();
    });
  }

  // =========================================================================
  // 6. ESCAPE KEY TO CLOSE ANY ACTIVE MODAL
  // =========================================================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBookingModal();
    }
  });

});
