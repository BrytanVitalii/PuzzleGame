import { DEFAULT_MUSIC_VOLUME } from "./game/audio/gameSound";

export function initMainMenu() {
    const menu_wrapper = document.querySelector<HTMLElement>('.menu-wrapper');
    const menu = document.querySelector<HTMLElement>('.menu');
    if (!menu_wrapper || !menu) {
        console.error("Menu - Not found");
        return;
    }

    // Get all buttons
    const playButton = menu.querySelector<HTMLElement>('.menu__play-button');
    const uploadButton = menu.querySelector<HTMLElement>('.menu__play-button');

    const settingsButton = menu.querySelector<HTMLElement>('.menu__settings-button');
    if (!playButton || !uploadButton || !settingsButton) {
        console.error("Main menu buttons - Not Found");
        return;
    }

    // Initialize button and event listeners
    initPlayButton(playButton);
    initSettings(settingsButton);

    window.addEventListener('game:start-game', () => {
        menu_wrapper.classList.add("hidden");
    });
    window.addEventListener('game:stop-game', () => {
        menu_wrapper.classList.remove("hidden");
    });
}

function initPlayButton(playButton: HTMLElement) {
    const levelSelectModal = document.getElementById("level-select-modal");
    if (!levelSelectModal) {
        console.error("LevelSelect Modal - Not found");
        return;
    }

    playButton.addEventListener('click', () => {
        levelSelectModal.classList.add('modal-active');
    })
}

function initSettings(settingButton: HTMLElement) {
    const settingsMenu = document.getElementById("settings-menu");
    if (!settingsMenu) {
        console.error("Settings Menu - Not found");
        return;
    }

    const volumeSlider = settingsMenu.querySelector<HTMLInputElement>('.settings__volume-slider');
    if (!volumeSlider) {
        console.error("Volume slider - Not found");
        return;
    }
    
    settingButton.addEventListener('click', () => {
        settingsMenu.classList.toggle('settings--open');
    });
    volumeSlider.addEventListener('input', () => {
        const newVolume = parseFloat(volumeSlider.value);
        window.dispatchEvent(new CustomEvent('game:set-music-volume', {
            detail: { newVolume }
        }));
    });

    // Set default volume slider value
    volumeSlider.value = String(DEFAULT_MUSIC_VOLUME);
    return;
}