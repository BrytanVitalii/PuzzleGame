import { Difficulty } from "../game/difficulty";

export function initDiffSelector(wrapper: HTMLElement): () => Difficulty {
    // Initialize difficulty buttons
    const diffButtons = {
        easy: wrapper.querySelector('[data-difficulty="easy"]'),
        medium: wrapper.querySelector('[data-difficulty="medium"]'),
        hard: wrapper.querySelector('[data-difficulty="hard"]'),
        expert: wrapper.querySelector('[data-difficulty="expert"]'),
    };

    // State machine
    let currentDifficulty: Difficulty = 'easy';

    function setDifficulty(next: Difficulty) {
        currentDifficulty = next;
        render();
    }

    function render() {
        for (const key of Object.keys(Difficulty) as Array<keyof typeof Difficulty>) {
            diffButtons[key]?.classList.toggle(
                'difficulty--active',
                Difficulty[key] === currentDifficulty
            );
        }
    }

    // Set default difficulty
    setDifficulty(Difficulty.easy);

    // Add event listeners
    diffButtons.easy?.addEventListener('click', () => setDifficulty('easy'));
    diffButtons.medium?.addEventListener('click', () => setDifficulty('medium'));
    diffButtons.hard?.addEventListener('click', () => setDifficulty('hard'));
    diffButtons.expert?.addEventListener('click', () => setDifficulty('expert'));

    function getSelectedDifficulty() {
        return currentDifficulty;
    }

    return getSelectedDifficulty;
}