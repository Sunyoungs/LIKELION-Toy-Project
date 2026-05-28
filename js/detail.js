async function fetchPostDetail(postId) {
  return await fetchAPI(`/posts/${postId}`);
}

async function deletePost(postId) {
  await fetchAPI(`/posts/${postId}`, { method: 'DELETE' });
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

(async function init() {
  const params = new URLSearchParams(location.search);
  const postId = params.get('id');

  const countEl = document.querySelector('.detail-count');
  const prevBtn = document.getElementById('prevPost');
  const nextBtn = document.getElementById('nextPost');
  
  if (countEl) countEl.style.display = 'none';
  if (prevBtn) prevBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';

  if (!postId) {
    document.querySelector('.detail-left').innerHTML = '<p>잘못된 접근입니다.</p>';
    return;
  }

  const myUsername = localStorage.getItem('username');

  try {
    const post = await fetchPostDetail(postId); // 진짜 API로 데이터 가져오기!
    renderDetail(post);
    setupOwnerActions(post, myUsername);
  } catch (error) {
    document.querySelector('.detail-left').innerHTML = '<p>게시글을 찾을 수 없거나 삭제되었습니다.</p>';
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
