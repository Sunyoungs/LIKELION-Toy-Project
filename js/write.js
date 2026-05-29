const token = localStorage.getItem('accessToken');
if (!token) {
  alert('로그인이 필요한 서비스입니다.\n먼저 로그인을 진행해주세요.');
  window.location.href = './login.html';
}

// ── 카테고리 선택/취소 레이블 동기화 ─────────────────────────
document.querySelectorAll('.write-category-list input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.cat-select-label').forEach(s => s.textContent = '선택');
    if (radio.checked) radio.closest('li').querySelector('.cat-select-label').textContent = '취소';
  });
});

// ── 자유 태그 ──────────────────────────────────────────────
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

// ── 파일 첨부 ──────────────────────────────────────────────
const file = document.getElementById('fileCheck');
const fileList = document.getElementById('fileList');
let selectFile = [];

if (file) {
  file.addEventListener('change', function() {
    const newFile = Array.from(this.files);
    if (selectFile.length + newFile.length > 3) {
      alert('파일은 최대 3개까지 첨부할 수 있습니다.');
      this.value = '';
      return;
    }

    const MAX_IMAGE = 10 * 1024 * 1024;
    const MAX_VIDEO = 50 * 1024 * 1024;
    const MAX_AUDIO = 20 * 1024 * 1024;

    for (let i = 0; i < newFile.length; i++) {
      const nowFile = newFile[i];
      const typeFile = nowFile.type || '';
      const sizeFile = nowFile.size;
      const ext = nowFile.name.split('.').pop().toLowerCase();

      if (sizeFile > MAX_VIDEO) {
        alert(`파일(${nowFile.name}) 용량이 너무 큽니다. (최대 50MB)`);
        this.value = '';
        return;
      }
      const isImage = typeFile.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
      const isVideo = typeFile.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv'].includes(ext);
      const isAudio = typeFile.startsWith('audio/') || ['mp3', 'wav', 'm4a'].includes(ext);

      if (isImage && sizeFile > MAX_IMAGE) {
        return alert(`이미지 파일(${nowFile.name})이(가) 10MB를 초과했습니다.`);
      } else if (isVideo && sizeFile > MAX_VIDEO) {
        return alert(`비디오 파일(${nowFile.name})이(가) 50MB를 초과했습니다.`);
      } else if (isAudio && sizeFile > MAX_AUDIO) {
        return alert(`오디오 파일(${nowFile.name})이(가) 20MB를 초과했습니다.`);
      }
    }
    selectFile = [...selectFile, ...newFile];
    updateFileUI();
    this.value = '';
  });
}

function updateFileUI() {
  const data = new DataTransfer();
  selectFile.forEach(e => data.items.add(e));
  file.files = data.files;
  fileList.innerHTML = '';
  if (selectFile.length === 0) {
    fileList.style.display = 'none';
    return;
  }
  fileList.style.display = 'flex';
  selectFile.forEach((e, index) => {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file-div';
    fileDiv.innerHTML = `<span style="display:flex;align-items:center;gap:8px"><img src="../images/file.svg" style="width:16px;height:16px">${e.name}</span><button class="delete-button" data-index="${index}">✕</button>`;
    fileList.appendChild(fileDiv);
  });
  document.querySelectorAll('.delete-button').forEach(b => {
    b.addEventListener('click', e => {
      e.preventDefault();
      selectFile.splice(parseInt(e.target.dataset.index), 1);
      updateFileUI();
    });
  });
}

// ── 취소 ───────────────────────────────────────────────────
document.getElementById('write-cancel').addEventListener('click', e => {
  e.preventDefault();
  if (confirm('작성을 취소하시겠습니까?\n작성 중인 내용은 저장되지 않습니다.')) {
    window.location.href = '../index.html';
  }
});

// ── 업로드 ─────────────────────────────────────────────────
document.getElementById('write-upload').addEventListener('click', async e => {
  e.preventDefault();
  const title = document.getElementById('writeTitle').value;
  const text = document.getElementById('writeText').value;

  if (!title || !text) return alert('제목과 내용을 모두 작성해주세요.');

  const selectedCategories = Array.from(
    document.querySelectorAll('input[name="category"]:checked')
  ).map(el => el.value);

  const allTags = [...selectedCategories, ...customTags];
  if (allTags.length === 0) return alert('카테고리 또는 태그를 1개 이상 선택해주세요.');

  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', text);
  formData.append('tags', allTags.join(','));

  selectFile.forEach(nowFile => formData.append('clues', nowFile));

  try {
    await fetchAPI('/posts/', { method: 'POST', body: formData });
    alert('글 작성이 완료되었습니다!');
    window.location.href = '../index.html';
  } catch (error) {
    alert(error.message);
  }
});
