function syncElapsedTime() {
  state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
}

function startTimer() {
  stopTimer();
  state.startedAt = Date.now();
  state.elapsedSeconds = 0;
  state.timerId = window.setInterval(() => {
    syncElapsedTime();
    updateStatus();
  }, 1000);
}

function stopTimer() {
  if (state.timerId !== null) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function createShuffledBoard() {
  const duplicatedFruits = [...fruits, ...fruits];
  const shuffled = duplicatedFruits.map((fruit, index) => ({
    id: `${fruit}-${index}`,
    fruit,
    revealed: false,
    matched: false
  }));
  const random = createSeededRandom(state.seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function checkSolved() {
  return state.board.every((card) => card.matched);
}

function finishTurn(message) {
  renderBoard();
  updateStatus();
  setMessage(message);
}

function updateBestScore() {
  if (state.bestScore === null || state.attempts < state.bestScore) {
    state.bestScore = state.attempts;
    persistBestScore(state.bestScore);
  }
}

function handleMatchCheck() {
  const [firstIndex, secondIndex] = state.flippedIndexes;
  const firstCard = state.board[firstIndex];
  const secondCard = state.board[secondIndex];

  if (firstCard.fruit === secondCard.fruit) {
    firstCard.matched = true;
    secondCard.matched = true;
    state.flippedIndexes = [];
    state.isLocked = false;
    state.matches += 1;
    state.isSolved = checkSolved();

    if (state.isSolved) {
      syncElapsedTime();
      stopTimer();
      updateBestScore();
      finishTurn(`축하합니다! ${state.attempts}번의 시도와 ${formatElapsedTime(state.elapsedSeconds)} 만에 모든 과일 짝을 찾았어요.`);
      return;
    }

    finishTurn("정답이에요! 같은 과일 짝을 찾았습니다.");
    return;
  }

  state.mismatchTimerId = window.setTimeout(() => {
    firstCard.revealed = false;
    secondCard.revealed = false;
    state.flippedIndexes = [];
    state.isLocked = false;
    state.mismatchTimerId = null;
    finishTurn("다른 과일이에요. 위치를 기억해두세요.");
  }, 700);
}

function handleTileClick(tileIndex) {
  if (state.isSolved || state.isLocked) {
    return;
  }

  const card = state.board[tileIndex];
  if (card.revealed || card.matched) {
    return;
  }

  card.revealed = true;
  state.flippedIndexes.push(tileIndex);

  renderBoard();

  if (state.flippedIndexes.length === 1) {
    setMessage("한 장 더 선택해서 같은 과일인지 확인해보세요.");
    return;
  }

  state.attempts += 1;
  updateStatus();
  state.isLocked = true;
  setMessage("두 카드를 확인하고 있어요...");
  handleMatchCheck();
}

function teardownPendingTurn() {
  if (state.mismatchTimerId !== null) {
    window.clearTimeout(state.mismatchTimerId);
    state.mismatchTimerId = null;
  }
}

function beginGame(message) {
  teardownPendingTurn();
  stopTimer();
  state.seed = Math.floor(Math.random() * 1_000_000_000);
  state.board = createShuffledBoard();
  state.attempts = 0;
  state.matches = 0;
  state.isSolved = false;
  state.isLocked = false;
  state.flippedIndexes = [];
  startTimer();
  renderBoard();
  updateStatus();
  setMessage(message);
}

function shuffleBoard() {
  beginGame("카드를 섞었어요. 같은 과일 두 장을 찾아보세요.");
}

function resetBoard() {
  beginGame("새 게임을 시작했어요. 과일 카드를 뒤집어 짝을 맞춰보세요.");
}
