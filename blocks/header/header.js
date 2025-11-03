// blocks/header/header.js
import { readBlockConfig } from '../../scripts/aem.js';

/**
 * Extracts image src from pasted Google Docs image
 */
function getImageSrc(cell) {
  const img = cell.querySelector('img');
  if (img && img.src && img.src.startsWith('data:')) {
    return img.src; // AEM will convert data: URLs to real ones
  }
  return null;
}

/**
 * Main decorate function
 */
export default function decorate(block) {
  // Prevent double execution
  if (block.classList.contains('header-layout')) return;

  // === 1. Parse the 1×3 table (only in nav.docx) ===
  const cells = Array.from(block.children);
  if (cells.length < 3) {
    console.warn('Header block expects 1×3 table in nav.docx');
    return;
  }

  const [, logoCell] = cells; // middle cell
  const logoSrc = getImageSrc(logoCell);

  // === 2. Clear block and rebuild ===
  block.innerHTML = '';
  block.classList.add('header-layout');

  const header = document.createElement('div');
  header.className = 'header-wrapper';

  // --- Hamburger ---
  const menu = document.createElement('div');
  menu.className = 'header-menu-icon';
  menu.innerHTML = '<span></span><span></span><span></span>';
  header.appendChild(menu);

  // --- Logo ---
  const logoContainer = document.createElement('div');
  logoContainer.className = 'header-logo';

  if (logoSrc) {
    const link = document.createElement('a');
    link.href = '/';

    const img = document.createElement('img');
    img.src = logoSrc;
    img.alt = 'Logo';
    img.className = 'logo-img';

    link.appendChild(img);
    logoContainer.appendChild(link);
  } else {
    // Fallback text
    const link = document.createElement('a');
    link.href = '/';
    link.textContent = 'Home';
    logoContainer.appendChild(link);
  }
  header.appendChild(logoContainer);

  // --- Login ---
  const login = document.createElement('button');
  login.className = 'header-login-button';
  login.textContent = 'Login';
  header.appendChild(login);

  // === 3. Append to block ===
  block.appendChild(header);
}