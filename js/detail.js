async function fetchPostDetail(postId) {
  return await fetchAPI(`/posts/${postId}/`);
}

async function deletePost(postId) {
  await fetchAPI(`/posts/${postId}/`, { method: 'DELETE' });
}

function renderDetail(post) {
  const left = document.querySelector('.detail-left');
  const tags = post.tags || [];

  left.innerHTML = `
    <h2>${escapeHTML(post.title)}</h2>
    <div class="meta">
      <time>${new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</time>
      <span class="meta-sep">·</span>
      <span>${escapeHTML(post.author_username)}</span>
    </div>
    <p class="content">${escapeHTML(post.content)}</p>
    ${tags.length > 0 ? `
      <div style="width: fit-content">
        <div class="side-tags-divider"></div>
        <div class="tags">
          ${tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
        </div>
      </div>
    ` : ''}
  `;

  document.querySelector('.detail-right').innerHTML = `
    ${renderSidePanel(post)}
  `;
}

function renderSidePanel(post) {
  const clues = (post.clues || []).map(renderClue).join('');
  const snsHTML = renderSnsLink(post.sns_link);

  if (!clues && !snsHTML) return '';

  return `
    <div class="detail-side-panel${clues ? '' : ' no-files'}">
      ${clues ? `<div class="side-files">${clues}</div>` : ''}
      ${clues && snsHTML ? '<div class="side-divider"></div>' : ''}
      ${snsHTML}
    </div>
  `;
}

function renderClue(clue) {
  if (clue.file_type === 'IMAGE') {
    return `
      <div class="clue-image" style="cursor: zoom-in" onclick="window.open('${escapeHTML(clue.file_url)}', '_blank')">
        <img src="${escapeHTML(clue.file_url)}" alt="단서 이미지">
      </div>
    `;
  }
  if (clue.file_type === 'VIDEO') return renderAttachment(clue, '동영상 파일');
  if (clue.file_type === 'AUDIO') return renderAttachment(clue, '녹음 파일');
  return '';
}

function renderAttachment(clue, fallbackName) {
  const fileName = getFileNameFromUrl(clue.file_url, fallbackName);
  return `
    <div class="clue-attachment">
      <img class="clue-attach-icon" src="../images/file.svg" alt="" aria-hidden="true">
      <div class="clue-attachment-text">
        <p class="clue-file-name">${escapeHTML(fileName)}</p>
      </div>
      <a
        class="clue-download-link"
        href="${escapeHTML(clue.file_url)}"
        download="${escapeHTML(fileName)}"
        aria-label="${escapeHTML(fileName)} 다운로드"
      >
        <img class="clue-download-icon" src="../images/download.svg" alt="다운로드" aria-hidden="true">
      </a>
    </div>
  `;
}

function getFileNameFromUrl(fileUrl, fallbackName) {
  try {
    const { pathname } = new URL(fileUrl, location.href);
    const fileName = decodeURIComponent(pathname.split('/').filter(Boolean).pop() || '');
    return fileName || fallbackName;
  } catch {
    return fallbackName;
  }
}

function renderSnsLink(snsLink) {
  if (!snsLink) return '';
  return `
    <div class="sns-section">
      <a class="sns-item" href="${escapeHTML(snsLink)}" target="_blank" rel="noopener">SNS 바로가기 &gt;
      </a>
    </div>
  `;
}

function renderCategories(tags) {
  const PRESET_TAGS = ['학창시절', '대중교통', '관광명소', '편의시설'];
  const flatTags = (tags || []).flatMap(t => t.split(',').map(s => s.trim())).filter(Boolean);
  flatTags.forEach(tag => {
    if (PRESET_TAGS.includes(tag)) {
      const cb = document.querySelector(`.detail-category-list input[value="${tag}"]`);
      if (cb) cb.checked = true;
    }
  });
}

function setupOwnerActions(post, myUsername) {
  if (post.author_username !== myUsername) return;
  document.getElementById('ownerActions').hidden = false;
  document.getElementById('editBtn').addEventListener('click', () => {
    location.href = `./edit.html?id=${post.post_id}`;
  });
  const modal = document.getElementById('deleteModal');
  document.getElementById('deleteBtn').addEventListener('click', () => {
    document.getElementById('modalPostTitle').textContent = post.title;
    modal.showModal();
  });
  document.getElementById('modalCloseBtn').addEventListener('click', () => modal.close());
  document.getElementById('cancelDeleteBtn').addEventListener('click', () => modal.close());
  document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    try {
      await deletePost(post.post_id);
      alert('게시글이 삭제되었습니다.');
      location.href = '../index.html';
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다: ' + error.message);
    }
  });
}

// ── 정렬 & 네비게이션 ───────────────────────────────────────
let currentSort = 'newest';
let feedContext = null;
let currentPostId = null;

function getSortedIds() {
  if (!feedContext) return null;
  if (!feedContext.timestamps) return [...feedContext.ids];
  return [...feedContext.ids].sort((a, b) => {
    const diff = new Date(feedContext.timestamps[b]) - new Date(feedContext.timestamps[a]);
    return currentSort === 'newest' ? diff : -diff;
  });
}

function refreshNav(postIdNum) {
  const countEl = document.querySelector('.detail-count');
  const sortedIds = getSortedIds();
  if (!sortedIds) return;

  const idx = sortedIds.indexOf(postIdNum);
  if (idx === -1) return;

  const total = sortedIds.length;
  if (countEl) { countEl.style.display = ''; countEl.textContent = `총 ${total}개 중 ${idx + 1}번째`; }

  const prevBtn = document.getElementById('prevPost');
  const nextBtn = document.getElementById('nextPost');

  if (prevBtn) {
    const newPrev = prevBtn.cloneNode(true);
    prevBtn.replaceWith(newPrev);
    newPrev.style.display = '';
    newPrev.disabled = idx === 0;
    newPrev.addEventListener('click', () => { location.href = `./detail.html?id=${sortedIds[idx - 1]}`; });
  }
  if (nextBtn) {
    const newNext = nextBtn.cloneNode(true);
    nextBtn.replaceWith(newNext);
    newNext.style.display = '';
    newNext.disabled = idx === total - 1;
    newNext.addEventListener('click', () => { location.href = `./detail.html?id=${sortedIds[idx + 1]}`; });
  }
}

document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSort = btn.dataset.sort;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const sortLabel = document.getElementById('detailSortLabel');
    if (sortLabel) sortLabel.textContent = currentSort === 'newest' ? '최신순' : '오래된순';
    if (feedContext) {
      feedContext.sort = currentSort;
      sessionStorage.setItem('feedContext', JSON.stringify(feedContext));
    }
    if (currentPostId !== null) refreshNav(currentPostId);
  });
});

(async function init() {
  const params = new URLSearchParams(location.search);
  const postId = params.get('id');
  currentPostId = parseInt(postId);

  if (!postId) {
    document.querySelector('.detail-left').innerHTML = '<p>잘못된 접근입니다.</p>';
    return;
  }

  const myUsername = localStorage.getItem('username');

  try {
    const post = await fetchPostDetail(postId);
    renderDetail(post);
    renderCategories(post.tags);
    setupOwnerActions(post, myUsername);

    feedContext = JSON.parse(sessionStorage.getItem('feedContext') || 'null');
    if (feedContext) {
      if (feedContext.sort) {
        currentSort = feedContext.sort;
        document.querySelectorAll('.sort-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.sort === currentSort);
        });
        const sortLabel = document.getElementById('detailSortLabel');
        if (sortLabel) sortLabel.textContent = currentSort === 'newest' ? '최신순' : '오래된순';
      }
      refreshNav(currentPostId);
    }
  } catch (error) {
    document.querySelector('.detail-left').innerHTML = '<p>게시글을 찾을 수 없거나 삭제되었습니다.</p>';
  }
})();

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}