import { MOCK_POST_DETAIL, MOCK_POSTS, MOCK_CURRENT_USER } from './mock-data.js';

async function fetchPostDetail(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const post = MOCK_POST_DETAIL[postId];
      post ? resolve(post) : reject(new Error('not found'));
    }, 200);
  });
}

async function deletePost(postId) {
  console.log(`[mock] DELETE /posts/${postId}`);
  return new Promise(r => setTimeout(r, 200));
}

function renderDetail(post) {
  const left = document.querySelector('.detail-left');

  left.innerHTML = `
    <h2>${escapeHTML(post.title)}</h2>
    <div class="meta">
      <time>${new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</time>
      <span class="meta-sep">·</span>
      <span>${escapeHTML(post.author_username)}</span>
    </div>
    <p class="content">${escapeHTML(post.content)}</p>
    <div class="tags">
      ${post.tags.map(t => `<span class="tag">#${escapeHTML(t)}</span>`).join('')}
    </div>
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
      <div class="clue-image">
        <img src="${escapeHTML(clue.file_url)}" alt="단서 이미지">
      </div>
    `;
  }

  if (clue.file_type === 'VIDEO') {
    return renderAttachment(clue, '동영상 파일');
  }

  if (clue.file_type === 'AUDIO') {
    return renderAttachment(clue, '녹음 파일');
  }

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
  const label = snsLink.includes('instagram.com') ? '인스타그램' : '기타 SNS';
  return `
    <div class="sns-section">
      <a class="sns-item" href="${escapeHTML(snsLink)}" target="_blank" rel="noopener">
        <span class="sns-icon" aria-hidden="true"></span>${label}
      </a>
    </div>
  `;
}

function setupOwnerActions(post, myUsername) {
  if (post.author_username !== myUsername) return;

  document.getElementById('ownerActions').hidden = false;

  document.getElementById('editBtn').addEventListener('click', () => {
    location.href = `./write.html?edit=${post.post_id}`;
  });

  const modal = document.getElementById('deleteModal');
  document.getElementById('deleteBtn').addEventListener('click', () => {
    document.getElementById('modalPostTitle').textContent = post.title;
    modal.showModal();
  });
  document.getElementById('modalCloseBtn').addEventListener('click', () => modal.close());
  document.getElementById('cancelDeleteBtn').addEventListener('click', () => modal.close());
  document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    await deletePost(post.post_id);
    location.href = '../index.html';
  });
}

(async function init() {
  const params = new URLSearchParams(location.search);
  const postId = params.get('id');
  const from = params.get('from');

  // 이전/다음 글 네비게이션
  const myUsername = MOCK_CURRENT_USER.username;
  const navUsername = from === 'my' ? MOCK_CURRENT_USER.username : null;
  const sourcePosts = from === 'my'
    ? [...MOCK_POSTS]
        .filter(p => p.author_username === navUsername)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    : MOCK_POSTS;
  const allIds = sourcePosts.map(p => String(p.post_id));
  const currentIdx = allIds.indexOf(String(postId));
  const totalCount = allIds.length;

  const sourceLabel = document.getElementById('sourceLabel');
  if (sourceLabel && from === 'my') sourceLabel.textContent = '내가 올린 글';

  const countEl = document.querySelector('.detail-count');
  if (countEl) countEl.textContent = `총 ${totalCount}개 중 ${currentIdx + 1}개`;

  const fromParam = from ? `&from=${from}` : '';
  const prevBtn = document.getElementById('prevPost');
  const nextBtn = document.getElementById('nextPost');
  if (prevBtn) {
    prevBtn.disabled = currentIdx <= 0;
    prevBtn.addEventListener('click', () => {
      location.href = `./detail.html?id=${allIds[currentIdx - 1]}${fromParam}`;
    });
  }
  if (nextBtn) {
    nextBtn.disabled = currentIdx >= totalCount - 1;
    nextBtn.addEventListener('click', () => {
      location.href = `./detail.html?id=${allIds[currentIdx + 1]}${fromParam}`;
    });
  }

  if (!postId) {
    document.querySelector('.detail-left').innerHTML = '<p>잘못된 접근입니다.</p>';
    return;
  }

  try {
    const post = await fetchPostDetail(postId);
    renderDetail(post);
    setupOwnerActions(post, myUsername);
  } catch {
    document.querySelector('.detail-left').innerHTML = '<p>게시글을 찾을 수 없습니다.</p>';
  }
})();

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

document.querySelectorAll('.category-toggle-btn').forEach(btn => {
  const checkbox = btn.closest('li').querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => {
    btn.textContent = checkbox.checked ? '취소' : '선택';
  });
  btn.addEventListener('click', () => {
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event('change'));
  });
});
