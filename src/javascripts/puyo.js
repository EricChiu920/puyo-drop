const PUYO = {
  height: 64,
  width: 66,
  redPuyoPosition: '-515px -2px',
  greenPuyoPosition: '-515px -62px',
  bluePuyoPosition: '-515px -132px',
  yellowPuyoPosition: '-515px -197px',
  puyoColor: ['red', 'green', 'blue', 'yellow'],
};

class Puyo {
  createPuyo() {
    const puyo = document.createElement('div');
    const puyoSprite = this.getPuyoSprite();

    puyo.classList.add('puyo');

    puyo.setAttribute('style', `top: 0px; left: 0px; background-position: ${puyoSprite};`);
    puyo.id = 'moving';
    // Hide puyo until in comes into view.
    // puyo.style.top = `-${PUYO.height}px`;

    this.puyo = puyo;
    this.currentY = Number(puyo.style.top.split('px')[0]);
    this.currentX = Number(puyo.style.left.split('px')[0]);
    return puyo;
  }

  movePuyoDown(interval = 2) {
    this.puyo.style.top = `${this.currentY + interval}px`;
    this.currentY += interval;
  }

  movePuyoSide(interval, width) {
    if (document.getElementById('moving')) {
      let newWidth = this.currentX + interval;
      if (newWidth < 0) {
        newWidth = 2;
      } else if (newWidth > width - PUYO.width) {
        newWidth = width - PUYO.width - 2;
      }

      this.puyo.style.left = `${newWidth}px`;

      this.currentX = newWidth;
    }
  }

  randomPuyo() {
    return Math.floor(Math.random() * 4);
  }

  setPuyoY(y) {
    this.puyo.style.top = `${y}px`;
    this.currentY = y;
  }

  getPuyoSprite() {
    const randomPuyo = this.randomPuyo();
    const puyoColor = PUYO.puyoColor[randomPuyo];
    const puyoPosition = `${puyoColor}PuyoPosition`;
    return PUYO[puyoPosition];
  }

  getPuyoHeight() {
    return PUYO.height;
  }

  getPuyoWidth() {
    return PUYO.width;
  }

  getPuyoX() {
    return this.currentX;
  }

  getPuyoY() {
    return this.currentY;
  }
}

export default Puyo;
