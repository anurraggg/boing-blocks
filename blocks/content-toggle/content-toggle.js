export default function decorate(block) {
    // Check if this is the (grid) variant
    if (block.classList.contains('grid')) {
      // This is the 3-column grid
      block.children[0]?.classList.add('toggle-grid-header');
      block.children[1]?.classList.add('toggle-grid-values');
    } else {
      // This is the standard accordion
      // Get all rows except the first one (block name)
      const rows = [...block.children].slice(1);
      
      // Clear the block to rebuild it
      block.textContent = '';
  
      rows.forEach((row) => {
        // Create the wrapper for each item
        const item = document.createElement('div');
        item.classList.add('toggle-item');
  
        // Create the button (from the first cell)
        const button = document.createElement('button');
        button.classList.add('toggle-button');
        button.setAttribute('aria-expanded', 'false');
        // Move title content into the button
        button.append(...row.children[0].childNodes); 
        
        // Create the panel (from the second cell)
        const panel = document.createElement('div');
        panel.classList.add('toggle-panel');
        panel.setAttribute('aria-hidden', 'true');
        // Move description content into the panel
        panel.append(...row.children[1].childNodes);
  
        // Add click event to toggle
        button.addEventListener('click', () => {
          const isExpanded = button.getAttribute('aria-expanded') === 'true';
          button.setAttribute('aria-expanded', !isExpanded);
          panel.setAttribute('aria-hidden', isExpanded);
          item.classList.toggle('active');
        });
  
        // Assemble the item
        item.append(button, panel);
        block.append(item);
      });
    }
  }