import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';

function handlePosCommand(username) {
    bot.whisper(username, "&5" + Math.floor(bot.entity.position.x) + " " + Math.floor(bot.entity.position.y) + " " + Math.floor(bot.entity.position.z) + " " + "&9" + bot.game.dimension + " &6$kbh");
}

export default handlePosCommand;