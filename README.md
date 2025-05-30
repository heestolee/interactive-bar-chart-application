# 목차

- [🎯 목표 및 요구사항](#%F0%9F%8E%AF-%EB%AA%A9%ED%91%9C-%EB%B0%8F-%EC%9A%94%EA%B5%AC%EC%82%AC%ED%95%AD)

- [1. 주요 구현 사항](#1-%EC%A3%BC%EC%9A%94-%EA%B5%AC%ED%98%84-%EC%82%AC%ED%95%AD)
  - [✅ 기본 요구 사항](#%E2%9C%85-%EA%B8%B0%EB%B3%B8-%EC%9A%94%EA%B5%AC-%EC%82%AC%ED%95%AD)
  - [✅ 추가 구현 사항](#%E2%9C%85-%EC%B6%94%EA%B0%80-%EA%B5%AC%ED%98%84-%EC%82%AC%ED%95%AD)
    - [사용성(UX) 개선 요소](#%EC%82%AC%EC%9A%A9%EC%84%B1ux-%EA%B0%9C%EC%84%A0-%EC%9A%94%EC%86%8C)
    - [개발자 경험(DX) 및 구조 개선 요소](#%EA%B0%9C%EB%B0%9C%EC%9E%90-%EA%B2%BD%ED%97%98dx-%EB%B0%8F-%EA%B5%AC%EC%A1%B0-%EA%B0%9C%EC%84%A0-%EC%9A%94%EC%86%8C)
- [2. 디렉토리 구조](#2-%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EA%B5%AC%EC%A1%B0)
- [3. 구현 사항 톺아보기](#3-%EA%B5%AC%ED%98%84-%EC%82%AC%ED%95%AD-%ED%86%BA%EC%95%84%EB%B3%B4%EA%B8%B0)
  - [1. 차트 시각화](#1-%EC%B0%A8%ED%8A%B8-%EC%8B%9C%EA%B0%81%ED%99%94)
  - [2. 값 추가](#2-%EA%B0%92-%EC%B6%94%EA%B0%80)
  - [3. 값 편집](#3-%EA%B0%92-%ED%8E%B8%EC%A7%91)
  - [4. JSON 고급 편집](#4-json-%EA%B3%A0%EA%B8%89-%ED%8E%B8%EC%A7%91)
- [4. 구현 사항 상세 내용](#4-%EA%B5%AC%ED%98%84-%EC%82%AC%ED%95%AD-%EC%83%81%EC%84%B8-%EB%82%B4%EC%9A%A9)
  - [1. Feature-Sliced 구조 기반 모듈 분리](#1-feature-sliced-%EA%B5%AC%EC%A1%B0-%EA%B8%B0%EB%B0%98-%EB%AA%A8%EB%93%88-%EB%B6%84%EB%A6%AC)
  - [2. 차트 값 정규화: 로그 기반 정규화 적용](#2-%EC%B0%A8%ED%8A%B8-%EA%B0%92-%EC%A0%95%EA%B7%9C%ED%99%94-%EB%A1%9C%EA%B7%B8-%EA%B8%B0%EB%B0%98-%EC%A0%95%EA%B7%9C%ED%99%94-%EC%A0%81%EC%9A%A9)
  - [3. JSON 정제 및 유효성 검증 로직 구체화](#3-json-%EC%A0%95%EC%A0%9C-%EB%B0%8F-%EC%9C%A0%ED%9A%A8%EC%84%B1-%EA%B2%80%EC%A6%9D-%EB%A1%9C%EC%A7%81-%EA%B5%AC%EC%B2%B4%ED%99%94)
  - [4. 인터랙션 및 접근성 고려](#4-%EC%9D%B8%ED%84%B0%EB%9E%99%EC%85%98-%EB%B0%8F-%EC%A0%91%EA%B7%BC%EC%84%B1-%EA%B3%A0%EB%A0%A4)
  - [5. 에러 메시지 상수화](#5-%EC%97%90%EB%9F%AC-%EB%A9%94%EC%8B%9C%EC%A7%80-%EC%83%81%EC%88%98%ED%99%94)
  - [6. 직접 구현한 useState 훅](#6-%EC%A7%81%EC%A0%91-%EA%B5%AC%ED%98%84%ED%95%9C-usestate-%ED%9B%85)
  - [6. 전체 동기화 처리 (syncAll)](#6-%EC%A0%84%EC%B2%B4-%EB%8F%99%EA%B8%B0%ED%99%94-%EC%B2%98%EB%A6%AC-syncall)

# 🎯 목표 및 요구사항

이 프로젝트는 순수 자바스크립트(Vanilla JS)와 HTML, CSS만을 사용하여 구현한 인터랙티브 막대 차트 애플리케이션입니다. <br>
프레임워크나 외부 라이브러리 없이 HTML, CSS, JavaScript만으로 구성하였으며, 기능 명확성, 코드 품질, 확장성을 중점으로 작업하였습니다.

<br><br>

# 1. 주요 구현 사항

## ✅ 기본 요구 사항

- [x] 본인 이름 우측 상단에 명시
- [x] 그래프 영역에 값 시각화 (막대 차트)
- [x] 테이블 형식으로 값 수정 및 삭제 기능
- [x] 값 추가 기능 (ID + VALUE 입력 후 Add)
- [x] JSON 텍스트박스 편집 기능
- [x] Apply 버튼 클릭 시 모든 영역 동기화 처리

---

## ✅ 추가 구현 사항

### 사용성(UX) 개선 요소

- [x] 배치 레이아웃 개선: 세로로 나열된 컴포넌트를 스크롤 이동없이 모두 사용할할 수 있도록 개선
- [x] 차트 정규화: 로그 기반 정규화로 이상치에 강한 시각적 안정성 확보
- [x] 홀수/짝수 차트 바 색상 구분 → 시인성 및 비교 편의 향상
- [x] Add 입력 → Enter로 바로 작동 + 포커스 자동 이동 → 반복 입력 효율성 개선
- [x] CSS 정렬 및 여백 정비 → 시각적 정돈과 일관성 확보

---

### 개발자 경험(DX) 및 구조 개선 요소

- [x] `main.js`의 모든 기능을 역할별로 파일 분리
- [x] Feature-Sliced Design 방식의 디렉토리 구조 적용
- [x] 에러 메시지 상수 분리로 유지보수성과 테스트 편의 개선
- [x] 유효성 검증 로직 분리로 재사용성과 테스트 가능성 향상
- [x] JSON 정제 유틸로 일반적인 예외 입력을 정규화하여 UX 개선
- [x] `syncAll()`으로 차트 / 값 편집 / 고급 편집 일괄 갱신 → 흐름 제어를 단일화

<br><br><br>

# 2. `main.js` 구조

`main.js`의 코드는 아래의 논리적 섹션으로 구성되어 있습니다.

```text
1. 상수 및 오류 메시지 정의
2. 유효성 검사 함수
3. JSON 정제 유틸리티
4. 데이터 관리 로직
5. UI 렌더링 함수
6. 사용자 이벤트 처리 함수
7. 이벤트 리스너 및 초기화
```

모듈화 작업을 한다면 아래와 같은 디렉토리 구조로 구성됩니다.

```text
📦 root
├── index.html
├── index.css
├── main.js
│
├── store/
│   └── dataStore.js            # 전역 데이터 상태 보관 및 get/set 인터페이스 제공
├── render/
│   ├── chart.js                # 막대 그래프 시각화 렌더링 로직
│   ├── tableEditor.js          # 테이블 렌더링 및 삭제 버튼 처리
│   ├── jsonEditor.js           # JSON 에디터 텍스트 박스 렌더링
│   └── syncAll.js              # chart/table/json 동기 렌더링을 위한 통합 함수
├── features/
│   ├── addEntry.js             # ID + VALUE 입력 후 추가 기능
│   ├── applyTableChanges.js    # 테이블 입력값을 상태에 반영하는 기능
│   └── applyJsonEdit.js        # JSON 입력값 파싱 및 검증, 상태 반영 기능
└── utils/
    ├── cleanJsonInput.js       # JSON 입력 전처리 유틸
    └── validate.js             # ID, VALUE 입력 유효성 검증 유틸 함수
```

<br><br><br>

# 3. 구현 사항 톺아보기

### 1. 차트 시각화

- 비정상적으로 큰 값이 입력된 경우에도 시각적 왜곡없이 표현되도록 바의 높이를 로그 정규화하여 시각적 왜곡 완화
- hover 시 각 데이터의 ID와 값이 툴팁으로 표시
- 짝수/홀수 바에 다른 명도 색상 적용으로 시인성을 높임

### 2. 값 추가

- ID, VALUE 입력 후 `Add` 버튼 또는 Enter 키로 추가 가능하게 구현
- ID는 문자열/숫자 모두 가능하며, 중복 ID 방지 처리 포함
- 추가 즉시 테이블, 차트, JSON 영역이 모두 동기화됨

### 3. 값 편집

- 테이블에서 VALUE만 수정 가능 (ID는 고정)
- 삭제 버튼으로 행 제거 가능
- `Apply` 버튼으로 테이블 편집 내용을 반영

### 4. JSON 고급 편집

- 전체 데이터는 JSON 포맷으로 편집 가능
- 유효성 검사 (중복 ID, 잘못된 형식 등) 포함
- `//`, `/* */`, 트레일링 쉼표 등은 자동 정제(`cleanJsonInput()`)
- 오류 발생 시 적절한 메시지 표시

<br><br><br>

# 4. 구현 사항 상세 내용

### 1. 차트 값 정규화: 로그 기반 정규화 적용

- 일반적인 값 정규화(value / max) 대신 log(value) 기반으로 정규화
- 이상치(outlier)가 포함될 경우 시각적으로 압도되지 않도록 조정 <br>→ “데이터가 극단적일 경우에도 사용성이 보장되는 UX”로 차별화된 사용자 경험 제공

### 2. JSON 정제 및 유효성 검증 로직 구체화

- `cleanJsonInput()`으로 JSON 편집 시 사용자가 실수하기 쉬운 세 가지 케이스 직접 처리
  - 한줄 주석, 블럭 주석 제거
  - 트레일링 쉼표 제거
  - 정규식 없이 모든 처리를 수동 파서 방식으로 구현하여 디버깅과 안정성 확보
- `isValidId()`, `isValidValue()` 함수 분리하여 ID는 문자열/숫자 허용, VALUE는 숫자만 허용
  - 중복 ID는 Set을 통해 선제적으로 차단
  - 예외 발생 시 사용자에게 alert로 에러 타입별 메시지를 구분하여 전달

### 3. 인터랙션 및 접근성 고려

- '값 입력' 영역에서 Enter 입력 시 Add 트리거 및 ID input에 자동 포커스
- 차트 막대 hover 시 툴팁 노출 (ID/값), 짝수/홀수 bar 색상 대비 적용

### 4. 에러 메시지 상수화

- 하드코딩된 메시지를 상수화하여 메시지의 통합 관리 및 유지보수성 확보

### 5. 직접 구현한 useState 훅

- React의 `useState()`처럼 상태를 관리하는 함수를 정의
- `getData()`와 `setData()`를 통해 상태를 가져오고 갱신
  - `getData()`는 깊은 복사를 통해 참조 공유 방지
  - `setData()`는 불변성 유지를 위해 기존 배열을 덮어쓰기
- 모든 데이터 흐름이 이 상태를 기준으로 동작하도로 하여 상태 일관성과 예측 가능성 확보

### 6. 전체 동기화 처리 (syncAll)

- 데이터 변경이 일어날 경우 차트, 테이블, JSON 에디터 세 영역을 일관된 기준으로 갱신
- 모든 데이터 흐름의 단일 진입점으로서 재사용성과 예측 가능성을 높임

### 7. Feature-Sliced 구조 기반 모듈 분리 (모듈화 가정)

- store, render, features, utils 디렉토리로 기능 책임에 따라 분리
- 단순 script 한 파일로 몰지 않고 역할에 따라 구성요소를 나누어 유지보수성과 가독성 확보
