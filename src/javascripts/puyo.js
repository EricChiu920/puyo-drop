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
  createPuyo(side = 0, id = 'main-moving') {
    const puyo = document.createElement('div');
    const puyoColor = this.getPuyoColor();
    const puyoSprite = this.getPuyoSprite(puyoColor);

    puyo.classList.add('new-puyo');

    puyo.setAttribute('style', `transform: translate(${132 + side}px, 0px); background-position: ${puyoSprite};`);
    puyo.id = id;
    puyo.dataset.color = puyoColor;
    puyo.dataset.traversed = 'false';
    // Hide puyo until in comes into view.
    // puyo.style.top = `-${PUYO.height}px`;
    this.puyo = puyo;
    this.landed = false;
    this.currentY = Number(puyo.style.transform.split(',')[1].match(/\d+/)[0]);
    this.currentX = Number(puyo.style.transform.split(',')[0].match(/\d+/)[0]);
    return puyo;
  }

  movePuyoDown(interval, maxY = 720) {
    let newY = this.currentY + interval;
    if (newY > maxY) {
      newY = maxY;
      this.currentY = newY;
      this.puyo.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
      if (this.puyo.id !== '') {
        this.puyo.id = `${this.puyo.id}-landed`;
      }
      return;
    }

    this.currentY += interval;
    this.puyo.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
  }

  movePuyoSide(interval, maxX = 400) {
    let newX = this.currentX + interval;
    if (newX < 0) {
      newX = 0;
    } else if (newX > maxX - PUYO.width) {
      newX = maxX - PUYO.width;
    }

    this.puyo.style.transform = `translate(${newX}px, ${this.currentY}px)`;

    this.currentX = newX;
  }

  isMoving(id) {
    return Boolean(document.getElementById(id));
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
