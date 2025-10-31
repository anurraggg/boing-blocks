// blocks/poster-carousel/poster-carousel.js

import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length === 0) return;

  const firstRow = rows[0];
  const cells = [...firstRow.querySelectorAll(':scope > div')];
  const mediaUrls = cells.map(cell => cell.textContent.trim()).filter(url => url);

  if (mediaUrls.length === 0) {
    block.innerHTML = '<div class="placeholder">Add media URLs (image/video)</div>';
    return;
  }

  const textLines = ['BOLTE', 'SITARE', 'AAPKA', 'HOROSCOPE LEKIN THODA HATKE'];
  const buttonText = 'Know More';
  const buttonLink = '#';

  const slides = [];

  for (let mediaUrl of mediaUrls) {
    const slide = document.createElement('div');
    slide.className = 'poster-carousel';

    // Text overlay
    const textOverlay = document.createElement('div');
    textOverlay.className = 'text-overlay';
    textLines.forEach(line => {
      const lineEl = document.createElement('div');
      lineEl.className = 'text-line';
      lineEl.textContent = line;
      textOverlay.appendChild(lineEl);
    });

    // Media container
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-container';

    const mediaAlt = 'Carousel media';

    if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
      // YouTube
      const videoId = mediaUrl.split('v=')[1]?.split('&')[0] || mediaUrl.split('/').pop();
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&loop=1&playlist=${videoId}&controls=1`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.frameBorder = '0';
      iframe.title = mediaAlt;
      mediaContainer.appendChild(iframe);
    } 
    else if (mediaUrl.includes('vimeo.com')) {
      // Vimeo
      const videoId = mediaUrl.split('/').pop();
      const iframe = document.createElement('iframe');
      iframe.src = `https://player.vimeo.com/video/${videoId}?loop=1&muted=1`;
      iframe.allow = 'autoplay; fullscreen';
      iframe.frameBorder = '0';
      iframe.title = mediaAlt;
      mediaContainer.appendChild(iframe);
    } 
    else if (mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
      // Direct MP4/WebM
      const video = document.createElement('video');
      video.src = mediaUrl;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.loading = 'lazy';
      video.title = mediaAlt;
      video.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
      mediaContainer.appendChild(video);
    } 
    else if (mediaUrl.includes('scene7.com')) {
      // Scene7 Image
      let imgUrl = mediaUrl;
      if (!imgUrl.match(/\.(jpg|jpeg|png|webp)$/i)) {
        imgUrl = imgUrl.replace(/(\?|$)/, '.jpg$1');
      }
      const img = document.createElement('img');
      img.src = `${imgUrl}?wid=800&hei=600&fmt=webp&qlt=85&resMode=sharp2`;
      img.alt = mediaAlt;
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;box-shadow:0 0 30px rgba(255,255,255,0.6);';
      mediaContainer.appendChild(img);
    } 
    else {
      // Regular image fallback
      try {
        const picture = createOptimizedPicture(mediaUrl, mediaAlt, false, [
          { width: '800' }, { width: '400' }
        ]);
        mediaContainer.appendChild(picture);
      } catch (e) {
        const img = document.createElement('img');
        img.src = mediaUrl;
        img.alt = mediaAlt;
        img.loading = 'lazy';
        mediaContainer.appendChild(img);
      }
    }

    // Icons
    const icons = document.createElement('div');
    icons.className = 'icons';
    const sun = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sun.setAttribute('viewBox', '0 0 40 40');
    sun.setAttribute('class', 'icon');
    sun.innerHTML = '<circle cx="20" cy="20" r="18" fill="#FFD700"/><g stroke="#fff" stroke-width="2"><circle cx="20" cy="20" r="8"/><circle cx="20" cy="4" r="2"/><circle cx="20" cy="36" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="36" cy="20" r="2"/></g>';
    const moon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    moon.setAttribute('viewBox', '0 0 40 40');
    moon.setAttribute('class', 'icon');
    moon.innerHTML = '<path d="M20 2C9.1 2 0 11.1 0 22s9.1 20 20 20 20-9.1 20-20S30.9 2 20 2zm0 36c-8.8 0-16-7.2-16-16S11.2 6 20 6s16 7.2 16 16-7.2 16-16 16z" fill="#FFD700" opacity="0.8"/>';
    icons.append(sun, moon);

    // Button
    const button = document.createElement('a');
    button.className = 'know-more-btn';
    button.href = buttonLink;
    button.textContent = buttonText;
    button.setAttribute('aria-label', 'Know more');

    // Assemble
    const border = document.createElement('div');
    border.className = 'ornate-border';
    slide.append(border, textOverlay, mediaContainer, icons, button);
    slides.push(slide);
  }

  block.innerHTML = '';
  block.classList.add('poster-carousel-container');

  if (slides.length === 1) {
    slides[0].classList.add('single-slide');
    block.appendChild(slides[0]);
  } else {
    buildCarousel(block, slides);
  }
}

function buildCarousel(container, slides) {
  const root = document.createElement('div');
  root.className = 'carousel-root';
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'carousel-slides';

  slides.forEach(slide => {
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-slide';
    wrapper.appendChild(slide);
    slidesContainer.appendChild(wrapper);
  });
  root.appendChild(slidesContainer);

  const nav = document.createElement('div');
  nav.className = 'carousel-nav';
  const prev = document.createElement('button');
  prev.className = 'carousel-arrow';
  prev.innerHTML = 'Previous';
  prev.setAttribute('aria-label', 'Previous');
  const next = document.createElement('button');
  next.className = 'carousel-arrow';
  next.innerHTML = 'Next';
  next.setAttribute('aria-label', 'Next');
  nav.append(prev, next);
  root.appendChild(nav);

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
  });
  root.appendChild(dots);

  container.appendChild(root);

  let idx = 0;
  const total = slides.length;

  function update() {
    slidesContainer.style.transform = `translateX(-${idx * 100}%)`;
    dots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function goTo(i) {
    idx = (i + total) % total;
    update();
  }

  prev.addEventListener('click', () => goTo(idx - 1));
  next.addEventListener('click', () => goTo(idx + 1));
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(idx - 1);
    if (e.key === 'ArrowRight') goTo(idx + 1);
  });

  update();
}