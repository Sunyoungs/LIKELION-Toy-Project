```
███████╗       ██╗   ██╗███╗   ███╗
██╔════╝       ██║   ██║████╗ ████║
█████╗  ██████╗██║   ██║██╔████╔██║
██╔══╝  ╚═════╝██║   ██║██║╚██╔╝██║
███████╗       ╚██████╔╝██║ ╚═╝ ██║
╚══════╝        ╚═════╝ ╚═╝     ╚═╝
```

# 이음 (E-UM) 🔗

> 스쳐 지나간 인연을 다시 연결하다  
> 닿지 못한 인연을 다시 잇는 **시절 인연 아카이브 서비스**

<br>

## 프로젝트 소개

우리는 이미 아는 사람과만 연결되고 있다. 하지만, 우리에게 **닿지 못한 인연**이 여전히 존재한다.

> 버스정류장에서 늘 마주치던 그 사람, 전학 간 뒤 인사를 못 했던 짝꿍, 다시 만나고 싶었지만 연락처를 몰랐던 그 누군가.

**이음**은 기억 속 특정 순간과 사람을 글로 기록하고, 장소·시간·감성 키워드를 단서 태그로 남기는 감성 기반 아카이빙 웹 서비스입니다.  
피드를 열람하거나 키워드로 검색해 자신이 그 글의 주인공일 수 있는지 확인할 수 있습니다.

이음은 꼭 누군가를 **'찾기 위해서'** 사용하는 것이 아닙니다.  
글을 작성하는 행위 자체로 시절 인연을 기억하고 마음을 정리할 수 있습니다.

<br>

## 팀 소개

**삼육대 × 서울여대 멋쟁이사자처럼 14기 연합 프로젝트 — 프론트엔드**

<br>

## 기술 스택

| 분류 | 기술 |
|------|------|
| 마크업 | ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) |
| 스타일 | ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) |
| 로직 | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) Vanilla JS (ES6+) |
| 통신 | REST API (Fetch API) |
| 인증 | JWT (Access / Refresh Token) |
| 배포 | ![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat-square&logo=github&logoColor=white) |

<br>

## 주요 기능

### 📝 글 작성
- 제목, 본문, 카테고리 태그 작성
- 사진 / 영상 / 녹음 파일 단서 첨부 (최대 3개)

### 📋 피드 열람
- 전체 게시글 최신순 / 오래된순 정렬
- 카테고리 필터링 (학창시절 | 대학·모임 | 동네·일상 | 대중교통 | 식당 | 여행 | 직장·아르바이트)
- 제목·내용·태그 통합 키워드 검색

### 🔍 글 상세 조회
- 게시글 내용 및 첨부 단서 파일 확인
- 작성자 SNS 링크를 통한 연락 가능

### ✏️ 글 수정 / 삭제
- 작성자 본인만 수정 및 삭제 가능

### 👤 마이페이지
- 내가 작성한 글 모아보기
- SNS 링크 등록 및 수정

### 🔐 인증
- 아이디 + 비밀번호 기반 회원가입 / 로그인
- Refresh Token 블랙리스트 처리 기반 로그아웃
- 회원 탈퇴 (작성 게시글 및 파일 연쇄 삭제)

<br>

## 프로젝트 구조

```
LIKELION-Toy-Project/
├── index.html              # 메인 피드
├── css/
│   ├── style.css           # 공통 스타일
│   ├── feed.css            # 피드 스타일
│   ├── detail.css          # 상세 페이지 스타일
│   ├── write.css           # 작성/수정 페이지 스타일
│   ├── profile.css         # 마이페이지 스타일
│   ├── join.css            # 회원가입 스타일
│   └── login.css           # 로그인 스타일
├── js/
│   ├── api.js              # 공통 API 통신 유틸
│   ├── feed.js             # 피드 로직
│   ├── detail.js           # 상세 페이지 로직
│   ├── write.js            # 글 작성 로직
│   ├── edit.js             # 글 수정 로직
│   └── profile.js          # 마이페이지 로직
├── pages/
│   ├── detail.html
│   ├── write.html
│   ├── edit.html
│   ├── profile.html
│   ├── login.html
│   └── join.html
└── images/                 # 이미지 및 SVG 에셋
```

<br>

## 시작하기

별도의 빌드 과정 없이 바로 실행할 수 있습니다.

```bash
git clone https://github.com/Sunyoungs/LIKELION-Toy-Project.git
cd LIKELION-Toy-Project
# index.html을 브라우저에서 열거나 Live Server로 실행
```

또는 배포된 서비스를 바로 이용할 수 있습니다.  
👉 **[이음 바로가기](https://sunyoungs.github.io/LIKELION-Toy-Project/)**

<br>

## API 연동

백엔드 서버: `https://ieum-backend-api-35900716842.asia-northeast3.run.app/api`

모든 API 통신은 `js/api.js`의 `fetchAPI()` 함수를 통해 일원화되어 있으며, JWT 인증 헤더 자동 삽입 및 공통 에러 처리가 적용되어 있습니다.
