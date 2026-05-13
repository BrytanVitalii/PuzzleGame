export function initSlider(wrapper: HTMLElement | null): Slider | undefined {
    if (!wrapper) {
        console.error("Slider Wrapper - Not found");
        return;
    }

    const track = wrapper.querySelector<HTMLElement>('.slider__track');
    const next = wrapper.querySelector<HTMLElement>('.slider-wrapper__arrow-next');
    const prev = wrapper.querySelector<HTMLElement>('.slider-wrapper__arrow-back');
    const items = wrapper.querySelectorAll<HTMLElement>('.slider__track-item');
    if (!track || !next || !prev || !items || items.length === 0) return;

    let index = 0;
    let itemsCount = items.length;

    console.log("Slider Initiated.")

    function update() {
        if (!track) {
            console.error("Track is null");
            return;
        }

        track.style.transform = `translateX(-${index * 100}%)`;
    }

    next.addEventListener('click', () => {
        index = Math.min(index + 1, itemsCount - 1);
        update();
    });

    prev.addEventListener('click', () => {
        index = Math.max(index - 1, 0);
        update();
    });

    function getCurrentIndex() {
        return index;
    }

    return {
        getIndex: () => index,
    }
}