import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Go through each row in the authored table
  [...block.children].forEach((row) => {
    // Go through each cell in the row
    [...row.children].forEach((cell) => {
      const picture = cell.querySelector('picture');
      
      if (picture) {
        // This cell has the image. Add the 'promo-image' class.
        cell.classList.add('promo-image');
        
        // Optimize the image for responsiveness
        const img = picture.querySelector('img');
        cell.innerHTML = ''; // Clear the cell
        cell.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
      } else {
        // This cell has the text. Add the 'promo-body' class.
        cell.classList.add('promo-body');
      }
    });
  });
}