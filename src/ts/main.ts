import "./game/game";

import { initMainMenu } from "./menu";
import { initLevelSelect } from "./level-select";
import { initGameSounds } from "./game/audio/gameSound";
import { initVictoryModal } from "./game/victoryPopup";
import { initBackground } from "./game/puzzle/background";
import { initCustomGameFunctionality } from "./game/customGame";

initMainMenu();
initGameSounds();
initLevelSelect();
initCustomGameFunctionality();
initVictoryModal();
initBackground();