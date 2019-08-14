import Puyo from './puyo';

const BOARD = {
  height: 720,
  width: 400,
  interval: 1.5,
};

class Board {
  constructor(container) {
    this.container = container;
    this.puyo = new Puyo();
    this.puyoHeight = this.puyo.getPuyoHeight();
    this.animate = this.animate.bind(this);
  }

  dropPuyo() {
    const newPuyo = this.puyo.createPuyo();
    this.container.appendChild(newPuyo);

    this.dropPuyo = setInterval(() => this.animate(newPuyo), 1000 / 60);
    // this.animate(newPuyo);
  }

  animate(newPuyo) {
    const oldTop = this.puyo.getPuyoY();
    const puyo = newPuyo;

    if (oldTop < BOARD.height - this.puyoHeight) {
      this.puyo.movePuyoDown(BOARD.interval);
    } else {
      this.puyo.setPuyoY(BOARD.height - this.puyoHeight);
      puyo.id = '';
      clearInterval(this.dropPuyo);
    }
    // debugger
    // if (oldTop < BOARD.height - this.puyoHeight) {
    //   // window.requestAnimationFrame(() => this.puyo.movePuyoDown(BOARD.interval));
    //   this.puyo.movePuyoDown(BOARD.interval);
    //   this.dropPuyo = requestAnimationFrame(() => this.animate(newPuyo));
    //   this.animate(puyo);
    // } else {
    //   this.puyo.setPuyoY(BOARD.height - this.puyoHeight);
    //   puyo.id = '';
    //   cancelAnimationFrame(this.dropPuyo);
    // }
  }

  getWidth() {
    return BOARD.width;
  }
}

export default Board;
