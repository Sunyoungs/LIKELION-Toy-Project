import { MOCK_POSTS } from './mock-data.js';

//통합 시 이 함수만 교체
async function fetchPosts(searchKeyword = '') {
  // TODO: 통합 시 아래 mock 로직을 fetch로 교체
  // const url = searchKeyword 
  //   ? `${BASE_URL}/posts?search=${encodeURIComponent(searchKeyword)}`
  //   : `${BASE_URL}/posts`;
  // const res = await fetch(url);
  // return await res.json();

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

// 렌더링
function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'post-card';
  article.dataset.postId = post.post_id;

  // 태그 HTML (없으면 빈 문자열)
  const tagsHTML = post.tags.length
    ? `<div class="post-tags">
         ${post.tags.map(t => `<span class="tag">#${escapeHTML(t)}</span>`).join('')}
       </div>`
    : '';

  article.innerHTML = `
    <h2 class="post-title">${escapeHTML(post.title)}</h2>
    <div class="post-meta">
      <span class="author">${escapeHTML(post.author_username)}</span>
      <time datetime="${post.created_at}">${formatDate(post.created_at)}</time>
    </div>
    ${tagsHTML}
  `;

  // 카드 클릭 → 상세 페이지
  article.addEventListener('click', () => {
    location.href = `./pages/detail.html?id=${post.post_id}`;
  });

  return article;
}

async function renderFeed(keyword = '') {
  const listEl = document.getElementById('feedList');
  listEl.innerHTML = '<p class="loading">불러오는 중...</p>';

  try {
    const posts = await fetchPosts(keyword);
    listEl.innerHTML = '';

    if (posts.length === 0) {
      listEl.innerHTML = '<p class="empty">게시글이 없습니다.</p>';
      return;
    }

    posts.forEach(post => {
      listEl.appendChild(createPostCard(post));
    });
  } catch (err) {
    console.error('[feed] 로드 실패:', err);
    listEl.innerHTML = '<p class="error">불러오기에 실패했습니다.</p>';
  }
}

//검색
let searchTimer;
document.getElementById('searchInput').addEventListener('input', (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    renderFeed(e.target.value.trim());
  }, 300);
});

// 헬퍼
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

renderFeed();