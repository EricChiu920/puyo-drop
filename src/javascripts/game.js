import Board from './board';

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


    this.animate = this.animate.bind(this);
    this.controlScheme = this.controlScheme.bind(this);
    this.increaseLevel = this.increaseLevel.bind(this);
  }

  restart(hardMode) {
    this.board = new Board(this.container, this.level);
    this.increaseLevelId = setInterval(this.increaseLevel, GAME.levelIncreaseTime);
    this.level = -1;
    this.increaseLevel();

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

  controlScheme(e) {
    const puyoWidth = this.board.puyo.mainPuyo.getPuyoWidth();
    const boardWidth = this.board.getWidth();
    const boardHeight = this.board.getHeight();
    const puyoHeight = this.board.puyo.mainPuyo.getPuyoHeight();
    const maxColumns = this.board.grid.length;
    const puyoY = this.board.puyo.getPuyoY();

    switch (e.which) {
      case 32: {
        this.resume();
        break;
      }
      case 37: {
        const newColumn = this.board.puyoColumn - 1;
        if (newColumn < 0 || (newColumn === 0 && this.board.puyo.pairDirection === 'left') || this.gameOver()) {
          return;
        }


        const columnHeight = boardHeight - (this.board.grid[newColumn].length + 1) * puyoHeight;
        let pairCanMove = true;
        const pairNewColumn = this.board.pairColumn - 1;
        const pairColumnHeight = boardHeight - (this.board.grid[pairNewColumn].length + 1) * puyoHeight;
        pairCanMove = puyoY < pairColumnHeight;

        if (puyoY < columnHeight && pairCanMove) {
          this.board.puyo.movePuyoSide(-puyoWidth, boardWidth);
          this.board.changePuyoColumn(newColumn);
        } else if (this.board.puyo.pairDirection === 'right' && pairCanMove) {
          this.board.puyo.movePuyoSide(-puyoWidth, boardWidth);
          this.board.changePuyoColumn(newColumn);
        }
        break;
      }
      case 39: {
        const newColumn = this.board.puyoColumn + 1;
        if (newColumn > maxColumns - 1 || this.board.pairColumn + 1 > maxColumns - 1 || this.gameOver()) {
          return;
        }

        let sideShift = 0;
        if (this.board.puyo.pairDirection === 'right' && this.board.puyo.pairMoving()) {
          sideShift += 1;
        }
        const columnHeight = boardHeight - (this.board.grid[newColumn + sideShift].length + 1) * puyoHeight;
        if (puyoY < columnHeight) {
          this.board.puyo.movePuyoSide(puyoWidth, boardWidth, 'pair-moving');
          this.board.changePuyoColumn(newColumn);
        }
        break;
      }
      case 80: {
        this.pause();
        break;
      }
      case 82: {
        if ((this.board.puyo.pairDirection === 'down' && this.board.pairColumn === 0)
        || (this.board.puyo.pairDirection === 'up' && this.board.pairColumn === maxColumns - 1)) {
          return;
        }

        if (this.board.puyo.pairDirection === 'right') {
          const columnHeight = boardHeight - (this.board.grid[this.board.puyoColumn].length + 2) * puyoHeight;
          if (puyoY > columnHeight) {
            return;
          }
        }

        if (this.board.puyo.pairDirection === 'down') {
          const columnHeight = boardHeight - (this.board.grid[this.board.puyoColumn].length + 2) * puyoHeight;
          if (puyoY > columnHeight) {
            return;
          }
        }

        if (this.board.puyo.pairDirection === 'up') {
          const columnHeight = boardHeight - (this.board.grid[this.board.puyoColumn + 1].length + 2) * puyoHeight;
          if (puyoY > columnHeight) {
            return;
          }
        }

        this.board.rotate(boardWidth, boardHeight);
        break;
      }
      default:
        break;
    }
  }
}

export default Game;
