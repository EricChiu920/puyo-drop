import './styles/reset.css';
import './styles/global.scss';
import './styles/board.scss';
import './styles/puyo.scss';

import Game from './javascripts/game';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.puyo-drop');
  const playButtons = document.querySelectorAll('.play-button');
  const hardModeButtons = document.querySelectorAll('.hard-mode');
  let hardMode = false;

  const game = new Game(container);

  function playGame(playButton) {
    return () => {
      while (container.lastChild) {
        container.lastChild.remove();
      }

      const startModal = document.querySelector('.start-modal');
      startModal.style.display = 'none';
      game.play(hardMode);
      playButton.blur();
    };
  }

  function setDifficulty(hardModeButton) {
    return () => {
      hardMode = !hardMode;

      if (hardMode) {
        hardModeButton.style.backgroundColor = '#bd2121e5';
        hardModeButton.style.color = 'white';
      } else {
        hardModeButton.style.backgroundColor = 'white';
        hardModeButton.style.color = 'black';
      }
      hardModeButton.blur();
    }
  }

  game.drawHighScores();
  hardModeButtons.forEach((hardmodeButton) => hardmodeButton.addEventListener('click', setDifficulty(hardmodeButton).bind(this)));
  playButtons.forEach((playButton) => playButton.addEventListener('click', playGame(game).bind(this)));
});
