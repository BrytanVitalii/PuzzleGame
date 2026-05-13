// SoundPlayer.ts
// Overenginered? It could be...
class SoundPlayer {
    private activeAudio: HTMLAudioElement[] = [];

    play(src: string, volume: number, loop: boolean, onErrorCallback?: (error: Error) => void): AudioInstance {
        const audio = new Audio(src);

        this.activeAudio.push(audio);
        audio.volume = volume;
        audio.loop = loop;

        const cleanup = () => {
            this.removeAudio(audio);
        };

        const onEnd = () => cleanup();
        const onError = (error: Error) => {
            cleanup(), onErrorCallback?.(error);
        };
        const onAbort = () => cleanup();

        audio.addEventListener("ended", onEnd, { once: true });
        audio.addEventListener("abort", onAbort, { once: true });

        audio.play().catch(onError);

        return {
            stop: () => {
                this.stop(audio);
            },
            setVolume: (newVolume: number) => {
                audio.volume = newVolume;
            }
        };
    }

    private removeAudio(audio: HTMLAudioElement) {
        this.activeAudio = this.activeAudio.filter(a => a !== audio);
    }

    private stop(audio: HTMLAudioElement) {
        audio.pause();
        this.removeAudio(audio);
    }
}

export default new SoundPlayer();