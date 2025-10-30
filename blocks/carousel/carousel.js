// carousel.js
import { createOptimizedPicture, loadScript } from '../../scripts/aem.js'; // From AEM boilerplate

let swiperLoaded = false;

/**
 * Loads Swiper if not already loaded.
 */
async function loadSwiper() {
  if (swiperLoaded) return;
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  swiperLoaded = true;
}

/**
 * Decorates the carousel block: Parses table rows into slides, detects media type, inits Swiper.
 * @param {Element} block The carousel block element
 */
export default async function decorate(block) {
  await loadSwiper();

  // Parse rows from table (div > div for cells)
  const rows = block.querySelectorAll('div > div');
  if (rows.length < 1) {
    console.warn('Carousel needs at least one row.');
    return;
  }

  const slides = [];
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('div > div'); // Cells in row
    if (cells.length >= 1) {
      const mediaUrl = cells[0].textContent.trim();
      const title = cells[1]?.textContent.trim() || '';
      const desc = cells[2]?.textContent.trim() || '';

      if (mediaUrl) {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');

        // Detect image vs video
        const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
        let mediaEl;

        if (isVideo) {
          mediaEl = document.createElement('video');
          mediaEl.src = mediaUrl;
          mediaEl.muted = true;
          mediaEl.loop = true;
          mediaEl.autoplay = true;
          mediaEl.playsInline = true; // Mobile
          mediaEl.poster = title ? undefined : ''; // Optional poster
        } else {
          // Image: Use optimized picture
          mediaEl = createOptimizedPicture(mediaUrl, desc || title, false, ['300w', '600w']); // Lazy except first
          if (rowIndex === 0) mediaEl.querySelector('img').loading = 'eager';
        }

        slide.appendChild(mediaEl);

        // Add overlay content if title/desc
        if (title || desc) {
          const content = document.createElement('div');
          content.classList.add('slide-content');
          content.innerHTML = `
            ${title ? `<h3 class="slide-title">${title}</h3>` : ''}
            ${desc ? `<p class="slide-desc">${desc}</p>` : ''}
          `;
          slide.appendChild(content);
        }

        slides.push(slide);
      }
    }
  });

  // Clear originals
  rows.forEach(r => r.remove());

  if (slides.length === 0) return;

  // Build Swiper structure
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper');
  swiperEl.innerHTML = `
    <div class="swiper-wrapper">
      ${slides.map(slide => `<div class="swiper-slide">${slide.innerHTML}</div>`).join('')}
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  `;
  block.appendChild(swiperEl);

  // Init Swiper
  const autoplay = block.dataset.autoplay !== 'false';
  new window.Swiper(swiperEl, { // Swiper global
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: autoplay ? { delay: 3000, disableOnInteraction: false } : false,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    keyboard: { enabled: true },
    a11y: { enabled: true, prevSlideMessage: 'Previous slide', nextSlideMessage: 'Next slide' },
  });

  block.dataset.blockStatus = 'loaded';
}