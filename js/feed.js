let allPosts = [];
let currentPage = 0;
const CARDS_PER_PAGE = 6;
let currentSort = 'newest';
let currentCategory = '';

document.querySelectorAll('.category-item').forEach(item => {
  item.addEventListener('click', () => {
    currentCategory = item.dataset.category ?? '';
    document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    renderFeed(document.getElementById('searchInput').value.trim());
  });
});

document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSort = btn.dataset.sort;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const sortLabel = document.getElementById('feedSortLabel');
    if (sortLabel) sortLabel.textContent = currentSort === 'newest' ? '최신순' : '오래된순';
    renderFeed(document.getElementById('searchInput').value.trim());
  });
});

// 통합 시 이 함수만 교체 (?search=, ?tag=, ?ordering= 파라미터 대응)
/*async function fetchPosts(searchKeyword = '', category = '') {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = MOCK_POSTS;
      if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(kw) ||
          p.tags.some(t => t.toLowerCase().includes(kw))
        );
      }
      if (category) filtered = filtered.filter(p => p.tags.includes(category));
      resolve(filtered);
    }, 200);
  });
}*/

async function fetchPosts(searchKeyword = '', category = '') {
  const params = new URLSearchParams();

  if (searchKeyword) params.append('search', searchKeyword);
  if (category) params.append('tag', category);
  if (currentSort === 'oldest') params.append('ordering', 'oldest');

  const queryString = params.toString() ? `?${params.toString()}` : '';

  return await fetchAPI(`/posts/${queryString}`);
}

function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'post-card';
  article.dataset.postId = post.post_id;

  // 이미지 플레이스홀더 + 날짜·작성자 오버레이
  const thumb = document.createElement('div');
  thumb.className = 'post-thumb';
  if (post.thumbnail_url) {
    thumb.style.backgroundImage = `url("${post.thumbnail_url}")`;
    thumb.style.backgroundSize = 'cover';
    thumb.style.backgroundPosition = 'center';
    thumb.style.backgroundRepeat = 'no-repeat';
  }

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

  const PRESET_TAGS = ['학창시절', '대중교통', '관광명소', '편의시설'];
  const flatTags = (post.tags || []).flatMap(t => t.split(',').map(s => s.trim())).filter(Boolean);
  const tagsDiv = document.createElement('div');
  tagsDiv.className = 'post-tags';
  flatTags.filter(t => !PRESET_TAGS.includes(t)).forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = `${t}`;
    tagsDiv.appendChild(span);
  });

  body.append(title, tagsDiv);
  article.append(thumb, body);

  article.addEventListener('click', () => {
    sessionStorage.setItem('feedContext', JSON.stringify({
      ids: allPosts.map(p => p.post_id),
      timestamps: Object.fromEntries(allPosts.map(p => [p.post_id, p.created_at])),
      sort: currentSort
    }));
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
    const fetched = await fetchPosts(keyword, currentCategory);
    allPosts = [...fetched].sort((a, b) => {
      const diff = new Date(b.created_at) - new Date(a.created_at);
      return currentSort === 'newest' ? diff : -diff;
    });
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
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

async function updateCategoryCounts() {
  try {
    const posts = await fetchAPI('/posts/');
    const totalEl = document.querySelector('.category-item[data-category=""] .category-count');
    if (totalEl) totalEl.textContent = posts.length;
    ['학창시절', '대중교통', '관광명소', '편의시설'].forEach(cat => {
      const el = document.querySelector(`.category-item[data-category="${cat}"] .category-count`);
      if (el) el.textContent = posts.filter(p => {
        const flat = (p.tags || []).flatMap(t => t.split(',').map(s => s.trim()));
        return flat.includes(cat);
      }).length;
    });
  } catch (e) {
    console.error('[feed] 카테고리 카운트 로드 실패:', e);
  }
}

renderFeed();
updateCategoryCounts();
