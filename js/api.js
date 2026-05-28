const BASE_URL = 'https://ieum-backend-api-35900716842.asia-northeast3.run.app/api'

/**
 * @param {string} endpoint // API 엔드포인트 (예: '/auth/login')
 * @param {object} option // fetch 옵션 (method, body 등)
 * @returns {Promise<any>} // JSON 응답 데이터
 */

async function fetchAPI(endpoint, option={}) {
  const token = localStorage.getItem('accessToken');
  const headers = { 'Content-Type' : 'application/json', ...option.headers };

  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  if (option.body instanceof FormData) { delete headers['Content-Type']; }; // 파일 업로드 시 boundary 자동 계산하도록 Content-Type 삭제

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...option, headers,
    });

    if (response.status === 204) { return null; } // 글 삭제 등 204 error 시 NULL 반환

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        alert('로그인이 만료되었습니다.\n다시 로그인해주세요.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        const isPages = location.pathname.includes('/pages/');
        window.location.href = isPages ? './login.html' : './pages/login.html';
        return;
      }
      throw new Error(data.message || '서버 통신 중 오류가 발생했습니다.');
    }
    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}: `, error);
    throw error;
  }
}