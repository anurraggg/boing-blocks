import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';

/**
 * Creates a social card element.
 * @param {Element} row - The row element from the author's table.
 * @returns {Element} - The fully built <li> element for the card.
 */
function buildCard(row) {
  const li = document.createElement('li');
  li.classList.add('social-card');

  // 1. Process Image
  const imageCell = row.children[0];
  const picture = imageCell.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('social-card-image');
    imageWrapper.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
    li.append(imageWrapper);
  }

  // 2. Process Footer (Likes & Share)
  const footer = document.createElement('div');
  footer.classList.add('social-card-footer');

  // 2a. Likes section (left)
  const likesWrapper = document.createElement('div');
  likesWrapper.classList.add('social-card-likes');

  const likeButton = document.createElement('button');
  likeButton.classList.add('like-button');
  likeButton.setAttribute('aria-label', 'Like this post');
  likeButton.innerHTML = '<span class="icon icon-like"></span>'; // Requires /icons/like.svg

  const likeCountCell = row.children[1];
  const likeCount = document.createElement('span');
  likeCount.classList.add('like-count');
  likeCount.textContent = likeCountCell?.textContent.trim() || '0';

  // Add click interactivity
  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.toggle('liked');
    const currentLikes = parseInt(likeCount.textContent, 10);
    if (isLiked) {
      likeCount.textContent = currentLikes + 1;
    } else {
      likeCount.textContent = currentLikes - 1;
    }
  });

  likesWrapper.append(likeButton, likeCount);

  // 2b. Share button (right)
  const shareButton = document.createElement('button');
  shareButton.classList.add('share-button');
  shareButton.setAttribute('aria-label', 'Share this post');
  shareButton.innerHTML = '<span class="icon icon-share"></span>'; // Requires /icons/share.svg

  footer.append(likesWrapper, shareButton);
  li.append(footer);

  return li;
}

export default function decorate(block) {
  // 1. Process the Header Row (the first row)
  const headerRow = block.firstElementChild;
  headerRow.classList.add('social-feed-header');
  headerRow.children[0]?.classList.add('social-feed-title');
  headerRow.children[1]?.classList.add('social-feed-description');

  // 2. Create the list for all the cards
  const cardList = document.createElement('ul');
  cardList.classList.add('social-feed-list');

  // 3. Process all subsequent rows as cards
  const cardRows = [...block.children].slice(1); // Get all rows *except* the first one
  cardRows.forEach((row) => {
    const card = buildCard(row);
    cardList.append(card);
  });

  // 4. Clean up the block and add the new structure
  block.textContent = '';
  block.append(headerRow, cardList);

  // 5. Decorate icons
  decorateIcons(block);
}