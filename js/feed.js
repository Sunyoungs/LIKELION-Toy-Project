import { MOCK_POSTS } from './mock-data.js';

let allPosts = [];
let currentPage = 0;
const CARDS_PER_PAGE = 6;

// 통합 시 이 함수만 교체
async function fetchPosts(searchKeyword = '') {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!searchKeyword) return resolve(MOCK_POSTS);
      const kw = searchKeyword.toLowerCase();
      const filtered = MOCK_POSTS.filter(p =>
        p.title.toLowerCase().includes(kw) ||
        p.tags.some(t => t.toLowerCase().includes(kw))
      );
      resolve(filtered);
    }, 200);
  });
}

function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'post-card';
  article.dataset.postId = post.post_id;

  // 이미지 플레이스홀더 + 날짜·작성자 오버레이
  const thumb = document.createElement('div');
  thumb.className = 'post-thumb';

  const meta = document.createElement('div');
  meta.className = 'post-card-meta';
  meta.textContent = `${formatDate(post.created_at)} · ${post.author_username}`;
  thumb.appendChild(meta);

  // 제목 + 태그
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
    location.href = `./pages/detail.html?id=${post.post_id}`;
  });

  return article;
}

function renderPage() {
  const listEl = document.getElementById('feedList');
  const pagePosts = allPosts.slice(currentPage * CARDS_PER_PAGE, (currentPage + 1) * CARDS_PER_PAGE);

  listEl.innerHTML = '';
  pagePosts.forEach(post => listEl.appendChild(createPostCard(post)));

  const totalEl = document.getElementById('feedTotal');
  if (totalEl) totalEl.textContent = `총 ${allPosts.length}개`;

  const [prevBtn, nextBtn] = document.querySelectorAll('.feed-nav-btn');
  if (prevBtn) prevBtn.disabled = currentPage === 0;
  if (nextBtn) nextBtn.disabled = (currentPage + 1) * CARDS_PER_PAGE >= allPosts.length;
}

async function renderFeed(keyword = '') {
  const listEl = document.getElementById('feedList');
  listEl.innerHTML = '<p class="loading">불러오는 중...</p>';

  try {
    allPosts = await fetchPosts(keyword);
    currentPage = 0;

    if (allPosts.length === 0) {
      listEl.innerHTML = '<p class="empty">게시글이 없습니다.</p>';
      const totalEl = document.getElementById('feedTotal');
      if (totalEl) totalEl.textContent = '총 0개';
      return;
    }

    renderPage();
  } catch (err) {
    console.error('[feed] 로드 실패:', err);
    listEl.innerHTML = '<p class="error">불러오기에 실패했습니다.</p>';
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

// 검색
let searchTimer;
document.getElementById('searchInput').addEventListener('input', (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => renderFeed(e.target.value.trim()), 300);
});

// 헬퍼
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

renderFeed();
