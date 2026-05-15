const boardElement = document.getElementById("board");
const moveCountElement = document.getElementById("move-count");
const gameStatusElement = document.getElementById("game-status");
const messageElement = document.getElementById("message");
const shuffleButton = document.getElementById("shuffle-button");
const resetButton = document.getElementById("reset-button");
const accuracyRateElement = document.getElementById("accuracy-rate");
const elapsedTimeElement = document.getElementById("elapsed-time");
const bestScoreElement = document.getElementById("best-score");
const boardSeedElement = document.getElementById("board-seed");

const fruits = ["🍎", "🍌", "🍇", "🍒", "🍊", "🍉", "🍓", "🥝"];
const STORAGE_KEY = "fruit-match-best-score";
const DEFAULT_MESSAGE = "카드를 눌러 같은 과일의 짝을 찾아보세요.";

function loadBestScore() {
  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number(storedValue);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function persistBestScore(bestScore) {
  if (bestScore !== null) {
    window.localStorage.setItem(STORAGE_KEY, String(bestScore));
  }
}

function formatAccuracy(attempts, matches) {
  if (attempts === 0) {
    return "0%";
  }

  return `${Math.round((matches / attempts) * 100)}%`;
}

function formatElapsedTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function createSeededRandom(seed) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

const state = {
  // 현재 보드에 배치된 카드 데이터
  board: [],
  // 두 장을 뒤집어 비교한 총 시도 횟수
  attempts: 0,
  // 성공적으로 맞춘 카드 쌍의 개수
  matches: 0,
  // 모든 짝을 찾아 게임이 종료되었는지 여부
  isSolved: false,
  // 카드 비교 중 추가 입력을 막기 위한 잠금 상태
  isLocked: false,
  // 현재 뒤집혀 있는 카드의 인덱스 목록
  flippedIndexes: [],
  // 불일치 카드 복구에 사용하는 타이머 ID
  mismatchTimerId: null,
  // 현재 게임이 시작된 시각의 타임스탬프
  startedAt: 0,
  // 시작 후 누적된 경과 시간(초)
  elapsedSeconds: 0,
  // 1초 단위 UI 갱신에 사용하는 인터벌 ID
  timerId: null,
  // 재현 가능한 셔플을 위한 현재 게임 시드
  seed: 42,
  // localStorage에서 불러온 최고 기록
  bestScore: loadBestScore()
};
