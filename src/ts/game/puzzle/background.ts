export function initBackground() {
    const game = document.querySelector("#game");
    const tableImg = game?.querySelector(".game__background");
    console.log(tableImg)

    function showTable() {
        tableImg?.classList.remove("game__background--main-menu");
    }

    function hideTable() {
        tableImg?.classList.add("game__background--main-menu");
    }

    window.addEventListener('game:start-game', showTable);
    window.addEventListener('game:stop-game', hideTable);
}