export default function decorate(block) {
  // 1. Create the menu icon (three lines)
  const menuIcon = document.createElement('div');
  menuIcon.classList.add('header-menu-icon');
  menuIcon.innerHTML = '<span></span><span></span><span></span>'; 
  block.prepend(menuIcon); // Add to the far left

  // 2. Find the logo image and wrap it (FIX APPLIED HERE)
  const logoElement = block.querySelector('picture, img');

  if (logoElement) {
      // If the logo element is found, we safely proceed to find its closest <p> parent
      const logoWrapper = logoElement.closest('p');
      if (logoWrapper) {
          logoWrapper.classList.add('header-logo');
          // If you need to make the logo a link, do it here
      }
  } else {
      // Fallback or warning if the logo is missing
      console.warn('Header logo not found in the block content.');
  }


  // 3. Create the login button
  const loginButton = document.createElement('button');
  loginButton.classList.add('header-login-button');
  loginButton.textContent = 'Login';
  block.append(loginButton); // Add to the far right

  // 4. Set the final layout class
  block.classList.add('header-layout');
}