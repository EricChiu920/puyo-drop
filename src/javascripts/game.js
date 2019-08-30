import Board from './board';

const CONTROLS = {
  spacebar: 32,
  left: 37,
  up: 38,
  right: 39,
  keyP: 80,
  keyR: 82,
};

const GAME = {
  levelIncreaseTime: 30000,
};

class Game {
  constructor(container) {
    this.container = container;
    this.paused = false;
    this.level = 0;

    this.pointsText = document.querySelector('.points');
    this.levelText = document.querySelector('.level');
    this.gameOverModal = document.querySelector('.game-over-modal');


    this.animate = this.animate.bind(this);
    this.controlScheme = this.controlScheme.bind(this);
    this.increaseLevel = this.increaseLevel.bind(this);
  }

  restart(hardMode) {
    this.board = new Board(this.container, this.level);
    this.increaseLevelId = setInterval(this.increaseLevel, GAME.levelIncreaseTime);
    this.level = -1;
    this.increaseLevel();
    this.gameOverModal.style.display = 'none';

    if (hardMode) {
      this.board.setDifficulty();
    }

    this.board.dropPuyo();
    this.addControls();
    this.animate();
  }

  animate() {
    this.pointsText.innerText = this.board.points;
    this.board.animate(this.level);

    if (!this.gameOver()) {
      this.rafId = requestAnimationFrame(this.animate);
    } else {
      clearInterval(this.increaseLevelId);
      let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

      highScores.push(this.board.points);
      highScores = highScores.sort((a, b) => b - a);

      while (highScores.length > 5) {
        highScores.pop();
      }

      localStorage.setItem('highScores', JSON.stringify(highScores));

      this.drawHighScores();
      this.gameOverModal.style.display = 'flex';
    }
  }

  increaseLevel() {
    this.level += 1;
    this.levelText.innerText = this.level + 1;
  }

  play(hardMode = false) {
    this.pause();
    this.paused = false;
    this.restart(hardMode);
  }

  pause() {
    cancelAnimationFrame(this.rafId);
    clearInterval(this.increaseLevelId);
    this.paused = true;
  }

  resume() {
    if (this.paused) {
      this.increaseLevelId = setInterval(this.increaseLevel, GAME.levelIncreaseTime);
      this.animate();
      this.paused = false;
    }
  }

  gameOver() {
    return this.board.grid[2].length >= 12 || this.board.grid.some((col) => col.length > 13);
  }

  addControls() {
    document.addEventListener('keydown', this.controlScheme);
  }

  drawHighScores() {
    const highScoresUl = document.querySelector('.high-scores');

    while (highScoresUl.lastChild) {
      highScoresUl.lastChild.remove();
    }

    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    for (let i = 0; i < highScores.length; i += 1) {
      const li = document.createElement('li');
      li.textContent = highScores[i];
      highScoresUl.appendChild(li);
    }
  }

  movePuyoLeft(boardHeight, boardWidth, puyoHeight, puyoY, puyoWidth) {
    const newColumn = this.board.puyoColumn - 1;
    if (newColumn < 0 || (newColumn === 0 && this.board.puyo.pairDirection === 'left') || this.gameOver()) {
      return;
    }

    const columnHeight = boardHeight - (this.board.grid[newColumn].length + 1) * puyoHeight;
    let pairCanMove = true;
    const pairNewColumn = this.board.pairColumn - 1;
    const columnLength = this.board.grid[pairNewColumn].length + 1;
    const pairColumnHeight = boardHeight - columnLength * puyoHeight;
    pairCanMove = puyoY < pairColumnHeight;

    if (puyoY < columnHeight && pairCanMove) {
      this.board.puyo.movePuyoSide(-puyoWidth, boardWidth);
      this.board.changePuyoColumn(newColumn);
    } else if (this.board.puyo.pairDirection === 'right' && pairCanMove) {
      this.board.puyo.movePuyoSide(-puyoWidth, boardWidth);
      this.board.changePuyoColumn(newColumn);
    }
  }

  movePuyoRight(maxColumns, boardHeight, boardWidth, puyoY, puyoWidth, puyoHeight) {
    const newColumn = this.board.puyoColumn + 1;
    if (newColumn > maxColumns - 1
      || this.board.pairColumn + 1 > maxColumns - 1
      || this.gameOver()) {
      return;
    }

    let sideShift = 0;
    if (this.board.puyo.pairDirection === 'right' && this.board.puyo.pairMoving()) {
      sideShift += 1;
    }
    const columnLength = this.board.grid[newColumn + sideShift].length + 1;
    const columnHeight = boardHeight - columnLength * puyoHeight;
    if (puyoY < columnHeight) {
      this.board.puyo.movePuyoSide(puyoWidth, boardWidth, 'pair-moving');
      this.board.changePuyoColumn(newColumn);
    }
  }

  checkRotation(maxColumns, boardHeight, boardWidth, puyoHeight, puyoWidth, puyoY) {
    switch (this.board.puyo.pairDirection) {
      case 'up': {
        if (this.board.pairColumn === maxColumns - 1) {
          const leftColumn = this.board.grid[this.board.puyoColumn - 1];
          const leftColumnHeight = boardHeight - leftColumn.length * puyoHeight;
          if (puyoY < leftColumnHeight) {
            this.movePuyoLeft(boardHeight, boardWidth, puyoHeight, puyoY, puyoWidth);
            this.board.rotate(boardWidth, boardHeight);
          }

          return;
        }

        const columnLength = this.board.grid[this.board.pairColumn + 1].length + 1;
        const columnHeight = boardHeight - columnLength * puyoHeight;
        if (puyoY > columnHeight) {
          const leftColumn = this.board.grid[this.board.puyoColumn - 1];
          const leftColumnHeight = boardHeight - leftColumn.length * puyoHeight;
          if (puyoY < leftColumnHeight) {
            this.movePuyoLeft(boardHeight, boardWidth, puyoHeight, puyoY, puyoWidth);
            this.board.rotate(boardWidth, boardHeight);
          }

          return;
        }
        this.board.rotate(boardWidth, boardHeight);
        break;
      }
      case 'right': {
        const columnLength = this.board.grid[this.board.puyoColumn].length + 2;
        const columnHeight = boardHeight - columnLength * puyoHeight;
        if (puyoY > columnHeight) {
          return;
        }
        this.board.rotate(boardWidth, boardHeight);
        break;
      }
      case 'down': {
        if (this.board.pairColumn === 0) {
          const rightColumn = this.board.grid[this.board.puyoColumn + 1];
          const rightColumnHeight = boardHeight - rightColumn.length * puyoHeight;
          if (puyoY + puyoHeight < rightColumnHeight) {
            this.movePuyoRight(maxColumns, boardHeight, boardWidth, puyoY, puyoWidth, puyoHeight);
            this.board.rotate(boardWidth, boardHeight);
          }
          return;
        }
        const columnLength = this.board.grid[this.board.puyoColumn - 1].length + 1;
        const columnHeight = boardHeight - columnLength * puyoHeight;
        if (puyoY > columnHeight) {
          const rightColumn = this.board.grid[this.board.puyoColumn + 1];
          const rightColumnHeight = boardHeight - rightColumn.length * puyoHeight;
          if (puyoY + puyoHeight < rightColumnHeight) {
            this.movePuyoRight(maxColumns, boardHeight, boardWidth, puyoY, puyoWidth, puyoHeight);
            this.board.rotate(boardWidth, boardHeight);
          }

          return;
        }

        this.board.rotate(boardWidth, boardHeight);
        break;
      }
      case 'left': {
        this.board.rotate(boardWidth, boardHeight);
        break;
      }
      default: {
        break;
      }
    }
  }

  controlScheme(e) {
    if (this.paused && (e.which !== CONTROLS.keyP && e.which !== CONTROLS.spacebar)) {
      return;
    }

    const puyoWidth = this.board.puyo.mainPuyo.getPuyoWidth();
    const boardWidth = this.board.getWidth();
    const boardHeight = this.board.getHeight();
    const puyoHeight = this.board.puyo.mainPuyo.getPuyoHeight();
    const maxColumns = this.board.grid.length;
    const puyoY = this.board.puyo.getPuyoY();

    switch (e.which) {
      case CONTROLS.spacebar: {
        this.resume();
        break;
      }
      case CONTROLS.left: {
        this.movePuyoLeft(boardHeight, boardWidth, puyoHeight, puyoY, puyoWidth);
        break;
      }
      case CONTROLS.right: {
        this.movePuyoRight(maxColumns, boardHeight, boardWidth, puyoY, puyoWidth, puyoHeight);
        break;
      }
      case CONTROLS.up: {
        this.checkRotation(maxColumns, boardHeight, boardWidth, puyoHeight, puyoWidth, puyoY);
        break;
      }
      case CONTROLS.keyP: {
        this.pause();
        break;
      }
      case CONTROLS.keyR: {
        this.checkRotation(maxColumns, boardHeight, boardWidth, puyoHeight, puyoWidth, puyoY);
        break;
      }
      default:
        break;
    }
  }
}

export default Game;
