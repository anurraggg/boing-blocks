export default function decorate(block) {
    // Get all rows except the first one (block name)
    const rows = [...block.children]
    block.textContent = ''; // Clear the block to rebuild it
  
    rows.forEach((row) => {
      const [titleCell, descriptionCell, typeCell] = row.children;
      const type = typeCell?.textContent.trim() || 'static';
  
      // 1. Create the main item wrapper
      const item = document.createElement('div');
      item.classList.add('content-item', `type-${type}`);
  
      // 2. Create the title wrapper
      const titleWrapper = document.createElement('div');
      titleWrapper.classList.add('content-title');
      titleWrapper.append(...titleCell.childNodes);
  
      // 3. Create the description panel
      const panel = document.createElement('div');
      panel.classList.add('content-panel');
      panel.append(...descriptionCell.childNodes);
  
      // 4. Handle logic for 'toggle' type
      if (type === 'toggle') {
        const button = document.createElement('button');
        button.classList.add('content-toggle-button');
        button.setAttribute('aria-expanded', 'true');
        button.textContent = 'Read Less';
  
        // Add the button to the title wrapper
        titleWrapper.append(button);
  
        // Start as 'active' (expanded)
        item.classList.add('active');
  
        button.addEventListener('click', () => {
          const isExpanded = item.classList.toggle('active');
          button.setAttribute('aria-expanded', isExpanded);
          panel.setAttribute('aria-hidden', !isExpanded);
          button.textContent = isExpanded ? 'Read Less' : 'Read More';
        });
      }
  
      // 5. Assemble and append the item
      item.append(titleWrapper, panel);
      block.append(item);
    });
  }