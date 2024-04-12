import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';

function handleStatusCommand(username) {
    bot.whisper(username, `&5Auto eat status: ${autoEatStatus}`);
}

export default handleStatusCommand;