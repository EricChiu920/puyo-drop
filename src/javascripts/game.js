import Board from './board';
import Puyo from './puyo';

class Game {
  constructor(container) {
    this.container = container;

    this.controlScheme = this.controlScheme.bind(this);
  }

  restart() {
    this.board = new Board(this.container);

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

    switch (e.which) {
      case 37: {
        this.board.puyo.movePuyoSide(-puyoWidth, boardWidth);
        break;
      }
      case 39: {
        this.board.puyo.movePuyoSide(puyoWidth, boardWidth);
        break;
      }
      default:
        break;
    }
  }
}

export default Game;
