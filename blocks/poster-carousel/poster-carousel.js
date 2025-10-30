// blocks/poster-carousel/poster-carousel.js

import { createOptimizedPicture } from '../../scripts/aem.js';

// eslint-disable-next-line no-unused-vars
export default async function decorate(block) {
  // Parse single-row table: Extract URLs from cells in the first row
  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length === 0) return;

  const firstRow = rows[0];
  const cells = [...firstRow.querySelectorAll(':scope > div')];
  const mediaUrls = cells
    .map(cell => cell.textContent.trim())
    .filter(url => url);

  if (mediaUrls.length === 0) {
    block.innerHTML = '<div class="placeholder">Add media URLs to table cells (one per column)</div>';
    return;
  }

  // Hardcoded text lines (as per design)
  const textLines = [
    'BOLTE',
    'SITARE', 
    'AAPKA',
    'HOROSCOPE LEKIN THODA HATKE'
  ];

  // Hardcoded button
  const buttonText = 'Know More';
  const buttonLink = '#';

  // Build individual slides
  const slides = [];
  for (const mediaUrl of mediaUrls) {
    const slide = document.createElement('div');
    slide.className = 'poster-carousel';

    // Text overlay
    const textOverlay = document.createElement('div');
    textOverlay.className = 'text-overlay';
    textLines.forEach((line) => {
      const textLine = document.createElement('div');
      textLine.className = 'text-line';
      textLine.textContent = line;
      textOverlay.appendChild(textLine);
    });

    // 🔥 FIXED: Smart media handling for Scene7 + regular images/videos
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-container';
    const mediaAlt = 'Poster carousel slide';

    if (mediaUrl.includes('youtube.com') || mediaUrl.includes('vimeo.com')) {
      // YouTube/Vimeo iframe
      const iframe = document.createElement('iframe');
      iframe.src = mediaUrl.replace('watch?v=', 'embed/').replace('/v/', '/video/');
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      mediaContainer.appendChild(iframe);
    } else if (mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
      // Direct video
      const video = document.createElement('video');
      video.src = mediaUrl;
      video.autoplay = false;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.loading = 'lazy';
      video.title = mediaAlt;
      mediaContainer.appendChild(video);
    } else if (mediaUrl.includes('scene7.com') || mediaUrl.includes('/is/content/') || mediaUrl.includes('/is/image/')) {
      // 🔥 SCENE7 SPECIAL HANDLING - Use <img> with Scene7 params
      const img = document.createElement('img');
      img.src = `${mediaUrl}?wid=800&fmt=webp&qlt=90&op_sharpen=0&resMode=sharp2`;
      img.alt = mediaAlt;
      img.loading = 'lazy';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      mediaContainer.appendChild(img);
    } else {
      // Regular images - Use createOptimizedPicture (AEM optimization)
      try {
        const picture = createOptimizedPicture(mediaUrl, mediaAlt, false, [
          { media: '(min-width: 600px)', width: '800' },
          { width: '400' }
        ]);
        mediaContainer.appendChild(picture);
      } catch (e) {
        // Fallback: Simple img
        const img = document.createElement('img');
        img.src = mediaUrl;
        img.alt = mediaAlt;
        img.loading = 'lazy';
        mediaContainer.appendChild(img);
      }
    }

    // Icons (sun/moon) - FIXED SVG class
    const icons = document.createElement('div');
    icons.className = 'icons';

    const sunIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sunIcon.setAttribute('viewBox', '0 0 40 40');
    sunIcon.setAttribute('class', 'icon');
    sunIcon.innerHTML = '<circle cx="20" cy="20" r="18" fill="#FFD700"/><g stroke="#fff" stroke-width="2"><circle cx="20" cy="20" r="8"/><circle cx="20" cy="4" r="2"/><circle cx="20" cy="36" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="36" cy="20" r="2"/><line x1="20" y1="0" x2="20" y2="4"/><line x1="20" y1="36" x2="20" y2="40"/><line x1="0" y1="20" x2="4" y2="20"/><line x1="36" y1="20" x2="40" y2="20"/></g>';

    const moonIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    moonIcon.setAttribute('viewBox', '0 0 40 40');
    moonIcon.setAttribute('class', 'icon');
    moonIcon.innerHTML = '<path d="M20 2C9.1 2 0 11.1 0 22s9.1 20 20 20 20-9.1 20-20S30.9 2 20 2zm0 36c-8.8 0-16-7.2-16-16S11.2 6 20 6s16 7.2 16 16-7.2 16-16 16z" fill="#FFD700" opacity="0.8"/>';

    icons.append(sunIcon, moonIcon);

    // Button
    const button = document.createElement('a');
    button.className = 'know-more-btn';
    button.href = buttonLink;
    button.textContent = buttonText;
    button.setAttribute('aria-label', 'Know more about horoscope');

    // Assemble slide
    const border = document.createElement('div');
    border.className = 'ornate-border';
    slide.appendChild(border);
    slide.append(textOverlay, mediaContainer, icons, button);
    slides.push(slide);
  }

  // Clear & build carousel
  block.innerHTML = '';
  block.classList.add('poster-carousel-container');

  if (slides.length === 1) {
    const singleSlide = slides[0];
    singleSlide.classList.add('single-slide');
    block.appendChild(singleSlide);
  } else {
    buildCarousel(block, slides);
  }
}

// Carousel logic (unchanged)
function buildCarousel(container, slides) {
  const carouselRoot = document.createElement('div');
  carouselRoot.className = 'carousel-root';
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'carousel-slides';
  
  slides.forEach(slide => {
    const slideWrapper = document.createElement('div');
    slideWrapper.className = 'carousel-slide';
    slideWrapper.appendChild(slide);
    slidesContainer.appendChild(slideWrapper);
  });
  carouselRoot.appendChild(slidesContainer);

  // Navigation arrows
  const nav = document.createElement('div');
  nav.className = 'carousel-nav';
  const prevArrow = document.createElement('button');
  prevArrow.className = 'carousel-arrow';
  prevArrow.innerHTML = '❮';
  prevArrow.setAttribute('aria-label', 'Previous slide');
  const nextArrow = document.createElement('button');
  nextArrow.className = 'carousel-arrow';
  nextArrow.innerHTML = '❯';
  nextArrow.setAttribute('aria-label', 'Next slide');
  nav.append(prevArrow, nextArrow);
  carouselRoot.appendChild(nav);

  // Dots
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  carouselRoot.appendChild(dotsContainer);

  container.appendChild(carouselRoot);

  let currentIndex = 0;
  const totalSlides = slides.length;

  function updateCarousel() {
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    [...dotsContainer.children].forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    updateCarousel();
  }

  prevArrow.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextArrow.addEventListener('click', () => goToSlide(currentIndex + 1));

  carouselRoot.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
  });

  updateCarousel();
}