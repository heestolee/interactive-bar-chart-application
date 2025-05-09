export function cleanJsonInput(jsonInput) {
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
