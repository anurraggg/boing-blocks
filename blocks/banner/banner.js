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

  console.log('Banner rows detected:', rows.length, 'Content preview:', rows.map(r => r.textContent.trim().substring(0, 30) + '...')); // Debug log

  let imageUrl = '';
  let textContent = '';

  // Auto-detect: Check if first row looks like URL (http, /, icons/, etc.)
  const urlPattern = /^(https?:\/\/|\/|\.\/|icons\/)/i;
  if (urlPattern.test(rows[0].textContent.trim())) {
    imageUrl = rows[0].textContent.trim();
    textContent = rows[1]?.textContent.trim() || '';
  } else if (rows.length >= 2 && urlPattern.test(rows[1].textContent.trim())) {
    // Swapped: Row 1=text, Row 2=URL
    textContent = rows[0].textContent.trim();
    imageUrl = rows[1].textContent.trim();
    console.log('Banner: Auto-swapped rows for URL detection.'); // Debug
  } else {
    // Only text? Use as text, no image
    textContent = rows[0].textContent.trim();
  }

  // Hide originals
  rows.forEach(row => row.style.display = 'none');

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
  if (textContent) {
    const textDiv = document.createElement('div');
    textDiv.classList.add('banner-text');
    textDiv.innerHTML = rows.find(r => r.textContent.trim() === textContent)?.innerHTML || textContent; // Preserve rich text
    block.appendChild(textDiv);
    console.log('Banner text added:', textContent.substring(0, 50) + '...'); // Debug
  }

  // Clean up
  rows.forEach(row => row.remove());

  // Mark loaded
  block.dataset.blockStatus = 'loaded';
}