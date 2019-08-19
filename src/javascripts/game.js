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
    }
  }

  increaseLevel() {
    this.level += 1;
    this.levelText.innerText = this.level + 1;
  }

  play(hardMode = false) {
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

        const puyoY = this.board.puyo.getPuyoY();
        const columnHeight = boardHeight - (this.board.grid[newColumn].length + 1) * puyoHeight;
        if (puyoY < columnHeight) {
          this.board.puyo.movePuyoSide(-puyoWidth, boardWidth);
          this.board.changePuyoColumn(newColumn);
        }
        break;
      }
      case 39: {
        const newColumn = this.board.puyoColumn + 1;
        if (newColumn > maxColumns - 1 || (newColumn > maxColumns - 2 && this.board.puyo.pairDirection === 'right') || this.gameOver()) {
          return;
        }

        const puyoY = this.board.puyo.getPuyoY();
        const columnHeight = boardHeight - (this.board.grid[newColumn].length + 1) * puyoHeight;

        let pairMove = true;
        // if (this.board.puyo.pairDirection === 'right') {
        //   const secondColumnHeight = boardHeight - (this.board.grid[newColumn + 1].length + 1) * puyoHeight;
        //   pairMove = puyoY < secondColumnHeight;
        // }

        if (puyoY < columnHeight && pairMove) {
          this.board.puyo.movePuyoSide(puyoWidth, boardWidth, 'pair-moving');
          this.board.changePuyoColumn(newColumn);
        }
        break;
      }
      case 80: {
        this.pause();
        break;
      }
      default:
        break;
    }
  }
}

export default Game;
