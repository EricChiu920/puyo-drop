import './styles/reset.css';
import './styles/global.scss';
import './styles/board.scss';

import Game from './javascripts/game';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.puyo-drop');

  const game = new Game(container);
  game.play();
});
