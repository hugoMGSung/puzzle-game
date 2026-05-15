boardElement.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement) || !target.dataset.index) {
    return;
  }

  handleTileClick(Number(target.dataset.index));
});

shuffleButton.addEventListener("click", shuffleBoard);
resetButton.addEventListener("click", resetBoard);

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "r") {
    resetBoard();
  }

  if (event.key.toLowerCase() === "s") {
    shuffleBoard();
  }
});

resetBoard();
