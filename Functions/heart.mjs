import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';

function roundHalf(num) {
    return Math.round(num * 2) / 2;
}

function handleHeartsCommand(username) {
    bot.whisper(username, "&4Health: " + roundHalf(bot.health) + " &6Saturation: " + bot.food + " &bOxygen: " + bot.oxygenLevel + " &aLevel: " + bot.experience.level + " &6$kbh");
}

export default handleHeartsCommand;