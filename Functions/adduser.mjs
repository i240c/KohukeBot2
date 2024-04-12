import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';
async function handleAddUserCommand(newUser, username) {
    let newerUser = newUser.match(/^\$adduser (\w+)$/);
    let allowedUser = JSON.parse(await readFile('./USERS.json'));
    // Check if the username is already in the array
    if (newerUser == null) {
        bot.whisper(username, "&cPead sisestama ka nime! &6$kbh")
        return
    }
    if (!allowedUser.includes(newerUser[1])) {
        // Add the username to the array
        allowedUser.push(newerUser[1]);

        // Write the updated array back to the file
        await writeFile('./USERS.json', JSON.stringify(allowedUser));
        await writeFile('./BotLogs/usersLog.txt', newUser + " " + username + "\n");
    }
};

export default handleAddUserCommand;