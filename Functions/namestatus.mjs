import { createRequire } from "module";

const require = createRequire(import.meta.url);
const fetch = require('node-fetch');

async function MatchUsername(username, message) {
    // Check if the username is valid
    let user = message.match(/^\$name ([\w_]+)$/); 
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(user[1])) {
        bot.whisper(username,'&cInvalid username. Usernames can be 3-16 characters long and can only contain letters, numbers, and underscores. &6$kbh');
        return;
    }

    // Check if the username is taken
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    if (response.status === 200) {
        bot.whisper(username, '&5Username is taken. &6$kbh');
    } else if (response.status === 204) {
        bot.whisper(username, '&6Username is available. &6$kbh');
    } else {
        bot.whisper(username, '&cAn error occurred. &6$kbh');
    }
}

export default checkUsername
