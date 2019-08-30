/* eslint-disable no-param-reassign */
import Puyo from './puyo';
import PairPuyos from './pairPuyos';
import { sleep } from './utils';

const BOARD = {
  height: 770,
  width: 396,
  interval: 4,
};

class Board {
  constructor(container) {
    this.container = container;
    this.puyo = new Puyo();
    this.puyoHeight = this.puyo.getPuyoHeight();
    this.points = 0;
    this.level = 0;
    this.clearing = false;
    this.cleared = true;
    this.queue = [new PairPuyos(), new PairPuyos(), new PairPuyos()];

    // for (let i = 1; i < this.queue.length; i += 1) {
    //   debugger
    //   this.queue[i].createPuyo();
    // }

    this.allPuyos = [];
    this.grid = [];
    for (let i = 0; i < 6; i += 1) {
      this.grid.push([]);
    }

    this.animate = this.animate.bind(this);
    this.clearPuyo = this.clearPuyo.bind(this);
  }

  changePuyoColumn(newColumn) {
    if (this.puyo.pairPuyo.puyo.id !== '') {
      this.pairColumn = this.pairColumn - this.puyoColumn + newColumn;
      this.puyo.pairPuyo.puyo.dataset.column = this.pairColumn;
    }
    if (this.puyo.mainPuyo.puyo.id !== '') {
      this.puyoColumn = newColumn;
      this.puyo.mainPuyo.puyo.dataset.column = this.puyoColumn;
    }
  }

  rotate(maxX, maxY) {
    if (!this.puyo.pairMoving()) {
      return;
    }
    this.puyo.rotate(maxX, maxY);

    if (this.puyo.pairDirection === 'right') {
      this.pairColumn = this.puyoColumn + 1;
    } else if (this.puyo.pairDirection === 'left') {
      this.pairColumn = this.puyoColumn - 1;
    } else {
      this.pairColumn = this.puyoColumn;
    }
    this.puyo.pairPuyo.puyo.dataset.column = this.pairColumn;
  }

  dropPuyo() {
    this.puyo = this.queue.shift();
    this.queue.push(new PairPuyos());
    this.newPuyo = this.puyo.createPuyo();
    this.allPuyos.push(this.puyo.mainPuyo);
    this.allPuyos.push(this.puyo.pairPuyo);
    this.puyoColumn = 2;
    this.pairColumn = 3;

    this.puyo.mainPuyo.puyo.dataset.column = this.puyoColumn;
    this.puyo.pairPuyo.puyo.dataset.column = this.pairColumn;

    this.newPuyo.forEach((puyo) => this.container.appendChild(puyo));
  }

  animate(level) {
    const moving = this.puyo.isMoving();
    const puyosMoved = [];

    this.eachPuyo((puyo) => {
      const currentPuyo = puyo.puyo;
      let height;

      if (currentPuyo.id === '') {
        height = Number(currentPuyo.dataset.row) + 1;
      } else {
        let { column } = currentPuyo.dataset;
        column = Number(column);
        height = Number(this.grid[column].length) + 1;
      }

      const maxHeight = BOARD.height - height * this.puyoHeight;
      const speedIncrease = level * 0.5;

      puyosMoved.push(puyo.movePuyoDown(BOARD.interval + speedIncrease, maxHeight));
    });

    if (!this.clearing && puyosMoved.every((moved) => moved === false)) {
      this.cleared = true;
    }

    const mainMoving = this.puyo.mainMoving();
    const pairMoving = this.puyo.pairMoving();

    if (!mainMoving && this.puyo.mainPuyo.puyo.id.includes('landed')) {
      this.puyo.mainPuyo.puyo.id = '';
      this.settlePuyo(this.puyo.mainPuyo, this.puyoColumn);
    }

    if (!pairMoving && this.puyo.pairPuyo.puyo.id.includes('landed')) {
      this.puyo.pairPuyo.puyo.id = '';
      this.settlePuyo(this.puyo.pairPuyo, this.pairColumn);
    }

    if (!moving) {
      this.eachPuyo((puyo) => this.checkForClear(puyo));
    }

    if (this.cleared && !moving) {
      this.dropPuyo();
    }
  }

  settlePuyo(puyo, column) {
    puyo.puyo.dataset.column = column;
    const puyoColumn = this.grid[column];
    puyoColumn.push(puyo);
    const row = puyoColumn.length - 1;
    puyo.puyo.id = '';

    if (this.hardMode) {
      puyo.puyo.style.backgroundImage = 'none';
    }
    puyo.puyo.dataset.row = row;
  }

  async checkForClear(settledPuyo) {
    let { puyo: { dataset: { column, row } } } = settledPuyo;
    column = Number(column);
    row = Number(row);

    const position = [column, row];
    const { puyo: { dataset: { color } } } = settledPuyo;
    const connectedPuyos = this.checkConnections(position, color);

    if (connectedPuyos.length >= 4) {
      this.clearing = true;
      this.cleared = false;
      this.points += connectedPuyos.length * 100;
      connectedPuyos.forEach((puyo) => this.setClearing(puyo));

      await sleep(100);
      connectedPuyos.forEach((puyo) => this.clearPuyo(puyo));
      this.grid.forEach((col) => {
        col.forEach((puyo, i) => {
          puyo.puyo.dataset.row = i;
        });
      });

      await this.setCleared();
      return true;
    }

    connectedPuyos.forEach((puyo) => {
      const currentPuyo = puyo.puyo;
      currentPuyo.dataset.traversed = 'false';
    });

    return false;
  }

  setClearing(puyo) {
    const currentPuyo = puyo.puyo;
    const { dataset: { color } } = currentPuyo;

    const bgPosition = this.puyo.mainPuyo.getPuyoSprite(color, 'Clearing');
    puyo.puyo.style.backgroundPosition = bgPosition;
  }

  setCleared() {
    this.clearing = false;
  }

  clearPuyo(puyo) {
    const currentPuyo = puyo.puyo;
    // setTimeout(() => currentPuyo.remove(), 0);
    currentPuyo.style.backgroundImage = 'none';

    let { dataset: { column } } = currentPuyo;
    column = Number(column);
    const columnIdx = this.grid[column].indexOf(puyo);
    const allPuyoIdx = this.allPuyos.indexOf(puyo);

    this.allPuyos.splice(allPuyoIdx, 1);
    this.grid[column].splice(columnIdx, 1);
  }

  checkConnections(position, color, connectedPuyos = []) {
    const [col, row] = position;
    const currentPuyoInstance = this.grid[col][row];

    if (currentPuyoInstance === undefined) {
      return connectedPuyos;
    }
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
