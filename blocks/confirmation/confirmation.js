import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Get all rows except the first one (block name)
  const rows = [...block.children].slice(1);

  // Row 0: Icon
  const iconRow = rows[0];
  if (iconRow) {
    iconRow.classList.add('confirmation-icon');
    const picture = iconRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      // Optimize image, 128px is a good size for an icon
      iconRow.innerHTML = '';
      iconRow.append(createOptimizedPicture(img.src, img.alt, true, [{ width: '128' }]));
    }
  }

  // Row 1: Heading
  const headingRow = rows[1];
  if (headingRow) {
    headingRow.classList.add('confirmation-heading');
  }

  // Row 2: Body
  const bodyRow = rows[2];
  if (bodyRow) {
    bodyRow.classList.add('confirmation-body');
  }
}