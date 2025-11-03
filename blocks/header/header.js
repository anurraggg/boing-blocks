export default function decorate(block) {
  // Prevent double run
  if (block.classList.contains('header-layout')) return;

  // 1. Hamburger (left)
  const menuIcon = document.createElement('div');
  menuIcon.className = 'header-menu-icon';
  menuIcon.innerHTML = '<span></span><span></span><span></span>';
  block.prepend(menuIcon);

  // 2. Get all cells (table → div > div > div)
  const cells = Array.from(block.children);

  // In nav.docx: cells[0] = left, cells[1] = middle (logo), cells[2] = right
  const logoCell = cells[1];

  if (logoCell) {
    logoCell.classList.add('header-logo');

    // Find <img> OR <picture> (AEM uses <picture> for optimized images)
    const img = logoCell.querySelector('img');
    const picture = logoCell.querySelector('picture');

    if (picture || img) {
      // Force visibility
      const displayEl = picture || img;
      displayEl.style.display = 'block';
      displayEl.style.maxHeight = '48px';
      displayEl.style.margin = '0 auto';

      // If <picture> is used, ensure <img> inside it is visible
      if (picture) {
        const fallbackImg = picture.querySelector('img');
        if (fallbackImg) {
          fallbackImg.style.maxHeight = '48px';
          fallbackImg.style.display = 'block';
          fallbackImg.style.margin = '0 auto';
        }
      }
    }

    // Wrap in <a href="/"> if not already
    if (!logoCell.querySelector('a')) {
      const link = document.createElement('a');
      link.href = '/';
      while (logoCell.firstChild) {
        link.appendChild(logoCell.firstChild);
      }
      logoCell.appendChild(link);
    }
  }

  // 3. Login button (right)
  const loginBtn = document.createElement('button');
  loginBtn.className = 'header-login-button';
  loginBtn.textContent = 'Login';
  block.append(loginBtn);

  // 4. Layout
  block.classList.add('header-layout');
}