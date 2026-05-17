import { Difficulty } from "../game/difficulty";
import SoundPlayer from "./SoundPlayer";

export const DEFAULT_MUSIC_VOLUME = 0.04;
export const DEFAULT_VOLUME = 0.25;

const BASE_URL = import.meta.env.BASE_URL;

export async function initGameSounds() {
    const res = await fetch(`${BASE_URL}assets/music/puzzleConnectSounds.json`);
    const files: string[] = await res.json();
    let puzzleConnectSounds: string[] = files.map(file => `${BASE_URL}${file}`);
    const victorySoundPath = `${BASE_URL}assets/music/victorySounds/VictorySound.wav`;
    const victorySoundExpertPath = `${BASE_URL}assets/music/victorySounds/VictorySoundExpert.wav`;

    let backgroundSong: AudioInstance | undefined;
    tryStartBackgroundSong();

    // Try to start background music immediately, if didnt worked wait until interaction
    function tryStartBackgroundSong() {
        if(backgroundSong) return;
        backgroundSong = SoundPlayer.play(`${BASE_URL}assets/music/background.wav`, DEFAULT_MUSIC_VOLUME, true, (_error: Error) => {
            document.addEventListener('click', () => {
                if(backgroundSong) return;
                backgroundSong = SoundPlayer.play(`${BASE_URL}assets/music/background.wav`, DEFAULT_MUSIC_VOLUME, true);
            }, { once: true });
        });
    }

    // Sounds
    function playRandomSnapSound() {
        if (puzzleConnectSounds.length === 0) return;

        const soundPath = puzzleConnectSounds[Math.floor(Math.random() * puzzleConnectSounds.length)];
        SoundPlayer.play(soundPath, 1.0, false);
    }

    // Stop background song temporarly and play victory sound
    function playVictorySound(event: VictoryEvent) {
        if (event.detail.difficulty !== Difficulty.expert) {
            SoundPlayer.play(victorySoundPath, DEFAULT_VOLUME, false);
            return;
        }

        SoundPlayer.play(victorySoundExpertPath, DEFAULT_VOLUME, false);
    }

    // Event listeners
    window.addEventListener('game:piece-snap', () => {
        playRandomSnapSound();
    });
    window.addEventListener('game:victory', (event) => {
        backgroundSong?.stop();
        backgroundSong = undefined;
        playVictorySound(event as VictoryEvent);
    });
    window.addEventListener('game:stop-game', () => {
        tryStartBackgroundSong();
    });
    window.addEventListener('game:set-music-volume', (event) => {
        const volume = (event as BackgroundMusicVolumeEvent).detail.newVolume;
        backgroundSong?.setVolume(volume);
    });
}