import Puyo from './puyo';

const ROTATION = {

};

class PairPuyos {
  constructor() {
    this.mainPuyo = new Puyo();
    this.pairPuyo = new Puyo();
    this.pairDirection = 'right';
  }

  createPuyo() {
    const mainPuyo = this.mainPuyo.createPuyo();
    const width = this.mainPuyo.getPuyoWidth();
    const pairPuyo = this.pairPuyo.createPuyo(width, 'pair-moving');

    return [mainPuyo, pairPuyo];
  }

  isMoving() {
    return this.mainPuyo.isMoving('main-moving') || this.pairPuyo.isMoving('pair-moving');
  }

  mainMoving() {
    return this.mainPuyo.isMoving('main-moving');
  }

  pairMoving() {
    return this.pairPuyo.isMoving('pair-moving');
  }

  getPuyoY() {
    const mainPuyoY = this.mainPuyo.getPuyoY();
    const pairPuyoY = this.pairPuyo.getPuyoY();

    return mainPuyoY < pairPuyoY ? pairPuyoY : mainPuyoY;
  }

  movePuyoSide(interval, maxX) {
    this.mainPuyo.movePuyoSide(interval, maxX);
    this.pairPuyo.movePuyoSide(interval, maxX);
  }
}

export default PairPuyos;
