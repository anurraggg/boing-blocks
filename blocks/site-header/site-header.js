import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  if (block.dataset.ready) return;
  block.dataset.ready = 'true';

  const cells = block.querySelectorAll(':scope > div > div');
  if (cells.length < 3) return;

  const logoCell = cells[1];
  const img = logoCell.querySelector('img');
  if (img) {
    const picture = createOptimizedPicture(img.src, 'Logo', false);
    img.replaceWith(picture);
  }

  // Hamburger
  const menu = document.createElement('div');
  menu.className = 'site-header-menu-icon';
  menu.innerHTML = '<span></span><span></span><span></span>';
  block.prepend(menu);

  // Home link
  const link = document.createElement('a');
  link.href = '/';
  while (logoCell.firstChild) link.appendChild(logoCell.firstChild);
  logoCell.appendChild(link);

  // Login
  const login = document.createElement('button');
  login.className = 'site-header-login-button';
  login.textContent = 'Login';
  block.append(login);

  block.classList.add('site-header-layout');
}