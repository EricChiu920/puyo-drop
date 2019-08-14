import Puyo from './puyo';

const BOARD = {
  height: 720,
  interval: 2,
};

class Board {
  constructor(container) {
    this.container = container;
  }

  dropPuyo() {
    this.puyo = new Puyo();
    const puyoHeight = this.puyo.getPuyoHeight();
    const newPuyo = this.puyo.createPuyo();
    this.container.appendChild(newPuyo);

    const dropPuyo = setInterval(() => {
      const oldTop = this.puyo.getPuyoY();

      if (oldTop < BOARD.height - puyoHeight) {
        this.puyo.movePuyoDown(BOARD.interval);
      } else {
        this.puyo.setPuyoY(BOARD.height - puyoHeight);
      }

      if (oldTop > BOARD.height - puyoHeight) {
        clearInterval(dropPuyo);
        newPuyo.id = '';
      }
    }, 1000 / 60);
  }
}

export default Board;
