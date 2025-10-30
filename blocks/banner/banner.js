// banner.js
import { createOptimizedPicture } from '../../scripts/aem.js'; // From AEM boilerplate

/**
 * Decorates the banner block: Parses image URL and text, auto-detects order for flexibility.
 * @param {Element} block The banner block element
 */
export default async function decorate(block) {
  // Get rows (assumes table: div.row > div.cell; falls back to direct children for paragraphs)
  let rows = block.querySelectorAll('div > div');
  if (rows.length === 0) {
    // Fallback: Direct children (e.g., paragraphs)
    rows = [...block.children].filter(child => child.tagName === 'P' || child.tagName === 'DIV');
  }

  if (rows.length < 1) {
    console.warn('Banner block needs at least 1 row/child: image URL or text.');
    return;
  }

  // Convert to Array for .map/.find compatibility
  const rowArray = [...rows];

  console.log('Banner rows detected:', rowArray.length, 'Content preview:', rowArray.map(r => r.textContent.trim().substring(0, 30) + '...')); // Debug log

  let imageUrl = '';
  let textContent = '';
  let textRow = null; // Track for innerHTML

  // Auto-detect: Check if first row looks like URL (http, /, icons/, etc.)
  const urlPattern = /^(https?:\/\/|\/|\.\/|icons\/)/i;
  if (urlPattern.test(rows[0].textContent.trim())) {
    imageUrl = rows[0].textContent.trim();
    textRow = rows[1];
    textContent = textRow ? textRow.textContent.trim() : '';
  } else if (rows.length >= 2 && urlPattern.test(rows[1].textContent.trim())) {
    // Swapped: Row 1=text, Row 2=URL
    textRow = rows[0];
    textContent = textRow ? textRow.textContent.trim() : '';
    imageUrl = rows[1].textContent.trim();
    console.log('Banner: Auto-swapped rows for URL detection.'); // Debug
  } else {
    // Only text? Use as text, no image
    textRow = rows[0];
    textContent = textRow ? textRow.textContent.trim() : '';
  }

  // Hide originals
  rowArray.forEach(row => row.style.display = 'none');

  // Create image if URL valid
  if (imageUrl) {
    try {
      const alt = block.dataset.alt || `Banner image${textContent ? ` for ${textContent.substring(0, 50)}` : ''}`.trim();
      const picture = createOptimizedPicture(imageUrl, alt, true); // Eager load
      block.prepend(picture);
      console.log('Banner image created:', imageUrl); // Debug
    } catch (error) {
      console.error('Failed to create banner image:', error, imageUrl);
    }
  }

  // Add text div if content
  if (textContent && textRow) {
    const textDiv = document.createElement('div');
    textDiv.classList.add('banner-text');
    textDiv.innerHTML = textRow.innerHTML; // Preserve rich text from the correct row
    block.appendChild(textDiv);
    console.log('Banner text added:', textContent.substring(0, 50) + '...'); // Debug
  }

  // Clean up
  rowArray.forEach(row => row.remove());

  // Mark loaded
  block.dataset.blockStatus = 'loaded';
}