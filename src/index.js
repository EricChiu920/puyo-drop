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
      while (container.lastChild) {
        container.lastChild.remove();
      }
      game.play(hardMode);
    };
  }

  function setDifficulty() {
    hardMode = !hardMode;

    if (hardMode) {
      hardModeButton.style.backgroundColor = "#bd2121e5";
      hardModeButton.style.color = "white";
    } else {
      hardModeButton.style.backgroundColor = "white";
      hardModeButton.style.color = "black";
    }
  }

  hardModeButton.addEventListener('click', setDifficulty);
  playButton.addEventListener('click', playGame(game));
});
