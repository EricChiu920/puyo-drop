import Puyo from './puyo';

const BOARD = {
  height: 770,
  width: 396,
  interval: 8,
};

class Board {
  constructor(container) {
    this.container = container;
    this.puyo = new Puyo();
    this.puyoHeight = this.puyo.getPuyoHeight();
    this.animate = this.animate.bind(this);

    this.allPuyos = [];
    this.columns = [];

    for (let i = 0; i < 6; i += 1) {
      this.columns.push([]);
    }
  }

  constructBoard() {
    for (let i = 0; i < 6; i += 1) {
      const col = document.createElement('div');
      for (let j = 0; j < 12; j += 1) {
        const div = document.createElement('div');
        div.id = `col-${i + 1}-row-${j + 1}`;
        div.classList.add('grid-box');
        col.appendChild(div);
      }

      this.container.appendChild(col);
    }
  }

  changePuyoColumn(newColumn) {
    this.puyoColumn = newColumn;
  }

  dropPuyo() {
    const puyo = new Puyo();
    this.puyo = puyo;
    this.allPuyos.push(puyo);
    this.newPuyo = puyo.createPuyo();
    this.puyoColumn = 2;

    this.container.appendChild(this.newPuyo);

    this.animate();
  }

  animate() {
    const moving = this.puyo.isMoving();

    if (moving) {
      this.eachPuyo((puyo) => {
        let maxHeight;
        if (puyo.puyo.id === 'moving') {
          maxHeight = BOARD.height - (this.columns[this.puyoColumn].length + 1) * this.puyoHeight;
        } else {
          const columnHeight = this.columns[Number(puyo.puyo.dataset.column)].length + 1;
          maxHeight = BOARD.height - columnHeight * this.puyoHeight;
        }
        puyo.movePuyoDown(BOARD.interval, maxHeight);
      });

      requestAnimationFrame(this.animate);
    } else {
      this.settlePuyo();
    }
  }

  settlePuyo() {
    this.puyo.puyo.dataset.column = this.puyoColumn;

    const puyoColumn = this.columns[this.puyoColumn];
    puyoColumn.push(this.puyo);
    
    const belowPuyo = puyoColumn[puyoColumn.length - 2];
    // if (belowPuyo && belowPuyo.puyo.dataset.color === this.puyo.puyo.dataset.color) {
    //   debugger
    // }
    this.dropPuyo();
  }

  eachPuyo(callback) {
    this.allPuyos.forEach(callback.bind(this));
  }

  getWidth() {
    return BOARD.width;
  }

  getHeight() {
    return BOARD.height;
  }

  getInterval() {
    return BOARD.interval;
  }
}

export default Board;
