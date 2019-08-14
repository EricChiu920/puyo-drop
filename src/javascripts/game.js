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
    const width = this.board.puyo.getPuyoWidth();

    switch (e.keycode) {
      case 37: {
        this.board.puyo.movePuyoSide(width);
        break;
      }
      case 39: {
        this.board.puyo.movePuyoSide(-width);
        break;
      }
      default:
        break;
    }
  }
}

export default Game;
