
// GET /posts 응답 형태 (2.1)
export const MOCK_POSTS = [
  {
    post_id: 1,
    author_username: "김철수",
    title: "2016년 xx초등학교 6학년 3반 짝꿍 찾습니다",
    tags: ["2016년", "xx초등학교", "짝꿍"],
    created_at: "2026-05-19T10:00:00Z",
  },
  {
    post_id: 2,
    author_username: "이영희",
    title: "작년 제주도 비행기 옆자리 분 찾아요",
    tags: ["제주도", "비행기"],
    created_at: "2026-05-20T14:30:00Z",
  },
  {
    post_id: 3,
    author_username: "박민수",
    title: "강남역 2번 출구에서 우산 빌려주신 분",
    tags: [],  // ← 태그 없는 케이스
    created_at: "2026-05-21T09:00:00Z",
  },
  // 최소 5~8개, 태그 0개/많은 것/제목 긴 것 섞기
];

// GET /posts/{postId} 응답 형태 (2.2) - 상세
export const MOCK_POST_DETAIL = {
  1: {
    post_id: 1,
    author_username: "김철수",
    title: "2016년 xx초등학교 6학년 3반 짝꿍 찾습니다",
    content: "그때 엄청 조용하고 책만 읽던 친구였는데, 갑자기 전학을 가서 인사를 못 했네요.",
    sns_link: "https://open.kakao.com/o/sOmElinK",
    tags: ["2016년", "xx초등학교", "짝꿍"],
    clues: [
      {
        file_type: "IMAGE",
        file_url: "https://picsum.photos/600/400?random=1"
      }
    ],
    created_at: "2026-05-19T10:00:00Z",
    updated_at: "2026-05-19T10:00:00Z"
  },
  // post_id별로 추가...
};

// 현재 로그인 유저 (본인 글 여부 판단용 - 플로우차트의 "본인 글 여부" 분기)
export const MOCK_CURRENT_USER = {
  username: "김철수",  // 이걸로 author_username과 비교
};