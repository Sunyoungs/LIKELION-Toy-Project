import { MOCK_POSTS, MOCK_CURRENT_USER } from './mock-data.js';

let currentSort = 'newest';

document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSort = btn.dataset.sort;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMyPosts();
  });
});

const snsContainer = document.querySelector('.sns-links');
if (snsContainer && MOCK_CURRENT_USER.sns_link) {
  const a = document.createElement('a');
  a.href = MOCK_CURRENT_USER.sns_link;
  a.textContent = MOCK_CURRENT_USER.sns_link.replace(/^https?:\/\//, '');
  a.target = '_blank';
  a.rel = 'noopener';
  snsContainer.appendChild(a);
}

function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'post-card';
  article.dataset.postId = post.post_id;

  const thumb = document.createElement('div');
  thumb.className = 'post-thumb';
  if (post.thumbnail) {
    thumb.style.backgroundImage = `url("${post.thumbnail}")`;
    thumb.style.backgroundSize = 'cover';
    thumb.style.backgroundPosition = 'center';
    thumb.style.backgroundRepeat = 'no-repeat';
  }

  const meta = document.createElement('div');
  meta.className = 'post-card-meta';
  meta.textContent = `${formatDate(post.created_at)} · ${post.author_username}`;
  thumb.appendChild(meta);

  const body = document.createElement('div');
  body.className = 'post-body';

  const title = document.createElement('h2');
  title.className = 'post-title';
  title.textContent = post.title;

  const tagsDiv = document.createElement('div');
  tagsDiv.className = 'post-tags';
  post.tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = `#${t}`;
    tagsDiv.appendChild(span);
  });

  body.append(title, tagsDiv);
  article.append(thumb, body);

  article.addEventListener('click', () => {
    location.href = `../pages/detail.html?id=${post.post_id}&from=my`;
  });

  return article;
}

function formatDate(iso) {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function renderMyPosts() {
  const myPosts = MOCK_POSTS.filter(p => p.author_username === MOCK_CURRENT_USER.username);
  const sorted = [...myPosts].sort((a, b) => {
    const diff = new Date(b.created_at) - new Date(a.created_at);
    return currentSort === 'newest' ? diff : -diff;
  });
  const feedList = document.getElementById('feedList');

  feedList.innerHTML = '';
  if (sorted.length === 0) {
    feedList.innerHTML = '<p class="empty">작성한 글이 없습니다.</p>';
  } else {
    sorted.forEach(post => feedList.appendChild(createPostCard(post)));
  }

  const totalEl = document.querySelector('.feed-total');
  if (totalEl) totalEl.textContent = `총 ${myPosts.length}개`;
}

renderMyPosts();
