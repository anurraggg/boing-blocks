import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorates the doodle-card block.
 * Places a single image inside a styled frame.
 * @param {HTMLElement} block The doodle-card block element.
 */
export default async function decorate(block) {
  // Get the first data row (which is the only row)
  const row = block.children[0];
  if (!row) return; // No content, do nothing

  // Get the first cell (which is the only cell)
  const imageCell = row.children[0];
  if (!imageCell) return; // No cell, do nothing

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

  if (image) {
    // Create the inner container that will hold the image
    const imageContainer = document.createElement('div');
    imageContainer.className = 'doodle-card-image';
    imageContainer.append(image);

    // Clear the original, raw table HTML from the block
    block.innerHTML = '';
    
    // Append the new, structured image container
    block.append(imageContainer);
  } else {
    // If no valid image was found, just clear the block
    block.innerHTML = '';
  }
}