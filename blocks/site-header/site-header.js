import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  console.log('site-header: decorate started');

  // === 1. Get the 3 cells ===
  const cells = block.querySelectorAll(':scope > div > div');
  if (cells.length < 3) {
    console.warn('site-header: expected 3 cells');
    return;
  }

  const logoCell = cells[1];
  const img = logoCell.querySelector('img');

  // === 2. Optimize image ===
  if (img) {
    const picture = createOptimizedPicture(img.src, 'Logo', false);
    img.replaceWith(picture);
  }

  // === 3. Add hamburger ===
  const menu = document.createElement('div');
  menu.className = 'site-header-menu-icon';
  menu.innerHTML = '<span></span><span></span><span></span>';
  block.prepend(menu);

  // === 4. Wrap logo in home link ===
  const link = document.createElement('a');
  link.href = '/';
  while (logoCell.firstChild) link.appendChild(logoCell.firstChild);
  logoCell.appendChild(link);

  // === 5. Add login button ===
  const login = document.createElement('button');
  login.className = 'site-header-login-button';
  login.textContent = 'Login';
  block.append(login);

  // === 6. Add layout class ===
  block.classList.add('site-header-layout');
  console.log('site-header: decoration complete');
}