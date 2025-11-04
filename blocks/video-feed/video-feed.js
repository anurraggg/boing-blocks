import { decorateIcons } from '../../scripts/aem.js';

/**
 * Creates a video player element.
 * @param {string} url - The URL of the video.
 * @returns {Element} - The video player wrapper element.
 */
function createVideoPlayer(url) {
  const videoWrapper = document.createElement('div');
  videoWrapper.classList.add('video-card-player');

  const video = document.createElement('video');
  video.setAttribute('src', url);
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'metadata');

  const playButton = document.createElement('button');
  playButton.classList.add('play-button');
  playButton.setAttribute('aria-label', 'Play video');
  playButton.innerHTML = '<span class="icon icon-play"></span>';

  const muteButton = document.createElement('button');
  muteButton.classList.add('mute-button');
  muteButton.setAttribute('aria-label', 'Mute/Unmute video');
  // Add both icons; CSS will show the correct one
  muteButton.innerHTML = `
    <span class="icon icon-unmute"></span>
    <span class="icon icon-mute"></span>
  `;

  // --- Interactivity ---
  playButton.addEventListener('click', (e) => {
    e.stopPropagation();
    video.play();
    playButton.style.display = 'none';
  });

  video.addEventListener('click', (e) => {
    e.stopPropagation();
    video.pause();
    playButton.style.display = 'block';
  });

  video.addEventListener('ended', () => {
    playButton.style.display = 'block';
  });

  muteButton.addEventListener('click', (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    muteButton.classList.toggle('is-muted', video.muted);
  });

  videoWrapper.append(video, playButton, muteButton);
  return videoWrapper;
}

/**
 * Creates a social card element.
 * @param {Element} row - The row element from the author's table.
 * @returns {Element} - The fully built <li> element for the card.
 */
function buildVideoCard(row) {
  const li = document.createElement('li');
  li.classList.add('video-card');

  // 1. Extract data from cells
  const videoLink = row.children[0]?.querySelector('a')?.href || row.children[0]?.textContent.trim();
  const title = row.children[1]?.textContent.trim();
  const description = row.children[2]?.textContent.trim();
  const initialLikes = row.children[3]?.textContent.trim() || '0';

  // 2. Build Video Player
  const videoPlayer = createVideoPlayer(videoLink);

  // 3. Build Footer
  const footer = document.createElement('div');
  footer.classList.add('video-card-footer');

  const likesWrapper = document.createElement('div');
  likesWrapper.classList.add('video-card-likes');
  const likeButton = document.createElement('button');
  likeButton.classList.add('like-button');
  likeButton.setAttribute('aria-label', 'Like this post');
  likeButton.innerHTML = '<span class="icon icon-like"></span>';
  const likeCount = document.createElement('span');
  likeCount.classList.add('like-count');
  likeCount.textContent = initialLikes;

  likeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isLiked = likeButton.classList.toggle('liked');
    const currentLikes = parseInt(likeCount.textContent, 10);
    likeCount.textContent = isLiked ? currentLikes + 1 : currentLikes - 1;
  });

  likesWrapper.append(likeButton, likeCount);

  const shareButton = document.createElement('button');
  shareButton.classList.add('share-button');
  shareButton.setAttribute('aria-label', 'Share this post');
  shareButton.innerHTML = '<span class="icon icon-share"></span>';

  footer.append(likesWrapper, shareButton);

  // 4. Build Text Content
  const textWrapper = document.createElement('div');
  textWrapper.classList.add('video-card-text');
  if (title) {
    const h3 = document.createElement('h3');
    h3.textContent = title;
    textWrapper.append(h3);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description;
    textWrapper.append(p);
  }

  // 5. Assemble Card
  li.append(videoPlayer, footer, textWrapper);
  return li;
}

export default function decorate(block) {
  // Create the list for all the cards
  const cardList = document.createElement('ul');
  cardList.classList.add('video-feed-list');

  // Process all rows as cards (skip the first row which is the block name)
  const cardRows = [...block.children].slice(1);
  cardRows.forEach((row) => {
    const card = buildVideoCard(row);
    cardList.append(card);
  });

  // Clean up the block and add the new list
  block.textContent = '';
  block.append(cardList);

  // Decorate all icons at once
  decorateIcons(block);
}