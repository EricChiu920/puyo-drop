import Puyo from './puyo';

const BOARD = {
  height: 770,
  width: 396,
  interval: 6,
};

class Board {
  constructor(container) {
    this.container = container;
    this.puyo = new Puyo();
    this.puyoHeight = this.puyo.getPuyoHeight();

    this.allPuyos = [];
    this.grid = [];
    for (let i = 0; i < 6; i += 1) {
      this.grid.push([]);
    }

    this.animate = this.animate.bind(this);
    this.clearPuyo = this.clearPuyo.bind(this);
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
        const currentPuyo = puyo.puyo;

        let maxHeight;
        if (currentPuyo.id === 'moving') {
          maxHeight = BOARD.height - (this.grid[this.puyoColumn].length + 1) * this.puyoHeight;
        } else {
          const rowHeight = Number(currentPuyo.dataset.row) + 1;
          maxHeight = BOARD.height - rowHeight * this.puyoHeight;
        }
        puyo.movePuyoDown(BOARD.interval, maxHeight);
      });

      this.animateId = requestAnimationFrame(this.animate);
    } else {
      this.settlePuyo();
      this.checkForClear();
      this.dropPuyo();
    }
  }

  settlePuyo() {
    this.puyo.puyo.dataset.column = this.puyoColumn;
    const puyoColumn = this.grid[this.puyoColumn];
    puyoColumn.push(this.puyo);

    if (this.hardMode) {
      // this.puyo.puyo.style.backgroundImage = 'none';
    }

    const row = puyoColumn.length - 1;
    this.puyo.puyo.dataset.row = row;
  }

  checkForClear() {
    const row = Number(this.puyo.puyo.dataset.row);
    const position = [this.puyoColumn, row];
    const { puyo: { dataset: { color } } } = this.puyo;
    const connectedPuyos = this.checkConnections(position, color);

    if (connectedPuyos.length >= 4) {
      connectedPuyos.forEach((puyo) => this.clearPuyo(puyo));
      this.grid.forEach((col) => {
        col.forEach((puyo, i) => {
          // eslint-disable-next-line no-param-reassign
          puyo.puyo.dataset.row = i;
        });
      });
    } else {
      connectedPuyos.forEach((puyo) => {
        const currentPuyo = puyo.puyo;
        currentPuyo.dataset.traversed = 'false';
      });
    }
  }

  clearPuyo(puyo) {
    const currentPuyo = puyo.puyo;
    // currentPuyo.remove();
    // eslint-disable-next-line no-param-reassign
    currentPuyo.style.backgroundImage = 'none';

    let { dataset: { column } } = currentPuyo;
    column = Number(column);
    const idx = this.grid[column].indexOf(puyo);
    this.grid[column].splice(idx, 1);
  }

  checkConnections(position, color, connectedPuyos = []) {
    const [col, row] = position;

    const currentPuyoInstance = this.grid[col][row];
    const currentPuyo = currentPuyoInstance.puyo;
    const { dataset: { traversed } } = currentPuyo;
    if (currentPuyo.dataset.color === color && traversed === 'false') {
      currentPuyo.dataset.traversed = 'true';
      connectedPuyos.push(currentPuyoInstance);
    } else {
      return connectedPuyos;
    }

    if (this.grid[col][row - 1]) {
      connectedPuyos.concat(this.checkConnections([col, row - 1], color, connectedPuyos));
    }
    if (this.grid[col][row + 1]) {
      connectedPuyos.concat(this.checkConnections([col, row + 1], color, connectedPuyos));
    }
    if (this.grid[col - 1] && this.grid[col - 1][row]) {
      connectedPuyos.concat(this.checkConnections([col - 1, row], color, connectedPuyos));
    }
    if (this.grid[col + 1] && this.grid[col + 1][row]) {
      connectedPuyos.concat(this.checkConnections([col + 1, row], color, connectedPuyos));
    }

    return connectedPuyos;
  }

  eachPuyo(callback) {
    this.allPuyos.forEach(callback.bind(this));
  }

  cancelAnimation() {
    cancelAnimationFrame(this.animateId);
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
