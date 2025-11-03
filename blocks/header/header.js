// blocks/header/header.js
import { createOptimizedPicture, readBlockConfig } from '../../scripts/aem.js';

export default function decorate(block) {
  console.log('HEADER DECORATE: STARTED', block);

  if (block.dataset.headerReady) {
    console.log('HEADER DECORATE: Already decorated');
    return;
  }
  block.dataset.headerReady = 'true';

  // === 1. Read the 1×3 table from nav.docx ===
  const config = readBlockConfig(block);
  console.log('HEADER DECORATE: readBlockConfig →', config);

  // === 2. Clear and rebuild ===
  block.innerHTML = '';
  block.classList.add('header-layout');

  const wrapper = document.createElement('div');
  wrapper.className = 'header-wrapper';

  // --- Hamburger ---
  const menu = document.createElement('div');
  menu.className = 'header-menu-icon';
  menu.innerHTML = '<span></span><span></span><span></span>';
  wrapper.appendChild(menu);

  // --- Logo (from middle cell) ---
  const logoDiv = document.createElement('div');
  logoDiv.className = 'header-logo';

  // Find the image in the original block (before clearing)
  const originalBlock = block.cloneNode(true);
  const img = originalBlock.querySelector('img');
  console.log('HEADER DECORATE: Found original <img> →', img);

  if (img) {
    const picture = createOptimizedPicture(img.src, 'Logo', false);
    const link = document.createElement('a');
    link.href = '/';
    link.appendChild(picture);
    logoDiv.appendChild(link);
    console.log('HEADER DECORATE: Logo added with <picture>');
  } else {
    // Fallback
    const link = document.createElement('a');
    link.href = '/';
    link.textContent = 'Home';
    logoDiv.appendChild(link);
    console.warn('HEADER DECORATE: No image found in nav.docx');
  }

  wrapper.appendChild(logoDiv);

  // --- Login ---
  const login = document.createElement('button');
  login.className = 'header-login-button';
  login.textContent = 'Login';
  wrapper.appendChild(login);

  block.appendChild(wrapper);
  console.log('HEADER DECORATE: FINAL BLOCK →', block.innerHTML);
}