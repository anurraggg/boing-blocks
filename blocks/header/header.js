export default function decorate(block) {
  // 1️⃣ Set your logo image path and optional link
  const logoImageUrl = '/icons/header-logo.png'; // <-- ✅ change this to your image path
  const logoLinkUrl = '/'; // optional: where the logo should take you when clicked

  // 2️⃣ Create the menu icon (hamburger)
  const menuIcon = document.createElement('div');
  menuIcon.classList.add('header-menu-icon');
  menuIcon.innerHTML = '<span></span><span></span><span></span>';
  block.prepend(menuIcon);

  // 3️⃣ Try to find a logo wrapper, or create one
  let logoWrapper = Array.from(block.children).find((child) => {
    if (child.classList.contains('header-menu-icon')) return false;
    if (child.nodeName === 'BUTTON' || child.querySelector('button')) return false;
    return true;
  });

  if (!logoWrapper) {
    logoWrapper = document.createElement('div');
    block.insertBefore(logoWrapper, block.children[1] || null);
  }

  logoWrapper.classList.add('header-logo');

  // 4️⃣ Always create or replace the logo image
  logoWrapper.innerHTML = ''; // clear any placeholder text
  const logoImg = document.createElement('img');
  logoImg.src = logoImageUrl; // ✅ the hardcoded path
  logoImg.alt = 'Company Logo';
  logoWrapper.appendChild(logoImg);

  // 5️⃣ Wrap logo in link (so clicking it navigates home)
  const logoLink = document.createElement('a');
  logoLink.href = logoLinkUrl;
  logoLink.appendChild(logoImg);
  logoWrapper.innerHTML = '';
  logoWrapper.appendChild(logoLink);

  // 6️⃣ Add a login button at the end
  const loginButton = document.createElement('button');
  loginButton.classList.add('header-login-button');
  loginButton.textContent = 'Login';
  block.append(loginButton);

  // 7️⃣ Final layout styling class
  block.classList.add('header-layout');
}
