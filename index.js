/* -----------------------------------
    Gameboard Module
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

  return { getBoard, setMark, reset };
})();

/* -----------------------------------
    Player Factory Function
----------------------------------- */
const Player = (name = "Player", marker = "X", score = 0) => {
  return { name, marker, score };
};

/* -----------------------------------
    Display Controller Module
----------------------------------- */
const DisplayController = (() => {
  // elements
  const boardEl = document.querySelector(".gamefield");
  const messageEl = document.querySelector(".text-shown");
  const scoreboardEl = document.querySelector(".scoreboard");
  const startBtn = document.getElementById("gameStart");
  const restartBtn = document.getElementById("restart-btn");
  const lifebar1 = document.getElementById("player1-lifebar");
  const lifebar2 = document.getElementById("player2-lifebar");

  // Render the current gameboard
  const render = () => {
    const boardState = Gameboard.getBoard();
    const cells = boardEl.querySelectorAll(".play-buttons");

    cells.forEach((cell, index) => {
      cell.textContent = boardState[index];
      cell.removeEventListener("click", handleClick);
      cell.addEventListener("click", () => handleClick(index));
    });
  };

  // Handle cell click
  const handleClick = (index) => {
    GameController.playTurn(index);
  };

  // Show game messages
  const displayMessage = (msg) => {
    messageEl.textContent = msg;
  };

  // Update scoreboard display
  const updateScoreboard = (p1, p2) => {
    scoreboardEl.textContent = `${p1.name}: ${p1.score} | ${p2.name}: ${p2.score}`;
  };

  // Reset both lifebars to 100%
  const resetHealthBars = () => {
    hp1 = 100;
    hp2 = 100;
    lifebar1.style.width = "100%";
    lifebar2.style.width = "100%";
  };

  // Set losing player's lifebar to 0%
  const updateHealthBar = (playerNumber) => {
    if (playerNumber === 1) {
      hp1 = 0;
      lifebar1.style.width = "0%";
    } else if (playerNumber === 2) {
      hp2 = 0;
      lifebar2.style.width = "0%";
    }
  };

  // Start button
  startBtn.addEventListener("click", () => {
    GameController.restart();
    GameController.reset();
    DisplayController.displayMessage("ASH START'S");

    const gameDisplay = document.getElementById("gameDisplay");
    gameDisplay.classList.add("started");

    // 🔊 Start music
    battleMusic.currentTime = 0;
    battleMusic.play();
  });
  restartBtn.addEventListener("click", () => {
    GameController.reset();
    GameController.restart();
    DisplayController.displayMessage("ASH START'S");

    const gameDisplay = document.getElementById("gameDisplay");
    gameDisplay.classList.add("started");

    // 🔁 Restart
    battleMusic.currentTime = 0;
    battleMusic.play();
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
   🕹️ Game Controller Module
----------------------------------- */
const GameController = (() => {
  let player1 = Player("ASH", "X");
  let player2 = Player("PIKACHU", "O");
  let currentPlayer = player1;
  let gameOver = false;

  // Reset players and scores
  const reset = () => {
    player1 = Player("ASH", "X");
    player2 = Player("PIKACHU", "O");
    currentPlayer = player1;
    DisplayController.updateScoreboard(player1, player2);
    gameOver = false;
  };

  // Update score and show win message
  const updateScores = (result) => {
    if (result === "win") {
      currentPlayer.score++;
      DisplayController.updateScoreboard(player1, player2);

      if (currentPlayer.score >= 2) {
        //  Final win condition
        DisplayController.displayMessage(
          `${currentPlayer.name} wins the match!`
        );
        gameOver = true;
      }
    }
  };

  // Player makes a move
  const playTurn = (index) => {
    if (gameOver) return;

    if (Gameboard.setMark(index, currentPlayer.marker)) {
      DisplayController.render();

      if (checkWinner()) {
        gameOver = true;
        DisplayController.displayMessage(`${currentPlayer.name} wins!`);
        updateScores("win");
        DisplayController.updateHealthBar(currentPlayer === player1 ? 2 : 1);

        if (currentPlayer.score < 2) {
          // 🔁 Only restart if match not finished
          setTimeout(() => {
            restart();
          }, 1000);
        }
      } else if (Gameboard.getBoard().every((cell) => cell !== "")) {
        gameOver = true;
        DisplayController.displayMessage("It's a draw!");
        updateScores("draw");

        // Draws don't count as final win, so restart always
        setTimeout(() => {
          restart();
        }, 1000);
      } else {
        switchPlayer();
      }
    }
  };

  // Switch to the other player
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    DisplayController.displayMessage(`${currentPlayer.name}'s turn`);
  };

  // Check for win patterns
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

  // Restart board for new round
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
    Music Controls
----------------------------------- */
const battleMusic = document.getElementById("battle-music");
const muteBtn = document.getElementById("mute-btn");
const muteBtnIcon = muteBtn.querySelector("i");

// Loop music
battleMusic.addEventListener("ended", () => {
  battleMusic.currentTime = 0;
  battleMusic.play();
});

// Toggle mute/unmute
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
    Initial Game Setup
----------------------------------- */
DisplayController.render();
DisplayController.displayMessage("ASH START'S");
