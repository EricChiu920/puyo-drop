/* eslint-disable no-param-reassign */
import Puyo from './puyo';
import PairPuyos from './pairPuyos';

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

  changePuyoColumn(newColumn) {
    this.puyoColumn = newColumn;
    this.pairColumn = this.pairColumn - this.puyoColumn + newColumn;
  }

  dropPuyo() {
    this.puyo = new PairPuyos();
    this.allPuyos.push(this.puyo.mainPuyo);
    this.allPuyos.push(this.puyo.pairPuyo);
    this.newPuyo = this.puyo.createPuyo();
    this.puyoColumn = 2;
    this.pairColumn = 3;

    this.newPuyo.forEach((puyo) => this.container.appendChild(puyo));

    this.animate();
  }

  animate() {
    const moving = this.puyo.isMoving();

    if (moving) {
      this.eachPuyo((puyo) => {
        const currentPuyo = puyo.puyo;
        let maxHeight;
        if (currentPuyo.id === 'main-moving') {
          maxHeight = BOARD.height - (this.grid[this.puyoColumn].length + 1) * this.puyoHeight;
        } else if (currentPuyo.id === 'pair-moving') {
          maxHeight = BOARD.height - (this.grid[this.pairColumn].length + 1) * this.puyoHeight;
        } else {
          const rowHeight = Number(currentPuyo.dataset.row) + 1;
          maxHeight = BOARD.height - rowHeight * this.puyoHeight;
        }
        puyo.movePuyoDown(BOARD.interval, maxHeight);
      });

      const mainMoving = this.puyo.mainMoving();
      const pairMoving = this.puyo.pairMoving();

      if (!mainMoving) {
        this.settlePuyo(this.puyo.mainPuyo, this.puyoColumn);
        this.checkForClear(this.puyo.mainPuyo, this.puyoColumn);
      }

      if (!pairMoving) {
        debugger
        this.settlePuyo(this.puyo.pairPuyo, this.pairColumn);
        this.checkForClear(this.puyo.pairPuyo, this.pairColumn);
      }

      this.animateId = requestAnimationFrame(this.animate);
    } else {
      this.dropPuyo();
    }
  }

  settlePuyo(puyo, column) {
    puyo.puyo.dataset.column = column;
    const puyoColumn = this.grid[column];
    puyoColumn.push(puyo);

    if (this.hardMode) {
      this.puyo.puyo.style.backgroundImage = 'none';
    }

    const row = puyoColumn.length - 1;
    puyo.puyo.dataset.row = row;
  }

  checkForClear(settledPuyo) {
    const row = Number(settledPuyo.puyo.dataset.row);
    const position = [this.puyoColumn, row];
    const { puyo: { dataset: { color } } } = settledPuyo;
    const connectedPuyos = this.checkConnections(position, color);

    if (connectedPuyos.length >= 4) {
      connectedPuyos.forEach((puyo) => this.clearPuyo(puyo));
      this.grid.forEach((col) => {
        col.forEach((puyo, i) => {
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
    currentPuyo.style.backgroundImage = 'none';

    let { dataset: { column } } = currentPuyo;
    column = Number(column);
    const idx = this.grid[column].indexOf(puyo);
    this.grid[column].splice(idx, 1);
  }

  checkConnections(position, color, connectedPuyos = []) {
    const [col, row] = position;
    debugger
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

  setDifficulty() {
    this.hardMode = true;
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
