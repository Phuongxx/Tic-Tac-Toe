/* -----------------------------------
   🎮 Gameboard Module
----------------------------------- */
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return {
    getBoard,
    setMark,
    reset,
  };
})();

/* -----------------------------------
   👤 Player Factory Function
----------------------------------- */
const Player = (name = "Player", marker = "X", score = 0) => {
  return { name, marker, score };
};

/* -----------------------------------
   🕹️ Game Controller Module
----------------------------------- */
const GameController = (() => {
  let player1 = Player("ASH", "X");
  let player2 = Player("PIKACHU", "O");
  let currentPlayer = player1;
  let gameOver = false;

  const reset = () => {
    player1 = Player("ASH", "X");
    player2 = Player("PIKACHU", "O");
    currentPlayer = player1;
    DisplayController.updateScoreboard(player1, player2);
    gameOver = false;
  };

  const updateScores = (result) => {
    if (result === "win") {
      currentPlayer.score++;
      DisplayController.updateScoreboard(player1, player2);

      if (currentPlayer.score >= 1) {
        DisplayController.displayMessage(
          `${currentPlayer.name} wins the match!`
        );
      }
    }
  };

  const playTurn = (index) => {
    if (gameOver) return;

    if (Gameboard.setMark(index, currentPlayer.marker)) {
      DisplayController.render();

      if (checkWinner()) {
        gameOver = true;
        DisplayController.displayMessage(`${currentPlayer.name} wins!`);
        updateScores("win");
        DisplayController.updateHealthBar(currentPlayer === player1 ? 2 : 1);
      } else if (Gameboard.getBoard().every((cell) => cell !== "")) {
        gameOver = true;
        DisplayController.displayMessage("It's a draw!");
        updateScores("draw");
      } else {
        switchPlayer();
      }
    }
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    DisplayController.displayMessage(`${currentPlayer.name}'s turn`);
  };

  const checkWinner = () => {
    const b = Gameboard.getBoard();
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winPatterns.some(([a, b1, c]) => {
      return b[a] && b[a] === b[b1] && b[a] === b[c];
    });
  };

  const restart = () => {
    Gameboard.reset();
    currentPlayer = player1;
    gameOver = false;
    DisplayController.render();
    DisplayController.displayMessage(`${currentPlayer.name}'s turn`);
    DisplayController.resetHealthBars();
  };

  return { playTurn, restart, reset };
})();

/* -----------------------------------
   🖥️ Display Controller Module
----------------------------------- */
const DisplayController = (() => {
  const boardEl = document.querySelector(".gamefield");
  const messageEl = document.querySelector(".text-shown");
  const startBtn = document.getElementById("gameStart");

  const lifebar1 = document.getElementById("player1-lifebar");
  const lifebar2 = document.getElementById("player2-lifebar");

  // Render board state to UI
  const render = () => {
    const boardState = Gameboard.getBoard();
    const cells = boardEl.querySelectorAll(".play-buttons");

    cells.forEach((cell, index) => {
      cell.textContent = boardState[index];
      cell.removeEventListener("click", handleClick); // Remove old listeners
      cell.addEventListener("click", () => handleClick(index)); // Add new one
    });
  };

  // shown, when board cell is clicked
  const handleClick = (index) => {
    GameController.playTurn(index);
  };

  // Show in-game messages
  const displayMessage = (msg) => {
    messageEl.textContent = msg;
  };

  // Reset lifebars
  const resetHealthBars = () => {
    hp1 = 100;
    hp2 = 100;
    lifebar1.style.width = "100%";
    lifebar2.style.width = "100%";
  };

  // Reduce enemy HP on loss
  const updateHealthBar = (playerNumber) => {
    if (playerNumber === 1) {
      hp1 = 0; //
      lifebar1.style.width = "0%"; //
    } else if (playerNumber === 2) {
      hp2 = 0;
      lifebar2.style.width = "0%"; //
    }
  };

  const updateScoreboard = (p1, p2) => {};

  // Game Start button
  startBtn.addEventListener("click", () => {
    GameController.restart();
    GameController.reset();

    const gameDisplay = document.getElementById("gameDisplay");
    gameDisplay.classList.add("started"); // Hide overlay
  });

  return {
    render,
    displayMessage,
    updateScoreboard,
    updateHealthBar,
    resetHealthBars,
  };
})();

/* -----------------------------------
   🎵 Music Controls
----------------------------------- */
const battleMusic = document.getElementById("battle-music");
const muteBtn = document.getElementById("mute-btn");
const muteBtnIcon = muteBtn.querySelector("i");

// Loop music when it ends
battleMusic.addEventListener("ended", () => {
  battleMusic.currentTime = 0;
  battleMusic.play();
});

// Mute/Unmute toggle
muteBtn.onclick = () => {
  muteBtnIcon.classList.toggle("sound-mute");
  muteBtnIcon.classList.toggle("sound-up");
  if (battleMusic.paused) {
    battleMusic.play();
  } else {
    battleMusic.pause();
  }
};

/* -----------------------------------
   🚀 Initial Game Setup
----------------------------------- */
DisplayController.render();
DisplayController.displayMessage("ASH START'S");
