// banner.js
import { createOptimizedPicture } from '../../scripts/aem.js'; // From AEM boilerplate (was lib-franklin.js)

/**
 * Decorates the banner block: Parses image URL and text, renders stacked layout.
 * @param {Element} block The banner block element
 */
export default async function decorate(block) {
  // Assume content from 2-row table or paragraphs: Row 1 = image URL, Row 2 = text
  const rows = block.querySelectorAll('div > div');
  if (rows.length < 2) {
    console.warn('Banner block needs at least 2 rows: image URL and text.');
    return;
  }

  // Extract image URL from first row (plain text)
  const imageUrl = rows[0].textContent.trim();
  rows[0].style.display = 'none'; // Hide original

  // Create optimized image if URL provided
  if (imageUrl) {
    try {
      const alt = block.dataset.alt || `Banner image for ${rows[1].textContent.substring(0, 50)}...`; // Auto-alt
      const picture = createOptimizedPicture(imageUrl, alt, true); // Eager load
      block.prepend(picture);
    } catch (error) {
      console.error('Failed to create banner image:', error);
      // Fallback: Use placeholder or skip
    }
  }

  // Extract and wrap text from second row
  const textEl = rows[1];
  if (textEl) {
    const textDiv = document.createElement('div');
    textDiv.classList.add('banner-text');
    textDiv.innerHTML = textEl.innerHTML; // Preserve rich text
    block.appendChild(textDiv);
    rows[1].style.display = 'none'; // Hide original
  }

  // Clean up empty rows
  rows.forEach(row => row.remove());

  // Mark as loaded
  block.dataset.blockStatus = 'loaded';
}