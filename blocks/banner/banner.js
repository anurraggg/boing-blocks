// banner.js
import { createOptimizedPicture } from '../../scripts/aem.js'; // From AEM boilerplate

/**
 * Decorates the banner block: Parses image URL and text, auto-detects order for flexibility.
 * @param {Element} block The banner block element
 */
export default async function decorate(block) {
  console.log('Banner decorate started for block:', block); // Debug: Confirm entry

  // Get rows: Prioritize table cells, fallback to children
  let rows = block.querySelectorAll('div > div'); // Table rows
  if (rows.length === 0) {
    rows = Array.from(block.children).filter(child => 
      child.tagName === 'P' || child.tagName === 'DIV' || child.tagName === 'H1' || child.tagName === 'H2'
    ); // Paragraphs/headings
  }

  const rowArray = Array.from(rows); // Always convert to Array

  console.log('Banner rows detected:', rowArray.length, 
    'Full HTML preview:', rowArray.map(r => ({ tag: r.tagName, text: r.textContent.trim().substring(0, 50) + '...' }))); // Detailed debug

  if (rowArray.length === 0) {
    console.warn('Banner: No rows/children found—rendering block as-is.');
    block.dataset.blockStatus = 'loaded';
    return;
  }

  let imageUrl = '';
  let textRow = null;
  let textContent = '';

  // Auto-detect URL (first/last row that matches pattern)
  const urlPattern = /^(https?:\/\/|\/|\.\/|icons\/)/i;
  const urlRowIndex = rowArray.findIndex(row => urlPattern.test(row.textContent.trim()));
  
  if (urlRowIndex !== -1) {
    imageUrl = rowArray[urlRowIndex].textContent.trim();
    // Text is everything else
    textRow = rowArray.find(row => row !== rowArray[urlRowIndex]);
    textContent = textRow ? textRow.textContent.trim() : '';
    console.log(`Banner: URL found at index ${urlRowIndex}, imageUrl: ${imageUrl.substring(0, 50)}...`);
  } else {
    // No URL: Treat first as text, rest as fallback
    textRow = rowArray[0];
    textContent = textRow ? textRow.textContent.trim() : '';
    console.log('Banner: No URL detected—using as text-only.');
  }

  // Create image if URL valid (do this first, no hiding yet)
  if (imageUrl) {
    try {
      const alt = block.dataset.alt || (textContent ? `Banner image for ${textContent.substring(0, 50)}...` : 'Banner image');
      const picture = createOptimizedPicture(imageUrl, alt, true); // Eager load
      block.prepend(picture);
      console.log('Banner: Image prepended successfully.');
    } catch (error) {
      console.error('Banner: Failed to create image:', error, imageUrl);
    }
  }

  // Add text if available (append after image)
  if (textContent && textRow) {
    const textDiv = document.createElement('div');
    textDiv.classList.add('banner-text');
    textDiv.innerHTML = textRow.innerHTML; // Preserve formatting
    block.appendChild(textDiv);
    console.log('Banner: Text appended:', textContent.substring(0, 50) + '...');
  } else if (rowArray.length > 0) {
    // Fallback: Append all original children if no text detected
    console.log('Banner: Fallback—appending original content.');
    rowArray.forEach(child => block.appendChild(child.cloneNode(true)));
  }

  // NOW hide/remove originals (only if we added something)
  if (imageUrl || textContent) {
    rowArray.forEach(row => {
      if (row.parentNode) row.remove();
    });
  }

  console.log('Banner decorate complete.'); // Debug end
  block.dataset.blockStatus = 'loaded';
}