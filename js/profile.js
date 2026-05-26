import { MOCK_POSTS, MOCK_CURRENT_USER } from './mock-data.js';

function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'post-card';
  article.dataset.postId = post.post_id;

  const thumb = document.createElement('div');
  thumb.className = 'post-thumb';

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
    location.href = `../pages/detail.html?id=${post.post_id}`;
  });

  return article;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function renderMyPosts() {
  const myPosts = MOCK_POSTS.filter(p => p.author_username === MOCK_CURRENT_USER.username);
  const feedList = document.getElementById('feedList');

  feedList.innerHTML = '';
  if (myPosts.length === 0) {
    feedList.innerHTML = '<p class="empty">작성한 글이 없습니다.</p>';
  } else {
    myPosts.forEach(post => feedList.appendChild(createPostCard(post)));
  }

  const totalEl = document.querySelector('.feed-total');
  if (totalEl) totalEl.textContent = `총 ${myPosts.length}개`;
}

renderMyPosts();
