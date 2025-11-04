/**
 * Toggles the active tab and panel.
 * @param {Element} button - The button that was clicked.
 * @param {Element[]} buttons - All buttons in the tab list.
 * @param {Element[]} panels - All panel sections.
 */
 function toggleTab(button, buttons, panels) {
    buttons.forEach((btn, i) => {
      const panel = panels[i];
      if (btn === button) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
      }
    });
  }
  
  export default function decorate(block) {
    // 1. Create the tab list (the buttons)
    const tabList = document.createElement('div');
    tabList.classList.add('time-menu-list'); // Renamed
    tabList.setAttribute('role', 'tablist');
  
    const tabButtons = [];
    const tabPanels = [];
  
    // 2. Find and adopt the following sections as panels
    let currentSection = block.closest('.section');
    let panelIndex = 0;
    
    // Find all subsequent sections
    while (currentSection.nextElementSibling) {
      const nextSection = currentSection.nextElementSibling;
      // Check if the section belongs to this tab set
      if (panelIndex < block.children.length - 1) { // -1 to skip block name row
        nextSection.classList.add('time-menu-panel'); // Renamed
        nextSection.setAttribute('role', 'tabpanel');
        tabPanels.push(nextSection);
        panelIndex += 1;
        currentSection = nextSection;
      } else {
        // Stop when we run out of tabs
        break;
      }
    }
  
    // 3. Create a button for each row in the author's table
    [...block.children].forEach((row, i) => { // Skip first row (block name)
      const button = document.createElement('button');
      button.classList.add('time-menu-button'); // Renamed
      button.setAttribute('role', 'tab');
      button.textContent = row.children[0].textContent;
  
      // Add click event
      button.addEventListener('click', () => {
        toggleTab(button, tabButtons, tabPanels);
      });
  
      tabList.append(button);
      tabButtons.push(button);
    });
  
    // 4. Clean up the block and add the new structure
    const tabListWrapper = document.createElement('div');
    tabListWrapper.classList.add('time-menu-list-wrapper'); // Renamed
    tabListWrapper.append(tabList);
  
    block.textContent = '';
    block.append(tabListWrapper);
  
    // 5. Set the "Weekly" tab as active by default (or "Daily" at index 0)
    const defaultActiveIndex = 1; // 0=Daily, 1=Weekly, 2=Monthly
    if (tabButtons[defaultActiveIndex] && tabPanels[defaultActiveIndex]) {
      toggleTab(tabButtons[defaultActiveIndex], tabButtons, tabPanels);
    }
  }