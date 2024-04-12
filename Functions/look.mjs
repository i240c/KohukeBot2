import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';

function handleLookCommand(username, message) {
    const pointer = message.match(/\$look\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
    if (pointer == null || pointer[1] == null || pointer[2] == null) { //Checks if there is two inputs
        bot.whisper(username, "&cSisestada tuleb kaks sisendit! &6$kbh")
        return
    }

    if (pointer[1] < -180 || pointer[1] > 180 || pointer[2] < -90 || pointer[2] > 90) { //Checks if the degrees are valid
        bot.whisper(username, "&cVaatamise suunad peavad olema x-il -180 ja 180 vahel ja y-il -90 ja 90 vahel! &6$kbh")
        return
    }

    let xyaw = (pointer[1]) * Math.PI / 180; //calculates the yaw to degrees from rad
    let ypitch = (pointer[2]) * Math.PI / 180; //calculates the pitch to degrees from rad
    bot.look(xyaw, ypitch, true); // Look at the inputed place
    console.log(pointer[1], " " + pointer[2])
}


export default handleLookCommand;