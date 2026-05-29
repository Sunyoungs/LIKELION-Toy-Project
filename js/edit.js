const token = localStorage.getItem('accessToken');
if (!token) {
  alert('로그인이 필요한 서비스입니다.\n먼저 로그인을 진행해주세요.');
  window.location.href = './login.html';
}

const postId = new URLSearchParams(location.search).get('id');
if (!postId) {
  alert('잘못된 접근입니다.');
  window.location.href = '../index.html';
}

// ── 카테고리 선택/취소 레이블 동기화 ─────────────────────────
document.querySelectorAll('.write-category-list input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.cat-select-label').forEach(s => s.textContent = '선택');
    if (radio.checked) radio.closest('li').querySelector('.cat-select-label').textContent = '취소';
  });
});

// ── 자유 태그 ──────────────────────────────────────────────
const PRESET_TAGS = ['학창시절', '대중교통', '관광명소', '편의시설'];
let customTags = [];

function renderTagChips() {
  const container = document.getElementById('tagChips');
  container.innerHTML = '';
  customTags.forEach((tag, i) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `#${tag} <button type="button" class="chip-remove" data-index="${i}">×</button>`;
    container.appendChild(chip);
  });
  container.querySelectorAll('.chip-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      customTags.splice(parseInt(btn.dataset.index), 1);
      renderTagChips();
    });
  });
}

function addTag() {
  const input = document.getElementById('tagInput');
  const val = input.value.trim();
  if (!val) return;
  if (customTags.includes(val)) { input.value = ''; return; }
  customTags.push(val);
  input.value = '';
  renderTagChips();
}

document.getElementById('tagAddBtn').addEventListener('click', addTag);
document.getElementById('tagInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); addTag(); }
});

// ── 기존 데이터 로드 ───────────────────────────────────────
async function loadData() {
  try {
    const data = await fetchAPI(`/posts/${postId}/`);
    if (!data) {
      alert('존재하지 않는 게시글입니다.');
      window.location.href = '../index.html';
      return;
    }

    document.getElementById('writeTitle').value = data.title;
    document.getElementById('writeText').value = data.content;

    const flatTags = (data.tags || [])
      .flatMap(t => t.split(',').map(s => s.trim()))
      .filter(Boolean);
    let categorySet = false;
    flatTags.forEach(tag => {
      if (PRESET_TAGS.includes(tag) && !categorySet) {
        const radio = document.querySelector(`input[name="category"][value="${tag}"]`);
        if (radio) {
          radio.checked = true;
          categorySet = true;
          const label = radio.closest('li')?.querySelector('.cat-select-label');
          if (label) label.textContent = '취소';
        }
      } else if (!PRESET_TAGS.includes(tag)) {
        customTags.push(tag);
      }
    });
    renderTagChips();
  } catch (error) {
    alert('기존 글 정보를 불러오지 못했습니다.');
  }
}
loadData();

// ── 취소 ───────────────────────────────────────────────────
document.getElementById('edit-cancel').addEventListener('click', e => {
  e.preventDefault();
  if (confirm('수정을 취소하시겠습니까?\n수정 중인 내용은 저장되지 않습니다.')) {
    window.location.href = `./detail.html?id=${postId}`;
  }
});

// ── 수정 완료 ──────────────────────────────────────────────
document.getElementById('edit-upload').addEventListener('click', async e => {
  e.preventDefault();
  const title = document.getElementById('writeTitle').value;
  const text = document.getElementById('writeText').value;

  if (!title || !text) return alert('제목과 내용을 모두 작성해주세요.');

  const selectedCategories = Array.from(
    document.querySelectorAll('input[name="category"]:checked')
  ).map(el => el.value);

  const allTags = [...selectedCategories, ...customTags];
  if (allTags.length === 0) return alert('카테고리 또는 태그를 1개 이상 선택해주세요.');

  try {
    await fetchAPI(`/posts/${postId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ title, content: text, tags: allTags.join(',') })
    });
    alert('글 수정이 완료되었습니다!');
    window.location.href = `./detail.html?id=${postId}`;
  } catch (error) {
    alert(error.message);
  }
});
