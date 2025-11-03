/**
 * Header block – AEM Blocks (Franklin) conventions
 * ------------------------------------------------
 *  • Works with any markup the author drops in the block:
 *      – picture / img inside a <p>, <div>, <a> …
 *      – plain text logo (fallback)
 *  • Guarantees:
 *      – Hamburger icon on the left
 *      – Logo (linked to “/”) centered
 *      – Login button on the right
 *      – No console warnings
 */
 export default function decorate(block) {
  /* -------------------------------------------------
   * 1. Hamburger icon (left)
   * ------------------------------------------------- */
  const menuIcon = document.createElement('div');
  menuIcon.className = 'header-menu-icon';
  menuIcon.innerHTML = '<span></span><span></span><span></span>';
  block.prepend(menuIcon);

  /* -------------------------------------------------
   * 2. Logo handling (center)
   * ------------------------------------------------- */
  // Grab *all* children that are NOT the icon we just added
  const possibleLogoEls = Array.from(block.children).filter(
    (el) => !el.classList.contains('header-menu-icon')
      && el.nodeName !== 'BUTTON'               // ignore stray buttons
      && !el.querySelector('button')
  );

  // Prefer the element that already contains a picture/img
  let logoWrapper = possibleLogoEls.find((el) => el.querySelector('picture, img'));

  // Fallback: if no image is found, treat the first remaining element as logo text
  if (!logoWrapper && possibleLogoEls.length) {
    logoWrapper = possibleLogoEls[0];
  }

  if (logoWrapper) {
    // Add a *class* (not the file name!) – CSS will center it
    logoWrapper.classList.add('header-logo');

    // ---- Ensure the logo is wrapped in a link to “/” ----
    const existingLink = logoWrapper.querySelector('a');
    const target = existingLink || document.createElement('a');
    if (!existingLink) {
      target.href = '/';
      // Move everything inside the wrapper into the link
      while (logoWrapper.firstChild) {
        target.appendChild(logoWrapper.firstChild);
      }
      logoWrapper.appendChild(target);
    }
  } else {
    console.warn('Header logo element not found in the block.');
  }

  /* -------------------------------------------------
   * 3. Login button (right)
   * ------------------------------------------------- */
  const loginButton = document.createElement('button');
  loginButton.className = 'header-login-button';
  loginButton.textContent = 'Login';
  block.append(loginButton);

  /* -------------------------------------------------
   * 4. Layout wrapper class
   * ------------------------------------------------- */
  block.classList.add('header-layout');
}