import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';

async function handleRemoveUserCommand(message, username) {
    let allowedUser = JSON.parse(await readFile('./USERS.json'));
    const delUser = message.match(/^\$removeuser (\w+)$/);
    if (delUser[1] == null) {
        bot.whisper(username, "&cPead sisestama ka nime! &6$kbh")
        return
    }
    // Check if the username is "240c" or "Kohukene"
    if (delUser[1] === "240c" || delUser[1] === "Kohukene") {
        bot.whisper(username, "&cÄra mitte mõtlegi!");
        return;
    }

    // Check if the username is in the array
    if (allowedUser.includes(delUser[1])) {
        // Remove the username from the array
        allowedUser = allowedUser.filter(user => user !== delUser[1]);

        // Write the updated array back to the file
        await writeFile('./USERS.json', JSON.stringify(allowedUser));
        await writeFile('./BotLogs/usersLog.txt', newUser + " " + username + "\n");
    }
};

export default handleRemoveUserCommand;
