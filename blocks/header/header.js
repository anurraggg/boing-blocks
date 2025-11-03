// blocks/header/header.js
export default function decorate(block) {
  // Prevent double execution
  if (block.classList.contains('header-layout')) return;

  const cells = Array.from(block.children);
  if (cells.length < 3) return;

  const logoCell = cells[1]; // middle cell

  // === CLEAR AND REBUILD ===
  block.innerHTML = '';
  block.classList.add('header-layout');

  const wrapper = document.createElement('div');
  wrapper.className = 'header-wrapper';

  // 1. Hamburger
  const menu = document.createElement('div');
  menu.className = 'header-menu-icon';
  menu.innerHTML = '<span></span><span></span><span></span>';
  wrapper.appendChild(menu);

  // 2. Logo Container (AEM will populate <picture>)
  const logoContainer = document.createElement('div');
  logoContainer.className = 'header-logo';

  // Copy the **original pasted content** (includes <img>)
  const originalContent = logoCell.cloneNode(true);
  logoContainer.appendChild(originalContent);

  // Wrap in link
  const link = document.createElement('a');
  link.href = '/';
  while (logoContainer.firstChild) {
    link.appendChild(logoContainer.firstChild);
  }
  logoContainer.appendChild(link);

  wrapper.appendChild(logoContainer);

  // 3. Login
  const login = document.createElement('button');
  login.className = 'header-login-button';
  login.textContent = 'Login';
  wrapper.appendChild(login);

  block.appendChild(wrapper);
}