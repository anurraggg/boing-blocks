// blocks/site-header/site-header.js
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

  const menu = document.createElement('div');
  menu.className = 'header-menu-icon';
  menu.innerHTML = '<span></span><span></span><span></span>';
  block.prepend(menu);

  const link = document.createElement('a');
  link.href = '/';
  while (logoCell.firstChild) link.appendChild(logoCell.firstChild);
  logoCell.appendChild(link);

  const login = document.createElement('button');
  login.className = 'header-login-button';
  login.textContent = 'Login';
  block.append(login);

  block.classList.add('header-layout');
}