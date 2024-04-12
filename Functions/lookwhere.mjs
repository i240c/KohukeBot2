import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';

function handleLookWhere(username) {
    bot.whisper(username, "&9Yaw: " + bot.yaw + " &2Pitch: " + bot.pitch + " &6$kbh");
}

export default handleLookWhere;