export default function decorate(block) {
    const tabList = document.createElement('div');
    tabList.classList.add('tabs-list');
    tabList.setAttribute('role', 'tablist');
  
    const tabButtons = [];
  
    // Create a button for each row in the author's table (skip first row)
    [...block.children].slice(1).forEach((row) => {
      const button = document.createElement('button');
      button.classList.add('tabs-button');
      button.setAttribute('role', 'tab');
      button.textContent = row.children[0].textContent;
      
      tabList.append(button);
      tabButtons.push(button);
    });
  
    // Add click event to all buttons
    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        // Remove 'active' from all buttons
        tabButtons.forEach((btn) => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        // Add 'active' to the clicked button
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
      });
    });
  
    // Set the first tab as active by default
    if (tabButtons.length > 0) {
      tabButtons[0].classList.add('active');
      tabButtons[0].setAttribute('aria-selected', 'true');
    }
  
    // Clean up the block and add the new structure
    block.textContent = '';
    block.append(tabList);
  }