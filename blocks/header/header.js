/**
 * header.js – AEM Blocks (Franklin) – fully tolerant of Google‑Docs markup
 */
 export default function decorate(block) {
  /* -------------------------------------------------
   * 1. Hamburger (left)
   * ------------------------------------------------- */
  const menuIcon = document.createElement('div');
  menuIcon.className = 'header-menu-icon';
  menuIcon.innerHTML = '<span></span><span></span><span></span>';
  block.prepend(menuIcon);

  /* -------------------------------------------------
   * 2. Find *any* element that contains an image
   * ------------------------------------------------- */
  const candidates = Array.from(block.children).filter(
    el => !el.classList.contains('header-menu-icon')
          && el.nodeName !== 'BUTTON'
          && !el.querySelector('button')
  );

  // 2a – look for an <img> or <picture> anywhere inside the candidate
  let logoWrapper = candidates.find(el => {
    return el.querySelector('img') || el.querySelector('picture');
  });

  // 2b – fallback: first remaining element (text logo)
  if (!logoWrapper && candidates.length) {
    logoWrapper = candidates[0];
  }

  if (logoWrapper) {
    logoWrapper.classList.add('header-logo');

    // ---- Ensure the *actual* image element is visible ----
    const imgEl = logoWrapper.querySelector('img') || logoWrapper.querySelector('picture');
    if (imgEl) {
      // Force the image to render (Google Docs sometimes adds display:none on spans)
      imgEl.style.display = 'block';
      imgEl.style.maxHeight = '48px';          // optional – keep logo size sane
      imgEl.style.margin = '0 auto';
    }

    // ---- Wrap everything in <a href="/"> if not already ----
    const existingLink = logoWrapper.querySelector('a');
    const link = existingLink || document.createElement('a');
    if (!existingLink) {
      link.href = '/';
      // Move *all* children of logoWrapper into the link
      while (logoWrapper.firstChild) {
        link.appendChild(logoWrapper.firstChild);
      }
      logoWrapper.appendChild(link);
    }
  } else {
    console.warn('Header logo element not found in the block.');
  }

  /* -------------------------------------------------
   * 3. Login button (right)
   * ------------------------------------------------- */
  const loginBtn = document.createElement('button');
  loginBtn.className = 'header-login-button';
  loginBtn.textContent = 'Login';
  block.append(loginBtn);

  /* -------------------------------------------------
   * 4. Layout class
   * ------------------------------------------------- */
  block.classList.add('header-layout');
}