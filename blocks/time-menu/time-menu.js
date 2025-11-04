/**
 * Toggles the active tab and panel.
 * @param {Element} button - The button that was clicked.
 * @param {Element[]} buttons - All buttons in the tab list.
 *ax @param {Element[]} panels - All panel sections.
 */
 function toggleTab(button, buttons, panels) {
    buttons.forEach((btn, i) => {
      const panel = panels[i];
      
      // This check protects against a mismatch
      if (!panel) return; 
  
      if (btn === button) {
        // --- Logic for the ACTIVE tab ---
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        panel.style.display = 'block'; // <-- ADDED: Explicitly show the panel
      } else {
        // --- Logic for the INACTIVE tabs ---
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
        panel.style.display = 'none'; // <-- ADDED: Explicitly hide the panel
      }
    });
  }
  
  export default function decorate(block) {
    const tabList = document.createElement('div');
    tabList.classList.add('time-menu-list');
    tabList.setAttribute('role', 'tablist');
  
    const tabButtons = [];
    const tabPanels = [];
  
    // Find and adopt the following sections as panels
    let currentSection = block.closest('.section');
    let panelIndex = 0;
    
    const numTabs = block.children.length - 1; // e.g., 3 buttons
  
    // Loop only for the number of tabs we have
    while (panelIndex < numTabs && currentSection.nextElementSibling) {
      const nextSection = currentSection.nextElementSibling;
      nextSection.classList.add('time-menu-panel');
      nextSection.setAttribute('role', 'tabpanel');
      tabPanels.push(nextSection);
      panelIndex += 1;
      currentSection = nextSection;
    }
  
    // Create a button for each row in the author's table
    [...block.children].slice(1).forEach((row, i) => {
      const button = document.createElement('button');
      button.classList.add('time-menu-button');
      button.setAttribute('role', 'tab');
      button.textContent = row.children[0].textContent;
  
      button.addEventListener('click', () => {
        toggleTab(button, tabButtons, tabPanels);
      });
  
      tabList.append(button);
      tabButtons.push(button);
    });
    
    // Clean up the block and add the new structure
    const tabListWrapper = document.createElement('div');
    tabListWrapper.classList.add('time-menu-list-wrapper');
    tabListWrapper.append(tabList);
  
    block.textContent = '';
    block.append(tabListWrapper);
  
    // Check for mismatch and log a warning
    if (tabButtons.length !== tabPanels.length) {
      console.warn(
        'time-menu block warning: The number of tabs (' 
        + tabButtons.length 
        + ') does not match the number of content sections (' 
        + tabPanels.length 
        + '). Make sure you have a --- section separator for each tab.'
      );
    }
  
    // Set the first tab ("Daily") as active by default
    const defaultActiveIndex = 0; 
    if (tabButtons[defaultActiveIndex]) {
      toggleTab(tabButtons[defaultActiveIndex], tabButtons, tabPanels);
    } else {
      console.warn('time-menu block warning: No tabs found.');
    }
  }