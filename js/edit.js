import { MOCK_POST_DETAIL } from "./mock-data.js";

const token = localStorage.getItem('accessToken');
if (!token) {
  alert('로그인이 필요한 서비스입니다.\n먼저 로그인을 진행해주세요.');
  window.location.href = './login.html';
}

const postId = new URLSearchParams(location.search).get('id');
if (!postId) {
  alert('잘못된 접근입니다.');
  window.location.href = "../index.html";
}

async function loadData() {
  try {
    const mockData = await fetchAPI(`/posts/${postId}`); 
    
    const mockData = MOCK_POST_DETAIL[postId];
    if (!mockData) {
      alert('존재하지 않는 게시글입니다.');
      window.location.href = "../index.html";
      return;
    }

    document.getElementById('writeTitle').value = mockData.title;
    document.getElementById('writeText').value = mockData.content;
    if (mockData.sns_link) {
      document.getElementById('writeSNS_ig').value = mockData.sns_link;
    }
    mockData.tags.forEach(e => {
      const category = document.querySelector(`input[name="category"][value="${e}"]`);
      if (category) category.checked = true;
    });
  } catch (error) {
    alert('기존 글 정보를 불러오지 못했습니다.');
  }
}
loadData();

document.getElementById('edit-cancel').addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('수정을 취소하시겠습니까?\n수정 중인 내용은 저장되지 않습니다.')) { window.location.href = `../pages/detail.html?id=${postId}`; }
});

document.getElementById('edit-upload').addEventListener('click', async(e) => {
  e.preventDefault();
  const title = document.getElementById('writeTitle').value;
  const text = document.getElementById('writeText').value;
  const snsIg = document.getElementById('writeSNS_ig').value;
  const snsEtc = document.getElementById('writeSNS_etc').value;
  const category = document.querySelectorAll('input[name="category"]:checked');

  if (!title || !text) { return alert('제목과 내용을 모두 작성해주세요.')};
  if (category.length === 0) { return alert('카테고리를 1개 이상 선택해주세요.')};
  const categoryString = Array.from(category).map(node => node.value).join(', ');

  const requestBody = {
    title: title,
    content: text,
    tags: categoryString
  };

  if (snsIg) requestBody.snsIg = snsIg;
  if (snsEtc) requestBody.snsEtc = snsEtc;

  try {
    console.log('-- [수정] 전송될 데이터 확인 --', requestBody);
    /* 백엔드 연결 후 통신하는 코드
    await fetchAPI(`/posts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify(requestBody)
    });
    */
    alert('글 수정이 완료되었습니다!');
    window.location.href = `../pages/detail.html?id=${postId}`;
  } catch (error) {
    alert(error.message);
  }
})