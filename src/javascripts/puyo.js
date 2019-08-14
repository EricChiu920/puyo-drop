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

    puyo.setAttribute('style', `transform: translate(0px, 0px); background-position: ${puyoSprite};`);
    puyo.id = 'moving';
    // Hide puyo until in comes into view.
    // puyo.style.top = `-${PUYO.height}px`;
    this.puyo = puyo;
    this.currentY = Number(puyo.style.transform.split(',')[1].match(/\d+/)[0]);
    this.currentX = Number(puyo.style.transform.split(',')[0].match(/\d+/)[0]);
    return puyo;
  }

  movePuyoDown(interval = 2) {
    this.puyo.style.transform = `translate(${this.currentX}px, ${this.currentY + interval}px)`;
    this.currentY += interval;
  }

  movePuyoSide(interval, width) {
    if (document.getElementById('moving')) {
      let newX = this.currentX + interval;
      if (newX < 0) {
        newX = 2;
      } else if (newX > width - PUYO.width) {
        newX = width - PUYO.width - 2;
      }

      this.puyo.style.transform = `translate(${newX}px, ${this.currentY}px)`;

      this.currentX = newX;
    }
  }

  randomPuyo() {
    return Math.floor(Math.random() * 4);
  }

  setPuyoY(y) {
    this.puyo.style.transform = `translate(${this.currentX}px, ${y}px)`;
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
