const PUYO = {
  height: 64,
  width: 66,
  redPuyoPosition: '-515px -2px',
  greenPuyoPosition: '-515px -64px',
  bluePuyoPosition: '-515px -132px',
  yellowPuyoPosition: '-515px -197px',
  puyoColor: ['red', 'green', 'blue', 'yellow'],
};

class Puyo {
  createPuyo() {
    const puyo = document.createElement('div');
    const puyoColor = this.getPuyoColor();
    const puyoSprite = this.getPuyoSprite(puyoColor);

    puyo.classList.add('new-puyo');

    puyo.setAttribute('style', `transform: translate(132px, 0px); background-position: ${puyoSprite};`);
    puyo.id = 'moving';
    puyo.dataset.connected = 1;
    puyo.dataset.color = puyoColor;
    // Hide puyo until in comes into view.
    // puyo.style.top = `-${PUYO.height}px`;
    this.puyo = puyo;
    this.currentY = Number(puyo.style.transform.split(',')[1].match(/\d+/)[0]);
    this.currentX = Number(puyo.style.transform.split(',')[0].match(/\d+/)[0]);
    return puyo;
  }

  movePuyoDown(interval, maxY = 720) {
    if (this.isMoving()) {
      let newY = this.currentY + interval;

      if (newY > maxY) {
        newY = maxY;
        this.puyo.id = '';
        return;
      }

      this.puyo.style.transform = `translate(${this.currentX}px, ${this.currentY + interval}px)`;
      this.currentY += interval;
    }
  }

  movePuyoSide(interval, maxX = 400) {
    if (this.isMoving()) {
      let newX = this.currentX + interval;
      if (newX < 0) {
        newX = 0;
      } else if (newX > maxX - PUYO.width) {
        newX = maxX - PUYO.width;
      }

      this.puyo.style.transform = `translate(${newX}px, ${this.currentY}px)`;

      this.currentX = newX;
    }
  }

  isMoving() {
    return document.getElementById('moving');
  }

  randomPuyo() {
    return Math.floor(Math.random() * 4);
  }

  setPuyoY(y) {
    this.puyo.style.transform = `translate(${this.currentX}px, ${y}px)`;
    this.currentY = y;
  }

  getPuyoColor() {
    const randomPuyo = this.randomPuyo();
    return PUYO.puyoColor[randomPuyo];
  }

  getPuyoSprite(puyoColor) {
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
