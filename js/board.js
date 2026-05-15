function renderBoard() {
  boardElement.innerHTML = "";

  state.board.forEach((card, index) => {
    const button = document.createElement("button");
    button.type = "button";
    const stateClass = card.matched ? " matched" : card.revealed ? " revealed" : "";
    button.className = `tile${stateClass}`;
    button.textContent = card.revealed || card.matched ? card.fruit : "?";
    button.setAttribute("aria-label", card.revealed || card.matched ? `${card.fruit} 카드` : "숨겨진 카드");
    button.dataset.index = String(index);

    if (card.matched || card.revealed || state.isLocked) {
      button.disabled = true;
    }

    boardElement.appendChild(button);
  });
}

function updateStatus() {
  moveCountElement.textContent = String(state.attempts);
  gameStatusElement.textContent = state.isSolved ? "클리어" : "플레이 중";
  accuracyRateElement.textContent = formatAccuracy(state.attempts, state.matches);
  elapsedTimeElement.textContent = formatElapsedTime(state.elapsedSeconds);
  bestScoreElement.textContent = state.bestScore ? `${state.bestScore}회` : "-";
  boardSeedElement.textContent = `seed: ${state.seed}`;
}

function setMessage(text = DEFAULT_MESSAGE) {
  messageElement.textContent = text;
}
