function createVideoSlide(row) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide carousel-slide-video';
    const videoLink = row.querySelector('a[href$=".mp4"]');
  
    if (videoLink) {
      const video = document.createElement('video');
      video.src = videoLink.href;
      video.playsinline = true;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.setAttribute('aria-label', 'carousel video slide');
      slide.append(video);
    }
    return slide;
  }
  
  /**
   * Creates a standard content slide (e.g., for images and text).
   * @param {HTMLDivElement} row The authored table row.
   * @returns {HTMLDivElement} A slide element with its content.
   */
  function createContentSlide(row) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    // Move all content from the authored row into the new slide div
    slide.append(...row.children);
    return slide;
  }
  
  /**
   * Creates the decorative side borders with lights.
   * @param {'left' | 'right'} side Which border to create.
   * @returns {HTMLDivElement} The border element with lights.
   */
  function createShowbizBorder(side) {
    const border = document.createElement('div');
    border.className = `carousel-border carousel-border-${side}`;
    // Add 15 lights to each border
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
    
    // Get the current index from the block's data attribute
    let currentIndex = parseInt(block.dataset.currentIndex, 10);
  
    // Remove active state from current slide and dot
    slider.children[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
  
    // Calculate the new index, wrapping around if necessary
    // eslint-disable-next-line no-param-reassign
    newIndex = (newIndex + totalSlides) % totalSlides;
  
    // Add active state to new slide and dot
    slider.children[newIndex].classList.add('active');
    dots[newIndex].classList.add('active');
    
    // Move the slider track
    slider.style.transform = `translateX(-${newIndex * 100}%)`;
    
    // Store the new index
    block.dataset.currentIndex = newIndex;
  }
  
  export default async function decorate(block) {
    const slider = document.createElement('div');
    slider.className = 'carousel-slider';
  
    const slides = [...block.children];
    const totalSlides = slides.length;
  
    slides.forEach((row, index) => {
      let slide;
      // Check if the row contains a video link
      const videoLink = row.querySelector('a[href$=".mp4"]');
      
      if (videoLink && row.textContent.trim() === videoLink.textContent.trim()) {
        slide = createVideoSlide(row);
      } else {
        slide = createContentSlide(row);
      }
      
      // Set the first slide as active
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