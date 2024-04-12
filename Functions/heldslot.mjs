import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';

function changeHeldSlot(username, gslot) {
    const item = gslot.match(/^\$heldslot (\d+)$/)
    let slotitem;
    if (item == null) {
        bot.whisper(username, `&cSisesta argument! &6$kbh`);
        return
    }
    slotitem = bot.inventory.slots[item[1]];
    if ((slotitem == null) || (slotitem == undefined)) {
        bot.whisper(username, `Pole asja slotis &5${item[1]} &6$kbh`);
        return
    }
    if (36 <= item[1] && item[1] <= 44) {
        bot.equip(slotitem, 'hand');
        bot.whisper(username, `Kasutab sloti asjaga &5${slotitem.displayName} &6$kbh`);
    }

    if (36 > item[1] || item[1] > 44) {
        bot.whisper(username, `&cSlot &5${item[1]} &cei ole hotbari piirides! &6$kbh`);
        return
    }
}

export default changeHeldSlot;