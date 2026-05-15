import { puzzleLevels } from "./game/levels";

import { initSlider } from "./components/slider";
import { initDiffSelector } from "./components/difficultySelector";
import { loadImage } from "./util/loadImage";

export function initLevelSelect() {
    const levelSelectModal = document.getElementById('level-select-modal');
    const levelSelect = document.getElementById('level-select');
    if (!levelSelectModal || !levelSelect) {
        console.error("levelSelectModal, LevelSelect  - Not found");
        return;
    };

    // Initialize Level-Select Modal listeners
    levelSelectModal.addEventListener('click', (e) => {
        if (e.target === levelSelectModal) {
            levelSelectModal.classList.remove("modal-active");
        }
    });
    window.addEventListener('game:start-game', () => {
        levelSelectModal.classList.remove("modal-active");
    });

    // Initialize internals
    const slider = initSlider(document.querySelector<HTMLElement>('.slider-wrapper'));
    if (!slider) {
        console.error("Slider was not initialized!");
        return;
    }

    initButtons(levelSelect, slider);
}

function initButtons(levelSelect: HTMLElement, slider: Slider) {
    const playButton = levelSelect.querySelector('.level-select__play-button');
    const getSelDifficulty = initDiffSelector(levelSelect);

    playButton?.addEventListener('click', async () => {
        const levelID = slider.getIndex();
        const level = puzzleLevels[levelID];

        window.dispatchEvent(new CustomEvent('game:start-game', {
            detail: {
                difficulty: getSelDifficulty(),
                levelID,
                image: await loadImage(level.imagePath)
            }
        }));
    });
}