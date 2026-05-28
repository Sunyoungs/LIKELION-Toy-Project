const token = localStorage.getItem('accessToken');
if (!token) {
  alert('로그인이 필요한 서비스입니다.\n먼저 로그인을 진행해주세요.');
  window.location.href = './login.html';
}

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

    for (let i=0; i<newFile.length; i++) {
      const nowFile = newFile[i];
      const typeFile = nowFile.type || '';
      const sizeFile = nowFile.size;
      const ext = nowFile.name.split('.').pop().toLowerCase(); // 확장자 추출

      if (sizeFile > MAX_VIDEO) {
        alert(`파일(${nowFile.name}) 용량이 너무 큽니다. (최대 50MB)`);
        this.value = '';
        return;
      }
      // 확장자 및 타입 분류하여 상세 검사
      const isImage = typeFile.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
      const isVideo = typeFile.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv'].includes(ext);
      const isAudio = typeFile.startsWith('audio/') || ['mp3', 'wav', 'm4a'].includes(ext);

      if (isImage && sizeFile>MAX_IMAGE) {
        return alert(`이미지 파일(${nowFile.name})이(가) 10MB를 초과했습니다.`);
        this.value = '';
      } else if (isVideo && sizeFile>MAX_VIDEO) {
        return alert(`비디오 파일(${nowFile.name})이(가) 50MB를 초과했습니다.`);
        this.value = '';
      } else if (isAudio && sizeFile>MAX_AUDIO) {
        return alert(`오디오 파일(${nowFile.name})이(가) 20MB를 초과했습니다.`);
        this.value = '';
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
    fileDiv.className = "file-div";
    fileDiv.innerHTML = `<span style="display: flex; align-items: center; gap: 5px"><img src="../images/file.svg" style="width: 7px">${e.name}</span><button class="delete-button" data-index="${index}">✕</button>`;
    fileList.appendChild(fileDiv);
  });
  document.querySelectorAll('.delete-button').forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      const i = parseInt(e.target.dataset.index);
      selectFile.splice(i, 1);
      updateFileUI();
    });
  });
}

document.getElementById('write-cancel').addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('작성을 취소하시겠습니까?\n작성 중인 내용은 저장되지 않습니다.')) { window.location.href = "../index.html" }
});

document.getElementById('write-upload').addEventListener('click', async(e) => {
  e.preventDefault();
  const title = document.getElementById('writeTitle').value;
  const text = document.getElementById('writeText').value;
  const category = document.querySelectorAll('input[name="category"]:checked');

  if (!title || !text) { return alert('제목과 내용을 모두 작성해주세요.')};
  if (category.length === 0) { return alert('카테고리를 1개 이상 선택해주세요.')};
  const categoryString = Array.from(category).map(node => node.value).join(', ');

  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', text);
  formData.append('tags', categoryString);

  if (selectFile.length > 0) {
    selectFile.forEach(nowFile => {
      formData.append('clues', nowFile);
    });
  }
  try {
    await fetchAPI('/posts', {
      method: 'POST',
      body: formData
    });
    alert('글 작성이 완료되었습니다!');
    window.location.href = "../index.html";
  } catch (error) {
    alert(error.message);
  }
})