/**
 * The Baking Spot - Purple Theme Sales Post Catalog
 * 2-Slide Hero Carousel, Compact Mobile & Multi-dimensional Filters, Modal Popups & WhatsApp Pre-orders
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initMultiFilters();
  initProductModal();
});

/* ==========================================================================
   1. 2-Image Hero Slider Carousel
   ========================================================================== */
function initHeroSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slider-slide');
  const dots = slider.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoSlideTimer = null;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = (index + totalSlides) % totalSlides;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      goToSlide(idx);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, 4500);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  startAutoSlide();

  // Mobile Touch Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 40) {
      nextSlide();
      resetAutoSlide();
    } else if (touchEndX > touchStartX + 40) {
      prevSlide();
      resetAutoSlide();
    }
  }, { passive: true });
}

/* ==========================================================================
   2. Multi-Dimensional & Compact Mobile Filters
   ========================================================================== */
const filterState = {
  collection: 'all',
  category: 'all',
  flavour: 'all'
};

const filterDisplayNames = {
  collection: {
    'all': 'All Collections',
    'teacher': "Teacher's Day",
    'krishna': 'Janmashtami'
  },
  category: {
    'all': 'All Categories',
    'bento': 'Bento',
    'half-kg': 'Half Kg',
    '1-kg': '1 Kg'
  },
  flavour: {
    'all': 'All Flavours',
    'pineapple': 'Pineapple',
    'butterscotch': 'Butterscotch',
    'choco-truffle': 'Choco Truffle',
    'vanilla': 'Vanilla'
  }
};

function initMultiFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  const products = document.querySelectorAll('.product-card');
  const counter = document.getElementById('productsCounter');
  const mobileToggleBtn = document.getElementById('mobileFilterToggleBtn');
  const filtersPanel = document.getElementById('filtersPanel');
  const mobileBadge = document.getElementById('mobileFilterBadge');
  const resetBtn = document.getElementById('btnResetFilters');
  const chipsContainer = document.getElementById('activeFilterChips');

  // Mobile Filter Panel Toggle
  if (mobileToggleBtn && filtersPanel) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = filtersPanel.classList.toggle('is-open');
      mobileToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Reset Filters Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetAllFilters();
    });
  }

  function resetAllFilters() {
    filterState.collection = 'all';
    filterState.category = 'all';
    filterState.flavour = 'all';

    pills.forEach(p => {
      if (p.dataset.value === 'all') {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    applyFilters();
  }

  function updateMobileBadgeAndChips() {
    const activeFilters = [];

    if (filterState.collection !== 'all') {
      activeFilters.push({ type: 'collection', label: filterDisplayNames.collection[filterState.collection] || filterState.collection });
    }
    if (filterState.category !== 'all') {
      activeFilters.push({ type: 'category', label: filterDisplayNames.category[filterState.category] || filterState.category });
    }
    if (filterState.flavour !== 'all') {
      activeFilters.push({ type: 'flavour', label: filterDisplayNames.flavour[filterState.flavour] || filterState.flavour });
    }

    // Update Mobile Badge Text
    if (mobileBadge) {
      if (activeFilters.length === 0) {
        mobileBadge.textContent = 'All';
      } else {
        mobileBadge.textContent = `${activeFilters.length} Active`;
      }
    }

    // Toggle Reset Button Visibility
    if (resetBtn) {
      resetBtn.style.display = activeFilters.length > 0 ? 'inline-block' : 'none';
    }

    // Render Active Filter Chips
    if (chipsContainer) {
      if (activeFilters.length > 0) {
        chipsContainer.classList.add('has-chips');
        chipsContainer.innerHTML = activeFilters.map(f => `
          <span class="filter-chip">
            ${f.label}
            <span class="filter-chip-remove" data-remove-type="${f.type}" title="Remove filter">&times;</span>
          </span>
        `).join('');

        chipsContainer.querySelectorAll('.filter-chip-remove').forEach(removeBtn => {
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const filterType = removeBtn.dataset.removeType;
            filterState[filterType] = 'all';

            // Update pills for this filter group
            pills.forEach(p => {
              if (p.dataset.filterType === filterType) {
                if (p.dataset.value === 'all') {
                  p.classList.add('active');
                } else {
                  p.classList.remove('active');
                }
              }
            });

            applyFilters();
          });
        });
      } else {
        chipsContainer.classList.remove('has-chips');
        chipsContainer.innerHTML = '';
      }
    }
  }

  function applyFilters() {
    let visibleCount = 0;

    products.forEach(card => {
      const colMatch = (filterState.collection === 'all') || (card.dataset.collection === filterState.collection);
      const catMatch = (filterState.category === 'all') || (card.dataset.category === filterState.category);
      const flavMatch = (filterState.flavour === 'all') || (card.dataset.flavour === filterState.flavour);

      if (colMatch && catMatch && flavMatch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (counter) {
      counter.textContent = `Showing ${visibleCount} Cakes`;
    }

    updateMobileBadgeAndChips();
  }

  // Pill click handlers
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const type = pill.dataset.filterType;
      const value = pill.dataset.value;

      filterState[type] = value;

      const parentGroup = pill.closest('.filter-pills');
      if (parentGroup) {
        parentGroup.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      }

      applyFilters();
    });
  });

  // Initial setup
  applyFilters();
}

/* ==========================================================================
   3. Product Details Modal Logic
   ========================================================================== */
let activeModalData = {
  name: '',
  price: '',
  category: '',
  flavour: '',
  collection: ''
};

function initProductModal() {
  const modal = document.getElementById('productModalDialog');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  // Close when clicking dialog backdrop
  modal.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      modal.close();
    }
  });
}

window.openProductModal = function(cardEl) {
  const modal = document.getElementById('productModalDialog');
  if (!modal) return;

  const imgEl = cardEl.querySelector('.product-image-box img');
  const titleEl = cardEl.querySelector('.product-name');
  const descEl = cardEl.querySelector('.product-short-desc');
  const priceValEl = cardEl.querySelector('.price-val');
  const catBadgeEl = cardEl.querySelector('.badge-cat');
  const flavBadgeEl = cardEl.querySelector('.badge-flavour');
  const eventTagEl = cardEl.querySelector('.product-event-tag');

  const imgSrc = imgEl ? imgEl.src : '';
  const name = titleEl ? titleEl.textContent.trim() : 'Celebration Cake';
  const desc = descEl ? descEl.textContent.trim() : 'Freshly baked artisanal cake with pure vegetarian ingredients.';
  const price = priceValEl ? priceValEl.textContent.trim().replace(/,/g, '') : '600';
  const category = catBadgeEl ? catBadgeEl.textContent.trim() : 'Half Kg Cake';
  const flavour = flavBadgeEl ? flavBadgeEl.textContent.trim() : 'Artisan Flavour';
  const eventName = eventTagEl ? eventTagEl.textContent.trim() : "Teacher's Day";

  // Store in global modal state
  activeModalData = {
    name,
    price,
    category,
    flavour,
    collection: eventName.includes("Janmashtami") ? "Krishna Janmashtami" : "Teacher's Day"
  };

  // Populate Modal
  const mImg = document.getElementById('modalProductImg');
  const mTitle = document.getElementById('modalProductName');
  const mDesc = document.getElementById('modalProductDesc');
  const mPrice = document.getElementById('modalProductPrice');
  const mEvent = document.getElementById('modalEventBadge');
  const mCat = document.getElementById('modalCategoryPill');
  const mFlav = document.getElementById('modalFlavourPill');
  const mMsgInput = document.getElementById('modalCustomMsgInput');

  if (mImg) mImg.src = imgSrc;
  if (mTitle) mTitle.textContent = name;
  if (mDesc) mDesc.textContent = `${desc} Prepared in a 100% vegetarian sanctified kitchen with fresh dairy cream, real butter, and premium ingredients.`;
  if (mPrice) mPrice.textContent = `₹${priceValEl ? priceValEl.textContent.trim() : price}`;
  if (mEvent) mEvent.textContent = eventName;
  if (mCat) mCat.textContent = category;
  if (mFlav) mFlav.textContent = flavour;
  if (mMsgInput) mMsgInput.value = '';

  modal.showModal();
};

window.submitModalOrder = function() {
  const mMsgInput = document.getElementById('modalCustomMsgInput');
  const customMessage = mMsgInput && mMsgInput.value.trim() ? mMsgInput.value.trim() : '';

  const waText = 
`🎂 *PRE-ORDER RESERVATION - THE BAKING SPOT*
━━━━━━━━━━━━━━━━━━━━
🍰 *Product:* *${activeModalData.name}*
✨ *Collection:* ${activeModalData.collection}
📦 *Category/Size:* ${activeModalData.category}
🍍 *Flavour:* ${activeModalData.flavour}
💰 *Price:* ₹${activeModalData.price}
🌱 *Dietary:* 100% Pure Veg & Eggless
⏰ *Notice:* Pre-ordered 4+ hours in advance
📍 *Delivery:* Prateek Grand City (Free Doorstep Society Delivery)
${customMessage ? `✍️ *Custom Message:* "${customMessage}"\n` : ''}━━━━━━━━━━━━━━━━━━━━
Hi The Baking Spot! Please confirm slot availability and delivery time.`;

  const waUrl = `https://wa.me/918440882334?text=${encodeURIComponent(waText)}`;
  window.open(waUrl, '_blank');
  
  const modal = document.getElementById('productModalDialog');
  if (modal) modal.close();
  showToast(`Opening WhatsApp for ${activeModalData.name}...`);
};

/* ==========================================================================
   4. Direct 1-Click WhatsApp Pre-Ordering
   ========================================================================== */
window.directWhatsAppOrder = function(productName, price, category, flavour, collection) {
  const waText = 
`🎂 *PRE-ORDER RESERVATION - THE BAKING SPOT*
━━━━━━━━━━━━━━━━━━━━
🍰 *Product:* *${productName}*
✨ *Collection:* ${collection}
📦 *Category/Size:* ${category}
🍍 *Flavour:* ${flavour}
💰 *Direct Price:* ₹${price}
🌱 *Dietary:* 100% Pure Veg & Eggless
⏰ *Notice:* Pre-ordered 4+ hours in advance
📍 *Delivery:* Prateek Grand City (Free Doorstep Society Delivery)
━━━━━━━━━━━━━━━━━━━━
Hi The Baking Spot! Please confirm slot availability and delivery time.`;

  const waUrl = `https://wa.me/918440882334?text=${encodeURIComponent(waText)}`;
  window.open(waUrl, '_blank');
  showToast(`Opening WhatsApp for ${productName}...`);
};

/* ==========================================================================
   5. Toast Notification
   ========================================================================== */
function showToast(msg) {
  const toast = document.getElementById('toastPopup');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
