/**
 * Decorates the feature-card block.
 * Each row in the authored table becomes a card.
 * @param {HTMLElement} block The feature-card block element.
 */
 export default async function decorate(block) {
    // Create a <ul> element to hold all the cards for semantic list markup
    const cardList = document.createElement('ul');
    cardList.className = 'feature-card-list';
  
    // Iterate over each row in the authored table
    [...block.children].forEach((row) => {
      // Each row becomes a <li> item
      const li = document.createElement('li');
      li.className = 'feature-card-item';
  
      // Get the cells (divs) from the row
      const [imageCell, titleCell, descCell] = row.children;
  
      // 1. Process the Image
      // The image is the only content in the first cell
      const image = imageCell.querySelector('picture');
      if (image) {
        image.className = 'feature-card-image';
        li.append(image);
      }
  
      // 2. Process the Title
      // The title is the content of the second cell
      if (titleCell && titleCell.textContent.trim()) {
        const title = document.createElement('h3'); // Use <h3> for semantic titles
        title.className = 'feature-card-title';
        // Move the content from the original cell (e.g., <p>text</p>)
        title.append(...titleCell.childNodes);
        li.append(title);
      }
  
      // 3. Process the Description
      // The description is the content of the third cell
      if (descCell && descCell.textContent.trim()) {
        const description = document.createElement('p');
        description.className = 'feature-card-description';
        description.append(...descCell.childNodes);
        li.append(description);
      }
      
      // Add the completed card to the list
      cardList.append(li);
    });
  
    // Clear the original, raw table HTML from the block
    block.innerHTML = '';
    // Append the new, structured list
    block.append(cardList);
  }