import Puyo from './puyo';

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

  rotate(maxX, maxY) {
    const puyoHeight = this.mainPuyo.getPuyoHeight();
    const puyoWidth = this.mainPuyo.getPuyoWidth();

    switch (this.pairDirection) {
      case 'right': {
        this.pairPuyo.movePuyoDown(puyoHeight, maxY);
        this.pairPuyo.movePuyoSide(-puyoWidth, maxX);
        this.pairDirection = 'down';
        break;
      }
      case 'down': {
        this.pairPuyo.movePuyoDown(-puyoHeight, maxY);
        this.pairPuyo.movePuyoSide(-puyoWidth, maxX);
        this.pairDirection = 'left';
        break;
      }
      case 'left': {
        this.pairPuyo.movePuyoDown(-puyoHeight, maxY);
        this.pairPuyo.movePuyoSide(puyoWidth, maxX);
        this.pairDirection = 'up';
        break;
      }
      case 'up': {
        this.pairPuyo.movePuyoDown(puyoHeight, maxY);
        this.pairPuyo.movePuyoSide(puyoWidth, maxX);
        this.pairDirection = 'right';
        break;
      }
      default:
        break;
    }
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
