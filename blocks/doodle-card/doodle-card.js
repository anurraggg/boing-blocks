import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';

/**
 * Decorates the doodle-card block.
 * Places a single image inside a styled frame.
 * @param {HTMLElement} block The doodle-card block element.
 */
export default async function decorate(block) {
  // Get the first data row (which is the only row)
  const row = block.children[0];
  if (!row) return; // No content, do nothing

  // Get the cells from the row
  const [imageCell, titleCell, descCell] = row.children;
  if (!imageCell) return; // No image cell, do nothing

  // --- START: Your existing image logic (UNTOUCHED) ---
  // 1. Check for an inserted image (a <picture> tag)
  let image = imageCell.querySelector('picture');

  if (!image) {
    // 2. If no inserted image, check for a text path
    const imagePath = imageCell.textContent.trim();
    const isImagePath = imagePath && (imagePath.endsWith('.png') || imagePath.endsWith('.jpeg') || imagePath.endsWith('.jpg') || imagePath.endsWith('.svg') || imagePath.endsWith('.webp'));
    
    if (isImagePath) {
      // It's a path. Create an optimized picture.
      // We pass 'high' quality optimization as these are often graphics.
      image = createOptimizedPicture(imagePath, 'Doodle Card Image', false, undefined, 'high');
    }
  }

  let imageContainer;
  if (image) {
    // Create the inner container that will hold the image
    imageContainer = document.createElement('div');
    imageContainer.className = 'doodle-card-image';
    imageContainer.append(image);
  }
  // --- END: Your existing image logic ---

  // --- START: New content logic ---
  const contentContainer = document.createElement('div');
  contentContainer.className = 'doodle-card-content';

  // 2. Create Title
  if (titleCell && titleCell.textContent.trim()) {
    const title = document.createElement('h3');
    title.className = 'doodle-card-title';
    title.append(...titleCell.childNodes);
    contentContainer.append(title);
  }

  // 3. Create Description
  if (descCell && descCell.textContent.trim()) {
    const description = document.createElement('p');
    description.className = 'doodle-card-description';
    description.append(...descCell.childNodes);
    contentContainer.append(description);
  }

  // 4. Create Share Button
  const shareButton = document.createElement('button');
  shareButton.className = 'doodle-card-share-button';
  // Add icon markup for decorateIcons to find
  shareButton.innerHTML = '<span class="icon icon-share"></span>Share Now';
  
  // Add click listener for Web Share API
  shareButton.addEventListener('click', async () => {
    const shareData = {
      title: document.title,
      text: titleCell.textContent.trim() || document.title,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback for desktop or unsupported browsers
        await navigator.clipboard.writeText(window.location.href);
        // eslint-disable-next-line no-alert
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Share failed:', err);
    }
  });

  contentContainer.append(shareButton);
  
  // Call decorateIcons to load the SVG
  decorateIcons(contentContainer);
  // --- END: New content logic ---

  // Clear the original, raw table HTML from the block
  block.innerHTML = '';
  
  // Append the new, structured elements
  if (imageContainer) {
    block.append(imageContainer);
  }
  block.append(contentContainer);
}