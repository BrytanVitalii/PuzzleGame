import { initDiffSelector } from "./components/difficultySelector";
import { loadImage } from "./util/loadImage";
import { promptFile } from "./util/promtFile";

export function initCustomGameFunctionality() {
    const menu = document.getElementById("menu");
    const customGameModal = document.getElementById("custom-game-modal");
    console.log(customGameModal);

    const uploadImageButton = menu?.querySelector<HTMLElement>(".menu__upload");
    const playButton = customGameModal?.querySelector(".custom-game__play-button");
    const customGameImgElement = customGameModal?.querySelector<HTMLImageElement>(".custom-game__img");

    if (!menu || !uploadImageButton || !customGameModal || !customGameImgElement || !playButton) return;

    // Current Custom game info
    const getSelDifficulty = initDiffSelector(customGameModal);
    let image: HTMLImageElement;

    async function onFileImported(file: File | undefined) {
        if (!file) return;

        image = await loadImage(URL.createObjectURL(file));
        if(!image) return;

        showModal();
    }

    const showModal = () => {
        customGameImgElement.src = image.src;
        customGameModal?.classList.add("modal-active")
    };
    const hideModal = () => customGameModal?.classList.remove("modal-active");

    function onPlay() {
        if (!image) return;

        window.dispatchEvent(new CustomEvent('game:start-game', {
            detail: {
                difficulty: getSelDifficulty(),
                levelID: undefined,
                image: image
            }
        }));
        hideModal();
    }

    // Event listeners
    playButton.addEventListener('click', onPlay);

    uploadImageButton.addEventListener('click', async () => {
        onFileImported(await promptFile())
    })

    uploadImageButton.addEventListener("dragenter", (e) => {
        e.preventDefault();
        uploadImageButton.classList.add("menu__upload--dragged-over");
    });

    uploadImageButton.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    uploadImageButton.addEventListener("dragleave", () => {
        uploadImageButton.classList.remove("menu__upload--dragged-over");
    });

    uploadImageButton.addEventListener("drop", (e) => {
        e.preventDefault();

        uploadImageButton.classList.remove("menu__upload--dragged-over");

        const file = e.dataTransfer?.files[0];
        onFileImported(file);
    });
}