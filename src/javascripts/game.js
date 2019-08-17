import Board from './board';

class Game {
  constructor(container) {
    this.container = container;
    this.paused = false;

    this.controlScheme = this.controlScheme.bind(this);
  }

  restart(hardMode) {
    this.board = new Board(this.container);

    if (hardMode) {
      this.board.setDifficulty();
    }

    this.board.dropPuyo();
    this.addControls();
  }

  play(hardMode = false) {
    this.restart(hardMode);
  }

  pause() {
    this.board.cancelAnimation();
    this.paused = true;
  }

  resume() {
    if (this.paused) {
      this.board.animate();
      this.paused = false;
    }
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
        if (newColumn < 0 || (newColumn === 0 && this.board.puyo.pairDirection === 'left')) {
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
        if (newColumn > maxColumns - 1 || (newColumn > maxColumns - 2 && this.board.puyo.pairDirection === 'right')) {
          return;
        }

        const puyoY = this.board.puyo.getPuyoY();
        const columnHeight = boardHeight - (this.board.grid[newColumn].length + 1) * puyoHeight;
        if (puyoY < columnHeight) {
          this.board.puyo.movePuyoSide(puyoWidth, boardWidth, 'pair-moving');
          this.board.changePuyoColumn(newColumn);
        }
        break;
      }
      case 40: {
        this.board.puyo.movePuyoDown(20, boardHeight - puyoHeight);
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
