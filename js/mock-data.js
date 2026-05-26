// GET /posts 응답 형태 (2.1)
export const MOCK_POSTS = [
  {
    post_id: 1,
    author_username: "김태희",
    title: "2016년 xx초등학교 6학년 3반 짝꿍 찾습니다",
    tags: ["2016년", "xx초등학교", "짝꿍"],
    created_at: "2026-05-19T10:00:00Z",
  },
  {
    post_id: 2,
    author_username: "김예원",
    title: "작년 제주도 비행기 옆자리 분 찾아요",
    tags: ["제주도", "비행기"],
    created_at: "2026-05-20T14:30:00Z",
  },
  {
    post_id: 3,
    author_username: "황선영",
    title: "강남역 2번 출구에서 우산 빌려주신 분",
    tags: [],
    created_at: "2026-05-21T09:00:00Z",
  },
  {
    post_id: 4,
    author_username: "김지유",
    title: "홍대 클럽 앞에서 지갑 주워주신 분 감사해요",
    tags: ["홍대", "지갑", "감사"],
    created_at: "2026-05-22T18:00:00Z",
  },
  {
    post_id: 5,
    author_username: "유윤민",
    title: "2022 수능 고사장에서 샤프 빌려주신 분",
    tags: ["2022", "수능", "고사장"],
    created_at: "2026-05-23T08:00:00Z",
  },
  {
    post_id: 6,
    author_username: "한소희",
    title: "작년 여름 부산 해운대 파라솔 옆 분들 찾아요",
    tags: ["부산", "해운대", "여름"],
    created_at: "2026-05-23T20:00:00Z",
  },
  {
    post_id: 7,
    author_username: "김철수",
    title: "신촌역 카페에서 노트북 충전기 빌려주신 분",
    tags: ["신촌", "카페"],
    created_at: "2026-05-24T13:00:00Z",
  },
  {
    post_id: 8,
    author_username: "오태양",
    title: "2019 벚꽃 축제 여의도에서 찍어주신 분",
    tags: ["여의도", "벚꽃", "2019"],
    created_at: "2026-05-25T11:30:00Z",
  },
];

// GET /posts/{postId} 응답 형태 (2.2) - 상세
export const MOCK_POST_DETAIL = {
  1: {
    post_id: 1,
    author_username: "김철수",
    title: "2016년 xx초등학교 6학년 3반 짝꿍 찾습니다",
    content: "그때 엄청 조용하고 책만 읽던 친구였는데, 갑자기 전학을 가서 인사를 못 했네요. 혹시 기억하시는 분 있으면 연락 주세요.",
    sns_link: "https://open.kakao.com/o/sOmElinK",
    tags: ["2016년", "xx초등학교", "짝꿍"],
    clues: [
      { file_type: "IMAGE", file_url: "https://picsum.photos/600/400?random=1" }
    ],
    created_at: "2026-05-19T10:00:00Z",
    updated_at: "2026-05-19T10:00:00Z",
  },
  2: {
    post_id: 2,
    author_username: "이영희",
    title: "작년 제주도 비행기 옆자리 분 찾아요",
    content: "김포→제주 JJ123편이었어요. 난기류 때서 많이 무서웠는데 옆에서 말 걸어주셔서 정말 다행이었어요. 감사 인사 꼭 전하고 싶어요.",
    sns_link: "https://instagram.com/lee_yh",
    tags: ["제주도", "비행기"],
    clues: [
      { file_type: "IMAGE", file_url: "https://picsum.photos/600/400?random=2" },
      { file_type: "AUDIO", file_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
    ],
    created_at: "2026-05-20T14:30:00Z",
    updated_at: "2026-05-20T14:30:00Z",
  },
  3: {
    post_id: 3,
    author_username: "박민수",
    title: "강남역 2번 출구에서 우산 빌려주신 분",
    content: "5월 초 갑자기 폭우가 쏟아졌을 때 처음 보는 저한테 우산을 빌려주셨어요. 돌려드리지 못해서 너무 마음에 걸립니다.",
    sns_link: "",
    tags: [],
    clues: [],
    created_at: "2026-05-21T09:00:00Z",
    updated_at: "2026-05-21T09:00:00Z",
  },
  4: {
    post_id: 4,
    author_username: "최지은",
    title: "홍대 클럽 앞에서 지갑 주워주신 분 감사해요",
    content: "지난주 토요일 새벽 2시쯤 홍대 주차장 거리 근처에서 지갑을 잃어버렸는데 경비실에 맡겨주셨더라고요. 덕분에 카드랑 신분증을 찾았어요. 감사합니다!",
    sns_link: "https://open.kakao.com/o/aNoThErLinK",
    tags: ["홍대", "지갑", "감사"],
    clues: [
      { file_type: "IMAGE", file_url: "https://picsum.photos/600/400?random=4" }
    ],
    created_at: "2026-05-22T18:00:00Z",
    updated_at: "2026-05-22T18:00:00Z",
  },
  5: {
    post_id: 5,
    author_username: "정우진",
    title: "2022 수능 고사장에서 샤프 빌려주신 분",
    content: "긴장해서 필통을 놓고 왔는데 옆 칸에서 샤프를 건네주셨어요. 덕분에 시험 잘 봤고 원하는 대학도 갔답니다. 꼭 감사 인사 전하고 싶어요.",
    sns_link: "",
    tags: ["2022", "수능", "고사장"],
    clues: [
      { file_type: "IMAGE", file_url: "https://picsum.photos/600/400?random=5" },
      { file_type: "VIDEO", file_url: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ],
    created_at: "2026-05-23T08:00:00Z",
    updated_at: "2026-05-23T08:00:00Z",
  },
  6: {
    post_id: 6,
    author_username: "한소희",
    title: "작년 여름 부산 해운대 파라솔 옆 분들 찾아요",
    content: "혼자 여행 갔다가 파라솔을 못 빌려서 곤란했는데 같이 써도 된다고 해주셨어요. 시원한 수박도 나눠주셔서 정말 행복한 하루였어요.",
    sns_link: "https://instagram.com/han_sh",
    tags: ["부산", "해운대", "여름"],
    clues: [
      { file_type: "IMAGE", file_url: "https://picsum.photos/600/400?random=6" }
    ],
    created_at: "2026-05-23T20:00:00Z",
    updated_at: "2026-05-23T20:00:00Z",
  },
  7: {
    post_id: 7,
    author_username: "김철수",
    title: "신촌역 카페에서 노트북 충전기 빌려주신 분",
    content: "발표 자료 마무리하다가 배터리가 1%였는데 흔쾌히 충전기를 빌려주셨어요. 덕분에 발표 준비 잘 마쳤습니다. 감사합니다!",
    sns_link: "https://open.kakao.com/o/sOmElinK",
    tags: ["신촌", "카페"],
    clues: [],
    created_at: "2026-05-24T13:00:00Z",
    updated_at: "2026-05-24T13:00:00Z",
  },
  8: {
    post_id: 8,
    author_username: "오태양",
    title: "2019 벚꽃 축제 여의도에서 찍어주신 분",
    content: "혼자 여의도 윤중로 산책 중에 사진 찍어드릴까요 하고 먼저 말 걸어주셔서 너무 예쁜 사진 남겼어요. DSLR로 찍어주셨는데 혹시 그 사진 받을 수 있을까요.",
    sns_link: "",
    tags: ["여의도", "벚꽃", "2019"],
    clues: [
      { file_type: "IMAGE", file_url: "https://picsum.photos/600/400?random=8" }
    ],
    created_at: "2026-05-25T11:30:00Z",
    updated_at: "2026-05-25T11:30:00Z",
  },
};

// 현재 로그인 유저 (본인 글 여부 판단용 - 플로우차트의 "본인 글 여부" 분기)
export const MOCK_CURRENT_USER = {
  username: "김철수",  // 이걸로 author_username과 비교
};