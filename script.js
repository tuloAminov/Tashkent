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
      closeCartModal();
      closeSuccessModal();
    }
  });

  // =========================================================================
  // 7. ONLINE ORDERING & CART SYSTEM
  // =========================================================================
  
  // State
  let cart = [];
  try {
    const savedCart = localStorage.getItem('tashkent_cart');
    if (savedCart) cart = JSON.parse(savedCart);
  } catch (err) {
    cart = [];
  }

  let orderMode = 'delivery'; // 'delivery' | 'pickup'
  let paymentMethod = 'sbp'; // 'sbp' | 'card' | 'offline'

  // DOM Elements
  const headerCartBtn = document.getElementById('headerCartBtn');
  const headerCartBadge = document.getElementById('headerCartBadge');
  const floatingCartBar = document.getElementById('floatingCartBar');
  const floatingCartOpen = document.getElementById('floatingCartOpen');
  const floatingCartActionBtn = document.getElementById('floatingCartActionBtn');
  const floatingCartCount = document.getElementById('floatingCartCount');
  const floatingCartTotal = document.getElementById('floatingCartTotal');

  const cartModal = document.getElementById('cartModal');
  const cartModalClose = document.getElementById('cartModalClose');
  const cartGoToMenuBtn = document.getElementById('cartGoToMenuBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartCheckoutForm = document.getElementById('cartCheckoutForm');

  const modeDeliveryBtn = document.getElementById('modeDeliveryBtn');
  const modePickupBtn = document.getElementById('modePickupBtn');
  const deliveryAddressGroup = document.getElementById('deliveryAddressGroup');
  const orderAddressInput = document.getElementById('orderAddress');

  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDiscountRow = document.getElementById('cartDiscountRow');
  const cartDiscountEl = document.getElementById('cartDiscount');
  const cartDeliveryRow = document.getElementById('cartDeliveryRow');
  const cartDeliveryFeeEl = document.getElementById('cartDeliveryFee');
  const cartGrandTotalEl = document.getElementById('cartGrandTotal');
  const cartSubmitBtn = document.getElementById('cartSubmitBtn');

  const orderSuccessModal = document.getElementById('orderSuccessModal');
  const orderSuccessCloseBtn = document.getElementById('orderSuccessCloseBtn');

  // Helpers
  function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
  }

  function getPluralDish(n) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 19) return `${n} блюд`;
    if (mod10 === 1) return `${n} блюдо`;
    if (mod10 >= 2 && mod10 <= 4) return `${n} блюда`;
    return `${n} блюд`;
  }

  function saveCart() {
    try {
      localStorage.setItem('tashkent_cart', JSON.stringify(cart));
    } catch (e) {}
  }

  function getTotalItemsCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Calculate totals based on mode & cart
  function calculateOrder() {
    const subtotal = getSubtotal();
    const discount = orderMode === 'pickup' ? Math.round(subtotal * 0.10) : 0;
    let deliveryFee = 0;

    if (orderMode === 'delivery') {
      deliveryFee = subtotal >= 1500 || subtotal === 0 ? 0 : 200;
    }

    const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

    return {
      subtotal,
      discount,
      deliveryFee,
      grandTotal
    };
  }

  // Update Menu Cards UI (Add button vs [- Qty +])
  function updateMenuCardsUI() {
    document.querySelectorAll('.menu-card').forEach(card => {
      const id = card.getAttribute('data-id');
      const actionBox = card.querySelector('.menu-card__action');
      if (!actionBox) return;

      const cartItem = cart.find(it => it.id === id);

      if (cartItem && cartItem.quantity > 0) {
        actionBox.innerHTML = `
          <div class="menu-qty-controls">
            <button type="button" class="menu-qty-btn" data-qty-action="decrease" data-id="${id}" aria-label="Уменьшить">−</button>
            <span class="menu-qty-value">${cartItem.quantity}</span>
            <button type="button" class="menu-qty-btn" data-qty-action="increase" data-id="${id}" aria-label="Увеличить">+</button>
          </div>
        `;
      } else {
        actionBox.innerHTML = `
          <button class="btn btn_menu-add" type="button" data-add-cart="${id}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>В заказ</span>
          </button>
        `;
      }
    });

    // Reattach listeners for menu buttons
    document.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-add-cart');
        addToCart(id);
      });
    });

    document.querySelectorAll('[data-qty-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-qty-action');
        if (action === 'increase') {
          updateItemQuantity(id, 1);
        } else if (action === 'decrease') {
          updateItemQuantity(id, -1);
        }
      });
    });
  }

  // Update Overall Cart UI (Header badge, floating bar, drawer totals)
  function updateCartUI() {
    const totalCount = getTotalItemsCount();
    const totals = calculateOrder();

    // 1. Header badge
    if (headerCartBadge) {
      headerCartBadge.textContent = totalCount;
      headerCartBadge.classList.add('bump');
      setTimeout(() => headerCartBadge.classList.remove('bump'), 250);
    }

    // 2. Floating bottom bar
    if (floatingCartBar) {
      if (totalCount > 0) {
        floatingCartBar.classList.add('active');
        if (floatingCartCount) floatingCartCount.textContent = getPluralDish(totalCount);
        if (floatingCartTotal) floatingCartTotal.textContent = formatPrice(totals.grandTotal);
      } else {
        floatingCartBar.classList.remove('active');
      }
    }

    // 3. Drawer items list & empty state
    if (cartItemsList && cartEmptyState && cartCheckoutForm) {
      if (cart.length === 0) {
        cartEmptyState.classList.add('active');
        cartCheckoutForm.style.display = 'none';
        cartItemsList.innerHTML = '';
      } else {
        cartEmptyState.classList.remove('active');
        cartCheckoutForm.style.display = 'block';

        cartItemsList.innerHTML = cart.map(item => `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.img}" alt="${item.name}" class="cart-item__thumb" loading="lazy">
            <div class="cart-item__info">
              <div class="cart-item__name">${item.name}</div>
              <div class="cart-item__price">${formatPrice(item.price * item.quantity)}</div>
            </div>
            <div class="cart-item__actions">
              <div class="menu-qty-controls">
                <button type="button" class="menu-qty-btn" data-drawer-action="decrease" data-id="${item.id}">−</button>
                <span class="menu-qty-value">${item.quantity}</span>
                <button type="button" class="menu-qty-btn" data-drawer-action="increase" data-id="${item.id}">+</button>
              </div>
              <button type="button" class="cart-item__remove" data-drawer-action="remove" data-id="${item.id}" title="Удалить">&times;</button>
            </div>
          </div>
        `).join('');

        // Attach drawer item actions
        cartItemsList.querySelectorAll('[data-drawer-action]').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const act = btn.getAttribute('data-drawer-action');
            if (act === 'increase') updateItemQuantity(id, 1);
            if (act === 'decrease') updateItemQuantity(id, -1);
            if (act === 'remove') removeItemFromCart(id);
          });
        });
      }
    }

    // 4. Totals breakdown
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(totals.subtotal);

    if (cartDiscountRow && cartDiscountEl) {
      if (orderMode === 'pickup' && totals.subtotal > 0) {
        cartDiscountRow.style.display = 'flex';
        cartDiscountEl.textContent = '-' + formatPrice(totals.discount);
      } else {
        cartDiscountRow.style.display = 'none';
      }
    }

    if (cartDeliveryRow && cartDeliveryFeeEl) {
      if (orderMode === 'pickup') {
        cartDeliveryRow.style.display = 'none';
      } else {
        cartDeliveryRow.style.display = 'flex';
        if (totals.deliveryFee === 0 && totals.subtotal > 0) {
          cartDeliveryFeeEl.innerHTML = '<span class="text-green">0 ₽ (Бесплатно)</span>';
        } else {
          cartDeliveryFeeEl.textContent = formatPrice(totals.deliveryFee);
        }
      }
    }

    if (cartGrandTotalEl) {
      cartGrandTotalEl.textContent = formatPrice(totals.grandTotal);
    }

    // 5. Submit button text
    if (cartSubmitBtn) {
      let btnLabel = 'Оформить заказ';
      if (paymentMethod === 'sbp') {
        btnLabel = `Оплатить через СБП • ${formatPrice(totals.grandTotal)}`;
      } else if (paymentMethod === 'card') {
        btnLabel = `Оплатить картой • ${formatPrice(totals.grandTotal)}`;
      } else {
        btnLabel = `Оформить заказ • ${formatPrice(totals.grandTotal)}`;
      }
      cartSubmitBtn.querySelector('span:first-child').textContent = btnLabel;
    }

    // 6. Update menu cards
    updateMenuCardsUI();
  }

  // Cart Operations
  function addToCart(dishId) {
    const card = document.querySelector(`.menu-card[data-id="${dishId}"]`);
    if (!card) return;

    const name = card.getAttribute('data-name');
    const price = parseInt(card.getAttribute('data-price'), 10);
    const img = card.getAttribute('data-img') || 'images/plow.png';

    const existing = cart.find(it => it.id === dishId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: dishId, name, price, img, quantity: 1 });
    }

    saveCart();
    updateCartUI();
  }

  function updateItemQuantity(dishId, delta) {
    const existing = cart.find(it => it.id === dishId);
    if (!existing) return;

    existing.quantity += delta;
    if (existing.quantity <= 0) {
      cart = cart.filter(it => it.id !== dishId);
    }

    saveCart();
    updateCartUI();
  }

  function removeItemFromCart(dishId) {
    cart = cart.filter(it => it.id !== dishId);
    saveCart();
    updateCartUI();
  }

  function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
  }

  // Cart Modal Open / Close
  function openCartModal() {
    if (cartModal) {
      cartModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      updateCartUI();
    }
  }

  function closeCartModal() {
    if (cartModal) {
      cartModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function closeSuccessModal() {
    if (orderSuccessModal) {
      orderSuccessModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Event Listeners for Open / Close Cart
  if (headerCartBtn) headerCartBtn.addEventListener('click', openCartModal);
  if (floatingCartOpen) floatingCartOpen.addEventListener('click', openCartModal);
  if (floatingCartActionBtn) floatingCartActionBtn.addEventListener('click', openCartModal);
  if (cartModalClose) cartModalClose.addEventListener('click', closeCartModal);

  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) closeCartModal();
    });
  }

  if (cartGoToMenuBtn) {
    cartGoToMenuBtn.addEventListener('click', () => {
      closeCartModal();
      const menuSec = document.getElementById('menu');
      if (menuSec) menuSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (orderSuccessCloseBtn) {
    orderSuccessCloseBtn.addEventListener('click', closeSuccessModal);
  }

  if (orderSuccessModal) {
    orderSuccessModal.addEventListener('click', (e) => {
      if (e.target === orderSuccessModal) closeSuccessModal();
    });
  }

  // Mode Toggle (Delivery vs Pickup)
  if (modeDeliveryBtn && modePickupBtn) {
    modeDeliveryBtn.addEventListener('click', () => {
      orderMode = 'delivery';
      modeDeliveryBtn.classList.add('active');
      modePickupBtn.classList.remove('active');
      modeDeliveryBtn.setAttribute('aria-selected', 'true');
      modePickupBtn.setAttribute('aria-selected', 'false');

      if (deliveryAddressGroup) deliveryAddressGroup.style.display = 'block';
      if (orderAddressInput) orderAddressInput.required = true;

      updateCartUI();
    });

    modePickupBtn.addEventListener('click', () => {
      orderMode = 'pickup';
      modePickupBtn.classList.add('active');
      modeDeliveryBtn.classList.remove('active');
      modePickupBtn.setAttribute('aria-selected', 'true');
      modeDeliveryBtn.setAttribute('aria-selected', 'false');

      if (deliveryAddressGroup) deliveryAddressGroup.style.display = 'none';
      if (orderAddressInput) orderAddressInput.required = false;

      updateCartUI();
    });
  }

  // Payment Method Selection
  document.querySelectorAll('input[name="orderPayment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      paymentMethod = radio.value;
      document.querySelectorAll('.payment-card').forEach(card => card.classList.remove('active'));
      const parentCard = radio.closest('.payment-card');
      if (parentCard) parentCard.classList.add('active');
      updateCartUI();
    });
  });

  // Order Submission Simulation
  if (cartCheckoutForm) {
    cartCheckoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (cart.length === 0) return;

      const customerName = document.getElementById('orderCustomerName').value.trim();
      const customerPhone = document.getElementById('orderCustomerPhone').value.trim();
      const orderAddress = orderAddressInput ? orderAddressInput.value.trim() : '';
      const orderComment = document.getElementById('orderComment').value.trim();
      const totals = calculateOrder();

      const orderNumber = '#TK-' + Math.floor(100 + Math.random() * 900);

      // Populate Success Modal
      const orderSuccessId = document.getElementById('orderSuccessId');
      const orderSuccessBadge = document.getElementById('orderSuccessBadge');
      const orderSuccessMessage = document.getElementById('orderSuccessMessage');
      const orderSuccessTime = document.getElementById('orderSuccessTime');
      const orderSuccessType = document.getElementById('orderSuccessType');
      const orderSuccessTotal = document.getElementById('orderSuccessTotal');

      if (orderSuccessId) orderSuccessId.textContent = orderNumber;
      if (orderSuccessTotal) orderSuccessTotal.textContent = formatPrice(totals.grandTotal);
      if (orderSuccessType) {
        orderSuccessType.textContent = orderMode === 'delivery' ? 'Доставка курьером' : 'Самовывоз из ресторана';
      }
      if (orderSuccessTime) {
        orderSuccessTime.textContent = orderMode === 'delivery' ? '35–45 минут' : 'Готовность через 20 минут';
      }

      if (paymentMethod === 'sbp') {
        if (orderSuccessBadge) orderSuccessBadge.textContent = 'ОПЛАЧЕНО ЧЕРЕЗ СБП';
        if (orderSuccessMessage) {
          orderSuccessMessage.textContent = `Спасибо, ${customerName}! Платеж ${formatPrice(totals.grandTotal)} подтвержден банком через СБП. Заказ отправлен шеф-повару.`;
        }
      } else if (paymentMethod === 'card') {
        if (orderSuccessBadge) orderSuccessBadge.textContent = 'ОПЛАЧЕНО КАРТОЙ';
        if (orderSuccessMessage) {
          orderSuccessMessage.textContent = `Спасибо, ${customerName}! Онлайн-оплата успешно прошла. Чек отправлен на телефон ${customerPhone}.`;
        }
      } else {
        if (orderSuccessBadge) orderSuccessBadge.textContent = 'ЗАКАЗ ПРИНЯТ';
        if (orderSuccessMessage) {
          orderSuccessMessage.textContent = `Спасибо, ${customerName}! Заказ принят. Оплата ${formatPrice(totals.grandTotal)} при получении.`;
        }
      }

      // Close cart drawer & open success modal
      closeCartModal();
      cartCheckoutForm.reset();

      if (orderSuccessModal) {
        orderSuccessModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      // Clear cart
      clearCart();
    });
  }

  // Initial UI Render
  updateCartUI();

});
