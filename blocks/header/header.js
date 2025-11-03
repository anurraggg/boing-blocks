// blocks/header/header.js
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  console.log('HEADER DECORATE: STARTED', block);

  if (block.dataset.headerReady) {
    console.log('HEADER DECORATE: Already decorated');
    return;
  }
  block.dataset.headerReady = 'true';

  // === 1. Get the 3 cells from the 1×3 table in nav.docx ===
  const cells = block.querySelectorAll(':scope > div > div');
  console.log('HEADER DECORATE: Found cells →', cells.length, cells);

  if (cells.length < 3) {
    console.warn('HEADER DECORATE: Expected 3 cells. Is nav.docx a 1×3 table?');
    return;
  }

  const logoCell = cells[1]; // middle cell
  console.log('HEADER DECORATE: Middle cell →', logoCell);

  // === 2. Find <img> in middle cell ===
  const img = logoCell.querySelector('img');
  console.log('HEADER DECORATE: Found <img> →', img);

  if (!img) {
    console.warn('HEADER DECORATE: No <img> in middle cell. Did you paste the image?');
  } else {
    console.log('HEADER DECORATE: Image src →', img.src);
    const picture = createOptimizedPicture(img.src, 'Logo', false);
    img.replaceWith(picture);
    console.log('HEADER DECORATE: Replaced with <picture>');
  }

  // === 3. Add hamburger (left) ===
  const menu = document.createElement('div');
  menu.className = 'header-menu-icon';
  menu.innerHTML = '<span></span><span></span><span></span>';
  block.prepend(menu);
  console.log('HEADER DECORATE: Hamburger added');

  // === 4. Wrap logo in <a href="/"> ===
  const link = document.createElement('a');
  link.href = '/';
  while (logoCell.firstChild) {
    link.appendChild(logoCell.firstChild);
  }
  logoCell.appendChild(link);
  console.log('HEADER DECORATE: Logo linked to /');

  // === 5. Add login button (right) ===
  const login = document.createElement('button');
  login.className = 'header-login-button';
  login.textContent = 'Login';
  block.append(login);
  console.log('HEADER DECORATE: Login button added');

  // === 6. Add layout class ===
  block.classList.add('header-layout');
  console.log('HEADER DECORATE: Layout class added');
  console.log('HEADER DECORATE: FINAL BLOCK →', block.innerHTML);
}