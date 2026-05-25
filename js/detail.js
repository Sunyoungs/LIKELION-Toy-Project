
import { MOCK_POST_DETAIL, MOCK_CURRENT_USER } from './mock-data.js';


async function fetchPostDetail(postId) {
  // A 파트 api.js 완성 시 아래 mock 로직을 fetch로 교체
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const post = MOCK_POST_DETAIL[postId];
      post ? resolve(post) : reject(new Error('not found'));
    }, 200);
  });
}

async function deletePost(postId) {
  // TODO: 통합 시 → fetch(`${BASE_URL}/posts/${postId}`, { method: 'DELETE', headers: { Authorization: ... }})
  console.log(`[mock] DELETE /posts/${postId}`);
  return new Promise(r => setTimeout(r, 200));
}

// 렌더링
function renderDetail(post) {
  const cluesHTML = (post.clues || []).map(clue => {
    if (clue.file_type === 'IMAGE') {
      return `<img src="${clue.file_url}" alt="단서 이미지" />`;
    }
    if (clue.file_type === 'VIDEO') {
      return `<video src="${clue.file_url}" controls></video>`;
    }
    if (clue.file_type === 'AUDIO') {
      return `<audio src="${clue.file_url}" controls></audio>`;
    }
    return '';
  }).join('');

  document.getElementById('postDetail').innerHTML = `
    <h2>${escapeHTML(post.title)}</h2>
    <div class="meta">
      <span>${escapeHTML(post.author_username)}</span>
      <time>${new Date(post.created_at).toLocaleString('ko-KR')}</time>
    </div>
    <div class="tags">
      ${post.tags.map(t => `<span class="tag">#${escapeHTML(t)}</span>`).join('')}
    </div>
    <p class="content">${escapeHTML(post.content)}</p>
    <div class="clues">${cluesHTML}</div>
    ${post.sns_link 
      ? `<a class="sns-link" href="${post.sns_link}" target="_blank" rel="noopener">연락하기</a>` 
      : ''}
  `;
}

//본인 글 여부 분기
function setupOwnerActions(post) {
  const isMine = post.author_username === MOCK_CURRENT_USER.username;
  if (!isMine) return;

  document.getElementById('ownerActions').hidden = false;

  // 수정 → 작성 페이지로
  document.getElementById('editBtn').addEventListener('click', () => {
    location.href = `./write.html?edit=${post.post_id}`;
  });

  // 삭제 → 모달 열기
  const modal = document.getElementById('deleteModal');
  document.getElementById('deleteBtn').addEventListener('click', () => modal.showModal());
  document.getElementById('cancelDeleteBtn').addEventListener('click', () => modal.close());
  document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    await deletePost(post.post_id);
    location.href = '../index.html';
  });
}

// 시작
(async function init() {
  const postId = new URLSearchParams(location.search).get('id');
  if (!postId) {
    document.getElementById('postDetail').innerHTML = '<p>잘못된 접근입니다.</p>';
    return;
  }

  try {
    const post = await fetchPostDetail(postId);
    renderDetail(post);
    setupOwnerActions(post);
  } catch {
    document.getElementById('postDetail').innerHTML = '<p>게시글을 찾을 수 없습니다.</p>';
  }
})();

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}