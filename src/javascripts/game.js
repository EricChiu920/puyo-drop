import Board from './board';

class Game {
  constructor(container) {
    this.container = container;

    this.controlScheme = this.controlScheme.bind(this);
  }

  restart() {
    this.board = new Board(this.container);
    this.board.constructBoard();

    this.board.dropPuyo();
    this.addControls();
  }

  play() {
    this.restart();
  }

  addControls() {
    document.addEventListener('keydown', this.controlScheme);
  }

  controlScheme(e) {
    const puyoWidth = this.board.puyo.getPuyoWidth();
    const boardWidth = this.board.getWidth();
    const boardHeight = this.board.getHeight();
    const puyoHeight = this.board.puyo.getPuyoHeight();
    const maxColumns = this.board.grid.length;

    switch (e.which) {
      case 37: {
        let newColumn = this.board.puyoColumn - 1;
        if (newColumn < 0) {
          newColumn = 0;
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
        let newColumn = this.board.puyoColumn + 1;
        if (newColumn > maxColumns - 1) {
          newColumn = maxColumns - 1;
        }

        const puyoY = this.board.puyo.getPuyoY();
        const columnHeight = boardHeight - (this.board.grid[newColumn].length + 1) * puyoHeight;
        if (puyoY < columnHeight) {
          this.board.puyo.movePuyoSide(puyoWidth, boardWidth);
          this.board.changePuyoColumn(newColumn);
        }
        break;
      }
      case 40: {
        this.board.puyo.movePuyoDown(20, boardHeight - puyoHeight);
        break;
      }
      default:
        break;
    }
  }
}

export default Game;
