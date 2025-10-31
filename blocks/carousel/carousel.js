/**
 * Tries to extract a YouTube video ID and construct an embed URL.
 * @param {string} url The URL to check.
 * @returns {string|null} The embed URL or null.
 */
 function getYoutubeEmbedUrl(url) {
  let embedUrl = null;
  try {
    const urlObj = new URL(url);
    const { hostname, pathname, searchParams } = urlObj;

    let videoId = null;

    if (hostname.includes('youtube.com')) {
      // Standard watch link: https://www.youtube.com/watch?v=VIDEO_ID
      videoId = searchParams.get('v');
    } else if (hostname.includes('youtu.be')) {
      // Short link: https://youtu.be/VIDEO_ID
      videoId = pathname.substring(1); // Remove the leading '/'
    }

    if (videoId) {
      // Note: autoplay is required for carousels, which also requires mute.
      // loop=1&playlist=VIDEO_ID is the standard way to loop an embedded video.
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error parsing YouTube URL:', e);
  }
  return embedUrl;
}

/**
 * Creates the decorative side borders with lights.
 * @param {'left' | 'right'} side Which border to create.
 * @returns {HTMLDivElement} The border element with lights.
 */
function createShowbizBorder(side) {
  const border = document.createElement('div');
  border.className = `carousel-border carousel-border-${side}`;
  for (let i = 0; i < 15; i += 1) {
    const light = document.createElement('div');
    light.className = 'carousel-light';
    border.append(light);
  }
  return border;
}

/**
 * Updates the carousel to show a specific slide.
 * @param {HTMLElement} block The carousel block element.
 * @param {number} newIndex The index of the slide to show.
 * @param {number} totalSlides The total number of slides.
 */
function showSlide(block, newIndex, totalSlides) {
  const slider = block.querySelector('.carousel-slider');
  const dots = block.querySelectorAll('.carousel-dot');
  
  const currentIndex = parseInt(block.dataset.currentIndex, 10);

  // Remove active state from current slide and dot
  slider.children[currentIndex].classList.remove('active');
  dots[currentIndex].classList.remove('active');

  // Calculate the new index, wrapping around
  // eslint-disable-next-line no-param-reassign
  newIndex = (newIndex + totalSlides) % totalSlides;

  // Add active state to new slide and dot
  slider.children[newIndex].classList.add('active');
  dots[newIndex].classList.add('active');
  
  slider.style.transform = `translateX(-${newIndex * 100}%)`;
  block.dataset.currentIndex = newIndex;
}

export default async function decorate(block) {
  const slider = document.createElement('div');
  slider.className = 'carousel-slider';

  const slides = [...block.children];
  const totalSlides = slides.length;

  slides.forEach((row, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    
    const link = row.querySelector('a');
    
    // Check if the cell content is JUST a link
    if (link && row.textContent.trim() === link.textContent.trim()) {
      const href = link.href;
      const youtubeEmbedUrl = getYoutubeEmbedUrl(href); // Check for YouTube link

      if (href.endsWith('.mp4')) {
        // --- MP4 Video Slide ---
        slide.classList.add('carousel-slide-video');
        const video = document.createElement('video');
        video.src = href;
        video.playsinline = true;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.setAttribute('aria-label', 'carousel video slide');
        slide.append(video);
      
      } else if (youtubeEmbedUrl) {
        // --- YouTube Video Slide ---
        slide.classList.add('carousel-slide-youtube');
        const iframe = document.createElement('iframe');
        iframe.src = youtubeEmbedUrl;
        iframe.width = '560'; // Will be overridden by CSS
        iframe.height = '315'; // Will be overridden by CSS
        iframe.title = 'YouTube video player';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowfullscreen = true;
        slide.append(iframe);
      
      } else {
        // It's a link, but not a recognized video format, treat as content
        slide.append(...row.children);
      }
    } else {
      // --- Standard Content Slide (image, text, etc.) ---
      slide.append(...row.children);
    }
    
    if (index === 0) {
      slide.classList.add('active');
    }
    slider.append(slide);
  });
  
  // Clear the original authored content
  block.innerHTML = '';
  // Add the slider, borders, and controls
  block.append(createShowbizBorder('left'));
  block.append(slider);
  block.append(createShowbizBorder('right'));

  // Store the current index
  block.dataset.currentIndex = 0;

  // Create and add Navigation Arrows
  const prevArrow = document.createElement('button');
  prevArrow.className = 'carousel-arrow carousel-arrow-prev';
  prevArrow.setAttribute('aria-label', 'Previous Slide');
  prevArrow.addEventListener('click', () => {
    const currentIndex = parseInt(block.dataset.currentIndex, 10);
    showSlide(block, currentIndex - 1, totalSlides);
  });

  const nextArrow = document.createElement('button');
  nextArrow.className = 'carousel-arrow carousel-arrow-next';
  nextArrow.setAttribute('aria-label', 'Next Slide');
  nextArrow.addEventListener('click', () => {
    const currentIndex = parseInt(block.dataset.currentIndex, 10);
    showSlide(block, currentIndex + 1, totalSlides);
  });

  // Create and add Pagination Dots
  const dotsWrapper = document.createElement('div');
  dotsWrapper.className = 'carousel-dots';
  
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    
    dot.addEventListener('click', () => {
      showSlide(block, index, totalSlides);
    });
    
    dotsWrapper.append(dot);
  });

  block.append(prevArrow, nextArrow, dotsWrapper);
}