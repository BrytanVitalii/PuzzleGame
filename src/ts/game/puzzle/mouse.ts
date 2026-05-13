export function getMousePos(
    canvas: HTMLCanvasElement,
    event: MouseEvent
) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}