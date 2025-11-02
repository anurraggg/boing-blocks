export default function decorate(block) {
  // Create the menu icon (three lines)
  const menuIcon = document.createElement('div');
  menuIcon.classList.add('header-menu-icon');
  // You could add three span elements or use CSS for the lines
  menuIcon.innerHTML = '<span></span><span></span><span></span>'; 
  block.prepend(menuIcon); // Add to the far left

  // Find the logo image which the author provided
  const logoWrapper = block.querySelector('picture, img').closest('p');
  if (logoWrapper) {
      logoWrapper.classList.add('header-logo');
      // If the logo needs to be a link, we'd wrap it here:
      // const logoLink = document.createElement('a');
      // logoLink.href = '/'; // Or a configurable link
      // logoWrapper.replaceChild(logoLink, logoWrapper.firstElementChild);
      // logoLink.appendChild(logoWrapper.firstElementChild);
  }


  // Create the login button
  const loginButton = document.createElement('button');
  loginButton.classList.add('header-login-button');
  loginButton.textContent = 'Login';
  // If it's a link, it would be an <a> tag instead of <button>
  // loginButton.addEventListener('click', () => { /* Handle login click */ });
  block.append(loginButton); // Add to the far right

  // Add a class for overall layout to the block itself
  block.classList.add('header-layout');
}