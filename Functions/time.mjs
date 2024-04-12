import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';

function handleTimeCommand(username) {
    bot.whisper(username, "&5Time: " + bot.time.day + "&6 Is day:" + bot.time.isDay +  " &6$kbh");
}

export default handleTimeCommand;