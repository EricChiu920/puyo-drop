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
    const maxColumns = this.board.columns.length;

    switch (e.which) {
      case 37: {
        this.board.puyo.movePuyoSide(-puyoWidth, boardWidth);
        let newColumn = this.board.puyoColumn - 1;
        if (newColumn < 0) {
          newColumn = 0;
        }
        this.board.changePuyoColumn(newColumn);
        break;
      }
      case 39: {
        this.board.puyo.movePuyoSide(puyoWidth, boardWidth);
        let newColumn = this.board.puyoColumn + 1;
        if (newColumn > maxColumns - 1) {
          newColumn = maxColumns - 1;
        }
        this.board.changePuyoColumn(newColumn);
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
