import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';
import minecraftData from 'minecraft-data'
import { createRequire } from "module";


const require = createRequire(import.meta.url);

function handleMoveItemCommand(username, message) {
    const slots = message.match(/^\$moveitem (\d+) (\d+)$/);
    if (slots == null) {
        bot.whisper(username, "&cPuudub argument! &6$kbh");
        return
    }
    if ((slots[1] !== null) || (slots[2] !== null) || 4 < slots[1] && slots[1] < 46 || 4 < slots[2] && slots[2] < 46 || slots[1] !== slots[2]) {
        bot.moveSlotItem(slots[2], slots[1]);
        bot.whisper(username, `&5Asi liigutatud sloti ${slots[1]} &6$kbh`);
    }

    else {
        bot.whisper(username, "&cVale slot sisend! &6$kbh");
        return
    }


}

export default handleMoveItemCommand;