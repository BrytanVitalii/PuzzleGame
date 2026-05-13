export function initVictoryModal() {
    const victoryModalWrapper = document.getElementById('victory-modal-wrapper');
    const victoryModal = document.getElementById('victory-modal');


    const homeButton = victoryModal?.querySelector('.victory-modal__home-button');
    homeButton?.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('game:stop-game'));
    });

    function showVictoryModal(event: VictoryEvent) {
        const imageElement = victoryModal?.querySelector('.victory-modal__puzzle-img');

        imageElement?.setAttribute('src', event.detail.image?.src ?? "assets/no-image.png");
        victoryModalWrapper?.classList.add('modal-active');
    }

    function hideVictoryModal() {
        victoryModalWrapper?.classList.remove('modal-active');
    }

    window.addEventListener('game:victory', (event) => {
        showVictoryModal(event as VictoryEvent);
    });

    window.addEventListener('game:stop-game', () => {
        hideVictoryModal();
    });
}