// 브라우저 드래그 앤 드랍 실행을 위해 모든 로직을 main.js에 모았습니다.
// 모듈화를 위해 분리했던 로직을 그대로 보존해두었습니다.

// ========== 1. 상수 및 오류 메시지 정의 ==========
const ERROR_MESSAGES = {
  INVALID_JSON_FORMAT: "JSON은 배열이어야 합니다.",
  DUPLICATE_ID: "ID는 중복될 수 없습니다.",
  INVALID_JSON_SYNTAX:
    "❌ JSON 문법 오류:\n\n올바른 문법으로 작성되었는지 확인해주세요.",
  INVALID_JSON_ENTRY: "ID와 VALUE 형식이 올바르지 않습니다.",
};

// ========== 2. 유효성 검사 함수 (9-17) ==========
/**
 * ID 유효성 검사 - 문자열 또는 숫자이며 공백이 아닌지 확인
 */
function isValidId(id) {
  return (
    (typeof id === "string" || typeof id === "number") &&
    String(id).trim().length > 0
  );
}

/**
 * 값 유효성 검사 - 유한한 숫자인지 확인
 */
function isValidValue(value) {
  return typeof value === "number" && Number.isFinite(value);
}

// ========== 3. JSON 정제 유틸리티 (19-74) ==========
/**
 * JSON 문자열에서 주석과 트레일링 컴마를 제거하는 함수
 * - 한 줄 주석, 블록 주석 제거
 * - 트레일링 콤마 제거
 */
function cleanJsonInput(jsonInput) {
  let cleaned = "";
  let inString = false;
  let stringQuote = "";
  let prevLetter = "";
  let i = 0;

  while (i < jsonInput.length) {
    const letter = jsonInput[i];
    const nextLetter = jsonInput[i + 1];

    // 문자열 진입 / 이탈 판단
    if ((letter === '"' || letter === "'") && prevLetter !== "\\") {
      if (!inString) {
        inString = true;
        stringQuote = letter;
      } else if (stringQuote === letter) {
        inString = false;
      }
    }

    if (!inString) {
      // 한 줄 주석 제거
      if (letter === "/" && nextLetter === "/") {
        while (i < jsonInput.length && jsonInput[i] !== "\n") i++;
        continue;
      }

      // 블록 주석 제거
      if (letter === "/" && nextLetter === "*") {
        i += 2;
        while (
          i < jsonInput.length &&
          !(jsonInput[i] === "*" && jsonInput[i + 1] === "/")
        ) {
          i++;
        }
        i += 2; // skip "*/"
        continue;
      }

      // 트레일링 쉼표 제거
      if (letter === "," && /[\]}]/.test(nextLetter)) {
        i++;
        continue;
      }
    }

    cleaned += letter;
    prevLetter = letter;
    i++;
  }

  return cleaned.trim();
}

// ========== 4. 데이터 관리 로직 (76-87) ==========
/**
 * 애플리케이션 데이터 스토어
 * - 단일 데이터 소스 원칙을 따름
 */
const dataSet = [];

/**
 * 데이터 복사본 반환 (원본 데이터 보호)
 */
function getData() {
  return dataSet.map((dataItem) => ({ ...dataItem }));
}

/**
 * 데이터 갱신 (ID는 항상 문자열로 변환)
 */
function setData(newDataSet) {
  dataSet.length = 0;
  dataSet.push(
    ...newDataSet.map(({ id, value }) => ({ id: String(id), value }))
  );
}

// ========== 5. UI 렌더링 함수 (89-157) ==========
/**
 * 차트 그리기 - 로그 스케일을 사용하여 데이터 값을 높이로 변환
 */
function renderChart() {
  const chartContainerEl = document.getElementById("chart-container");
  chartContainerEl.textContent = "";

  const currentData = getData();
  const rawMaxValue = Math.max(...currentData.map((item) => item.value), 1);

  // 로그 스케일 계산 (데이터 값 범위가 클 때 시각적으로 더 효과적)
  const getLogHeight = (value) => {
    return (Math.log(value + 1) / Math.log(rawMaxValue + 1)) * 100;
  };

  currentData.forEach((dataItem, index) => {
    const barEl = document.createElement("div");
    barEl.className = "bar";
    barEl.title = `ID: ${dataItem.id}\nVALUE: ${dataItem.value}`;

    barEl.style.height = `${getLogHeight(dataItem.value)}%`;

    barEl.style.backgroundColor = index % 2 === 0 ? "#ccc" : "#eee";

    chartContainerEl.appendChild(barEl);
  });
}

/**
 * 테이블 편집기 렌더링 - 각 행에 ID, 값 입력, 삭제 버튼 포함
 */
function renderTableEditor() {
  // 테이블 본문 요소 참조 및 초기화
  const tableBodyEl = document.querySelector("#value-table tbody");
  tableBodyEl.textContent = "";

  // 현재 데이터의 복사본 가져오기
  const currentData = getData();

  // 데이터의 각 항목에 대해 행 생성
  currentData.forEach((dataItem) => {
    // 1. 새 행 요소 생성
    const rowEl = document.createElement("tr");

    // 2. ID 셀 생성 (읽기 전용)
    const idCellEl = document.createElement("td");
    idCellEl.textContent = dataItem.id;
    rowEl.appendChild(idCellEl);

    // 3. 값 입력 셀 생성 (편집 가능)
    const valueCellEl = document.createElement("td");
    const valueInputEl = document.createElement("input");
    valueInputEl.type = "number";
    valueInputEl.value = dataItem.value;
    valueInputEl.dataset.id = dataItem.id;
    valueCellEl.appendChild(valueInputEl);
    rowEl.appendChild(valueCellEl);

    // 4. 삭제 버튼 셀 생성
    const deleteCellEl = document.createElement("td");
    const deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "삭제";

    // 삭제 버튼 클릭 이벤트 처리
    deleteButtonEl.addEventListener("click", () => {
      // 해당 ID를 제외한 새 데이터 배열 생성
      const updated = getData().filter((entry) => entry.id !== dataItem.id);
      setData(updated); // 데이터 업데이트
      syncAll(); // UI 전체 동기화
    });

    deleteCellEl.appendChild(deleteButtonEl);
    rowEl.appendChild(deleteCellEl);

    // 5. 완성된 행을 테이블에 추가
    tableBodyEl.appendChild(rowEl);
  });
}

/**
 * JSON 편집기 렌더링 - 현재 데이터를 JSON 형식으로 표시
 */
function renderJsonEditor() {
  const jsonTextareaEl = document.getElementById("json-editor");
  jsonTextareaEl.value = JSON.stringify(getData(), null, 2);
}

/**
 * 모든 UI 컴포넌트 동기화 - 차트, 테이블, JSON 편집기 업데이트
 */
function syncAll() {
  renderChart();
  renderTableEditor();
  renderJsonEditor();
}

// ========== 6. 사용자 이벤트 처리 함수 (159-240) ==========
/**
 * 새 항목 추가 - ID와 값 유효성 검사 후 데이터 추가
 */
function addEntry() {
  const idInputEl = document.getElementById("id-input");
  const valueInputEl = document.getElementById("value-input");

  const idRaw = idInputEl.value;
  const value = parseFloat(valueInputEl.value);

  // 유효성 검사
  if (!isValidId(idRaw) || !isValidValue(value)) {
    alert("유효한 ID와 숫자 값을 입력하세요.");
    return;
  }

  const id = String(idRaw).trim();
  const currentData = getData();

  // 중복 ID 검사
  if (currentData.some((entry) => String(entry.id) === id)) {
    alert("중복된 ID입니다.");
    return;
  }

  // 데이터 추가 및 UI 갱신
  setData([...currentData, { id, value }]);
  syncAll();

  // 입력 필드 초기화
  idInputEl.value = "";
  valueInputEl.value = "";
  idInputEl.focus();
}

/**
 * 테이블 변경사항 적용 - 사용자가 테이블에서 수정한 값을 저장
 */
function applyTableChanges() {
  const valueInputElements = document.querySelectorAll(
    "#value-table tbody input"
  );

  const updatedData = getData().map((dataItem) => {
    const matchedInputEl = [...valueInputElements].find(
      (inputEl) => inputEl.dataset.id === String(dataItem.id)
    );

    return matchedInputEl
      ? { ...dataItem, value: parseFloat(matchedInputEl.value) }
      : dataItem;
  });

  setData(updatedData);
  syncAll();
}

/**
 * JSON 편집 내용 적용 - 유효성 검사 후 데이터 갱신
 */
function applyJsonEdit() {
  try {
    const jsonTextareaEl = document.getElementById("json-editor");
    const cleanedJson = cleanJsonInput(jsonTextareaEl.value);
    const parsedData = JSON.parse(cleanedJson);

    // 배열 형식 검사
    if (!Array.isArray(parsedData)) {
      throw new Error(ERROR_MESSAGES.INVALID_JSON_FORMAT);
    }

    // 각 항목의 형식 검사
    const isValidFormat = parsedData.every(
      (entry) =>
        typeof entry === "object" &&
        isValidId(entry.id) &&
        isValidValue(entry.value)
    );

    if (!isValidFormat) throw new Error(ERROR_MESSAGES.INVALID_JSON_ENTRY);

    // 중복 ID 검사
    const idSet = new Set();
    const hasDuplicateId = parsedData.some((entry) => {
      const normalizedId = String(entry.id).trim();
      if (idSet.has(normalizedId)) return true;
      idSet.add(normalizedId);
      return false;
    });
    if (hasDuplicateId) throw new Error(ERROR_MESSAGES.DUPLICATE_ID);

    // ID를 문자열로 정규화
    const normalizedData = parsedData.map((entry) => ({
      id: String(entry.id).trim(),
      value: entry.value,
    }));

    setData(normalizedData);
    syncAll();
  } catch (error) {
    if (error instanceof SyntaxError) {
      alert(ERROR_MESSAGES.INVALID_JSON_SYNTAX);
    } else {
      alert("❌ JSON 형식 오류:\n\n" + error.message);
    }
  }
}

// ========== 7. 이벤트 리스너 및 초기화 (242-261) ==========
/**
 * 문서 로드 완료 시 초기화 및 이벤트 바인딩
 */
document.addEventListener("DOMContentLoaded", () => {
  // 초기 UI 렌더링
  syncAll();

  // 요소 참조
  const idInputEl = document.getElementById("id-input");
  const valueInputEl = document.getElementById("value-input");

  // 버튼 이벤트 바인딩
  document.getElementById("value-add-button").onclick = addEntry;
  document.getElementById("table-apply-button").onclick = applyTableChanges;
  document.getElementById("json-apply-button").onclick = applyJsonEdit;

  // 입력 필드 Enter 키 이벤트 바인딩
  [idInputEl, valueInputEl].forEach((inputEl) => {
    inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        addEntry();
      }
    });
  });
});
