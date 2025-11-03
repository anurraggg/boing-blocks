// blocks/header/header.js
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  console.log('HEADER DECORATE: STARTED', block);

  if (block.dataset.ready) return;
  block.dataset.ready = 'true';

  const cells = block.querySelectorAll(':scope > div > div');
  console.log('HEADER DECORATE: Cells found →', cells.length);

  if (cells.length < 3) {
    console.warn('HEADER DECORATE: Expected 3 cells');
    return;
  }

  const logoCell = cells[1];
  const img = logoCell.querySelector('img');
  if (img) {
    console.log('HEADER DECORATE: Image src →', img.src);
    const picture = createOptimizedPicture(img.src, 'Logo', false);
    img.replaceWith(picture);
  }

  // Hamburger
  const menu = document.createElement('div');
  menu.className = 'header-menu-icon';
  menu.innerHTML = '<span></span><span></span><span></span>';
  block.prepend(menu);

  // Link
  const link = document.createElement('a');
  link.href = '/';
  while (logoCell.firstChild) link.appendChild(logoCell.firstChild);
  logoCell.appendChild(link);

  // Login
  const login = document.createElement('button');
  login.className = 'header-login-button';
  login.textContent = 'Login';
  block.append(login);

  block.classList.add('header-layout');
  console.log('HEADER DECORATE: DONE');
}