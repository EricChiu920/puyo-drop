import './styles/reset.css';
import './styles/global.scss';
import './styles/board.scss';
import './styles/puyo.scss';

import Game from './javascripts/game';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.puyo-drop');
  const playButton = document.querySelector('.play-button');
  const hardModeButton = document.querySelector('.hard-mode');
  let hardMode = false;

  const game = new Game(container);
  function playGame() {
    return () => {
      game.play(hardMode);
    };
  }

  function setDifficulty() {
    hardMode = !hardMode;
  }

  hardModeButton.addEventListener('click', setDifficulty);
  playButton.addEventListener('click', playGame(game));
});
