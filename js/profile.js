let currentSort = 'newest';
let allPosts = [];
const CARDS_PER_PAGE = 6;
let currentPage = 0;

document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSort = btn.dataset.sort;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMyPosts();
  });
});

function renderSnsLink(container, link) {
  if (!container || !link) return;
  container.innerHTML = '';
  const a = document.createElement('a');
  a.href = link;
  a.textContent = link.replace(/^https?:\/\//, '');
  a.target = '_blank';
  a.rel = 'noopener';
  container.appendChild(a);
}

async function fetchProfile() {
  const usernameEl = document.querySelector('.profile-username');
  const snsContainer = document.querySelector('.sns-links');

  if (usernameEl) usernameEl.textContent = localStorage.getItem('username') || '';
  renderSnsLink(snsContainer, MOCK_CURRENT_USER.sns_link);

  try {
    const data = await fetchAPI('/users/profile/me');
    if (!data) return;
    if (usernameEl) usernameEl.textContent = data.username;
    renderSnsLink(snsContainer, data.sns_link);
  } catch (e) {
    console.error('프로필 정보 로드 실패:', e);
  }
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

/*function renderMyPosts() {
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
}*/

function renderPage() {
  const feedList = document.getElementById('feedList');
  const sorted = [...allPosts].sort((a, b) => {
    const diff = new Date(b.created_at) - new Date(a.created_at);
    return currentSort === 'newest' ? diff : -diff;
  });
  const pagePosts = sorted.slice(currentPage * CARDS_PER_PAGE, (currentPage + 1) * CARDS_PER_PAGE);
 
  feedList.innerHTML = '';
  if (pagePosts.length === 0) {
    feedList.innerHTML = '<p class="empty">작성한 글이 없습니다.</p>';
  } else {
    pagePosts.forEach(post => feedList.appendChild(createPostCard(post)));
  }
 
  const totalEl = document.querySelector('.feed-total');
  if (totalEl) totalEl.textContent = `총 ${allPosts.length}개`;
 
  const [prevBtn, nextBtn] = document.querySelectorAll('.feed-nav-btn');
  if (prevBtn) prevBtn.disabled = currentPage === 0;
  if (nextBtn) nextBtn.disabled = (currentPage + 1) * CARDS_PER_PAGE >= allPosts.length;
}
 
async function fetchMyPosts() {
  const feedList = document.getElementById('feedList');
  feedList.innerHTML = '<p class="loading">불러오는 중...</p>';
  try {
    // [수정] mock 제거 → 실제 API 사용 (명세서 1.7 기준)
    const data = await fetchAPI('/users/profile/me/posts');
    allPosts = data || [];
    currentPage = 0;
    renderPage();
  } catch (e) {
    console.error('내 게시글 로드 실패:', e);
    feedList.innerHTML = '<p class="error">불러오기에 실패했습니다.</p>';
  }
}
 
// 네비게이션 버튼 이벤트
const [prevBtn, nextBtn] = document.querySelectorAll('.feed-nav-btn');
if (prevBtn) prevBtn.addEventListener('click', () => {
  if (currentPage > 0) { currentPage--; renderPage(); }
});
if (nextBtn) nextBtn.addEventListener('click', () => {
  if ((currentPage + 1) * CARDS_PER_PAGE < allPosts.length) { currentPage++; renderPage(); }
});

fetchProfile();
fetchMyPosts();