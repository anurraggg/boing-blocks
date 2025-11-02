export default function decorate(block) {
  // 1. Create the menu icon (three lines)
  const menuIcon = document.createElement('div');
  menuIcon.classList.add('header-menu-icon');
  // Using spans for the three lines (hamburger icon)
  menuIcon.innerHTML = '<span></span><span></span><span></span>';
  block.prepend(menuIcon); // Add to the far left

  // 2. Find the logo content
  const logoWrapper = Array.from(block.children).find((child) => {
    // Exclude the menu icon we just added
    if (child.classList.contains('header-menu-icon')) return false;

    // Exclude elements that look like button or placeholder containers
    if (child.nodeName === 'BUTTON' || child.querySelector('button')) return false;

    // The content is likely the remaining <p> or <div> element
    return true;
  });

  if (logoWrapper) {
    // Check if the wrapper contains the actual image or picture element
    const logoElement = logoWrapper.querySelector('picture, img');
    if (logoElement) {
      // Found the image content. Apply the logo class for centering.
      logoWrapper.classList.add('header-logo');
      
      // OPTIONAL: Ensure the image is wrapped in a link if it's not already
      if (logoWrapper.querySelector('a') === null) {
        const logoLink = document.createElement('a');
        logoLink.href = '/'; // Link to homepage
        logoWrapper.replaceChild(logoLink, logoWrapper.firstElementChild);
        logoLink.appendChild(logoElement.closest('p, div, a'));
      }
    } else {
      // Logo text/image not found inside the wrapper element
      console.warn('Header logo not found inside the block content element.');
    }
  } else {
    // Fallback if the logo container itself is missing
    console.warn('Header logo content element not found in the block content.');
  }

  // 3. Create the login button
  const loginButton = document.createElement('button');
  loginButton.classList.add('header-login-button');
  loginButton.textContent = 'Login';
  block.append(loginButton); // Add to the far right

  // 4. Set the final layout class
  block.classList.add('header-layout');
}