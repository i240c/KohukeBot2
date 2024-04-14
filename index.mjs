import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';
import { plugin as autoEat } from 'mineflayer-auto-eat';
import hearts from './Functions/heart.mjs';
import position from './Functions/pos.mjs';
import look from './Functions/look.mjs';
import addUser from './Functions/adduser.mjs';
import removeUser from './Functions/removeuser.mjs';
//import { handleStatusCommand } from './Functions/autoeat.mjs';
import timeBot from './Functions/time.mjs';
//import whereLook from './Functions/lookwhere.mjs';
import dropBot from './Functions/toss.mjs';
import moveitem from './Functions/moveitem.mjs';
import heldslot from './Functions/heldslot.mjs';
import namestatus from './Functions/namestatus.mjs';
import checkname from './Functions/namelookup.mjs';
//import botStatus from './Functions/status.mjs';
import minecraftData from 'minecraft-data';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const inventoryViewer = require('mineflayer-web-inventory');
const mineflayerViewer = require('prismarine-viewer').mineflayer
const entity = require("prismarine-entity")('1.20')
const readline = require('readline');

const mcData = minecraftData('1.20');

const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms))

// Setup global bot arguments
let botArgs = {
    host: 'mc.nphsmp.eu',
    port: '25565',
    version: '1.20'
};

// Bot class
class MCBot {

    // Constructor
    constructor(username, password, auth) {
        this.username = username;
        this.password = password;
        this.auth = auth;
        this.host = botArgs["host"];
        this.port = botArgs["port"];
        this.version = botArgs["version"];

        // Initialize the bot
        this.initBot();
    }

    // Initialize bot instance
    initBot() {
        global.bot = mineflayer.createBot({
            "username": this.username,
            "password": this.password,
            "auth": this.auth,
            "host": this.host,
            "port": this.port,
            "version": this.version
        });

        // Add to list
        botNames.push(bot.username);

        // Initialize bot events
        this.initEvents();
    }

    // Logger
    log(...msg) {
        console.log(`[${bot.username}]`, ...msg);
    }

    // Chat intake logger
    chatLog(username, ...msg) {
        if (!botNames.includes(username)) {
            this.log(chalk.ansi256(98)(`<${username}>`), ...msg)
        }
    }


    // Init bot events
    initEvents() {

        bot.on('login', async () => {
            let botSocket = bot._client.socket;
            this.log(chalk.ansi256(34)(`Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`));
        });

        bot.on('end', async (reason) => {
            this.log(chalk.red(`Disconnected: ${reason}`));

            // Bot peacefully disconnected
            if (reason == "disconnect.quitting") {
                return
            }
            // Unhandled disconnections
            else {
                //
            }

            // Attempt to reconnect
            setTimeout(() => this.initBot(), 5000);
        });

        let autoEatStatus = false;
        let periodicStatus = false;
        let isEating = false;
        let autoSleep = false;
        let delay;
        let msDelay;


        bot.loadPlugin(autoEat);

        //Events on death
        bot.on('death', () => {
            let position = bot.entity.position;
            let deathTime = new Date();
            let deathLog = `Death at x: ${position.x}, y: ${position.y}, z: ${position.z} at ${deathTime}\n`;
            //Ping me in chat and scream
            bot.chat("@240c &cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!!!");
            periodicStatus = false;
            //Write death location and time to file
            fs.appendFile('./BotLogs/Deaths', deathLog, (err) => {
                if (err) throw err;
                //Send log in console
                console.log(deathLog);
                console.log('Death location and time logged !');
                //Teleport to afk spot in server
                bot.chat("/h wandafk");
            });
        });

        //Events once bot joins the server
        bot.once('spawn', async () => {
            this.log(chalk.ansi256(46)(`Spawned in`));
            //Init bot map
            mineflayerViewer(bot, { port: 6001 });
            //chat pattern
            bot.addChatPattern('private message', /^(\w+) messages you: (.*)$/, { parse: true })
            //this.bot.autoEat.options = {startAt: 16} // peaks tegema et saab läbi commandi muuta
            //this.bot.chat("Tervist!");
            //Mapil näitab joont kui bot liigub
            const path = [bot.entity.position.clone()]
            bot.on('move', () => {
                if (path[path.length - 1].distanceTo(bot.entity.position) > 1) {
                    path.push(bot.entity.position.clone())
                    bot.viewer.drawLine('path', path)
                }
            })
        });

        //Võtab chatist msgd ja vaatab commandide jaoks
        bot.on('chat', async (username, message) => {
            this.chatLog(username, message);
            if (message.includes("messages you:")) {
                const message_matcher = message.match(/^(\w+) messages you: (.*)$/);
                if (allowedUser.includes(message_matcher[1])) {

                    if (message_matcher[2].includes("$pos")) {
                        position(message_matcher[1]);
                        return
                    }

                    if (message_matcher[2].includes("$look")) {
                        look(message_matcher[1], message_matcher[2]);
                        return
                    }
                    //This shit does not work
                 /*   if (message_matcher[2].includes("$wlook")) {
                        whereLook(message_matcher[1], message_matcher[2]);
                        return
                 */   }

                if (message_matcher[2].includes("$adduser")) {
                    addUser(message_matcher[2], message_matcher[1]);
                    return
                }

                if (message_matcher[2].includes("$removeuser")) {
                    removeUser(message_matcher[2], message_matcher[1]);
                    return
                }

                if (message_matcher[2].includes("$autoeat")) {
                    handleAutoEatCommand(message_matcher[1], message_matcher[2]);
                    return
                }

                if (message_matcher[2].includes("$heart")) {
                    hearts(message_matcher[1]);
                    return
                }

                if (message_matcher[2].includes("$time")) {
                    timeBot(message_matcher[1]);
                    return
                }

                if (message_matcher[2].includes("$drop")) {
                    dropBot(message_matcher[1], message_matcher[2]);
                    return
                }

                if (message_matcher[2].includes("$status")) {
                    handleStatusCommand(message_matcher[1]);
                    return
                }

                if (message_matcher[2].includes("$moveitem")) {
                    moveitem(message_matcher[1], message_matcher[2]);
                    return
                }

                if (message_matcher[2].includes("$heldslot")) {
                    heldslot(message_matcher[1], message_matcher[2]);
                    return
                }

                if (message_matcher[2].includes("$attack")) {
                    handlePeriodicAttackCommand(message_matcher[1], message_matcher[2]);
                    return
                }

                if (message_matcher[2].includes("$sleep")) {
                    handleAutoSleepCommand(message_matcher[1], message_matcher[2]);
                    return
                }

                if (message_matcher[2].includes("$safk")) {
                    handleAutoSleepCommand(message_matcher[1], message_matcher[2]);
                    sleep(1000);
                    handleAutoEatCommand(message_matcher[1], message_matcher[2]);
                    return
                }

                if (message_matcher[2].includes("$name")) {
                    namestatus(message_matcher[1], message_matcher[2]);
                    return
                }
                //Lülitab auto asjad välja
                if (message_matcher[2].includes("$panic")) {
                    periodicStatus = false;
                    autoSleep = false;
                    autoEatStatus = false;
                    bot.whisper(username, "&cPaanitsestud! &6$kbh");
                    return
                }
                //Kui bot saadab endale siis sõnumis $kbh et ei saadaks chati
                if ((message_matcher[2].includes("$kbh"))) {
                    return
                }

                else if (message_matcher[2].includes("$")) {
                    bot.whisper(message_matcher[1], "&cCommand not found! &6$kbh")
                    return
                }
                //Kui pole command saada sõnumina
                else {
                    bot.chat(message_matcher[2])
                    return
                }
            }
        });

        

        let isSleeping = false;

        //Auto eat
        //Can't get the status working outside the file
        const EventEmitter = require('events');
        //Mingi kahtlane asi mis teeb et loop ei töötaks 24/7
        class Status extends EventEmitter {
            constructor() {
                super();
                this._autoEatStatus = false;
                this._periodicStatus = false;
                this._autoSleep = false;
            }
            //Saab kas 
            get autoEatStatus() {
                return this._autoEatStatus;
            }
            
            set autoEatStatus(value) {
                this._autoEatStatus = value;
                this.emit('eatStatusChange');
            }

            get periodicStatus() {
                return this._periodicStatus;
            }

            set periodicStatus(value) {
                this._periodicStatus = value;
                this.emit('attackStatusChange');
            }
            
            get autoSleep() {
                return this._autoSleep;
            }

            set autoSleep(value) {
                this._autoSleep = value;
                this.emit('sleepStatusChange');
            }
        }

        const status = new Status();
        let eatIntervalId, attackIntervalId, sleepIntervalId;


        status.on('eatStatusChange', () => {
            // Clear the interval if it's already running
            if (eatIntervalId) {
                clearInterval(eatIntervalId);
            }
        });
        status.on('attackStatusChange', () => {
            // Clear the interval if it's already running
            if (attackIntervalId) {
                clearInterval(attackIntervalId);
            }
        });
        status.on('sleepStatusChange', () => {
            // Clear the interval if it's already running
            if (sleepIntervalId) {
                clearInterval(sleepIntervalId);
            }

            if (status.autoEatStatus === true) {
                //Loopib seda koodi iga 3 sekundi tagant
                eatIntervalId = setInterval(() => {
                    // Kui tal hunger <= 17 ja ei maga siis sööb
                    if (bot.food <= 17 || !isSleeping) {
                        isEating = true;
                        eat(17, foodWhitelist).then(function (item) {
                            console.log(`I ate a(n) ${item.name}`)
                            isEating = false;
                        })
                    }
                    // Kui ei saa süüa siis ei juhtu midagi
                    else {
                        return
                    }
                }, 3000);
            }
            // Perioodiline attack
            if (status.periodicStatus === true) {
                attackIntervalId = setInterval(async () => {
                    //Kui bot sööb siis ootab
                    if (!isEating) {
                        await attack();
                    }
                }, msDelay);
            }
            if (status.autoSleep === true) {
                //Kui öö või ta ei maga siis proovib magada, kui panin && siis ei tööta, idk miks nii tho
                if (!bot.time.isDay && !bot.isSleeping) {
                    if (autoSleep == true) {
                        sleepIntervalId = setInterval(async () => {
                            //Otsib voodi
                            const bed = bot.findBlock({
                                matching: block => bot.isABed(block)
                            })
                            if (bed) {
                                try {
                                    isSleeping = true;
                                    await bot.sleep(bed)
                                    isSleeping = false;
                                    // console.log("I'm sleeping")
                                } catch (err) {
                                    //  console.log(`I can't sleep: ${err.message}`)
                                }
                            } else {
                                // console.log('No nearby bed')
                            }

                        }, 3000);
                    }
                }
            }
        });



        //Funktsioon mis tegeleb ründamisega
        async function attack() {
            const entity = bot.entityAtCursor();
            //Kui pole mobi ta ees mängib käe löömise animatsiooni
            if (!entity /*|| bot.blacklist.includes(entity.name)*/) {
                bot.swingArm();
                return;
            }
            //Ründab mobi
            bot.attack(entity, true);
        }
        //Söömise funktsioon, võtab kui tühi peab kõht olema ja lubatud toidud
        const eat = function (threshold, filter = []) {
            return new Promise(async function (resolve, reject) {
                if (bot.food > threshold) console.log(`The bot was too full to eat, skipping.`); // The bot had more hunger than the threshold
                let items = getItems(); // Get a list of food items sorted by food points (Optional : filter)
                if (!items.length) return console.log(`We have no items to eat!`); // We have no edible itemss
                const lastHeldItem = bot.heldItem; // Remember the last held item
                await bot.equip(items[0].id, 'hand'); // Equips food
                await bot.consume() //Eats the food
                if (lastHeldItem) {
                    await bot.equip(lastHeldItem.type, 'hand'); // Re-equip the last held item
                }

                return resolve(items[0]);
                //Info toidu kohta
                function getItems() {
                    let foodByPoints = Object.values(bot.registry.foods).sort((a, b) => b.foodPoints - a.foodPoints); // Sort food items by foodPoints (Yes, I know about foodsByFoodPoints)
                    let filtered = filter.length ? foodByPoints.filter(i => filter.includes(i.name)) : foodByPoints; // If there's a filter use it, use foodByPoints list
                    let edible = filtered.filter(i => bot.inventory.items().map(e => e.name).includes(i.name)) //Looks for the available food
                    return edible;
                }

            })
        }
        function handleAutoSleepCommand(username, message) {
            let sleepMessage = message.match(/^\$sleep (\w+)$/);
            if (sleepMessage == null) { sleepMessage = message.match(/^\$safk (\w+)$/); } //Vaatab kas sõnum on formeeritud regexi järgi
            if (sleepMessage == null) {
                bot.whisper(username, "&cMissing argument! &6$kbh")
                return
            }
            if (["true", "enable", "t", "yes"].includes(sleepMessage[1])) {
                if (autoSleep == true) {
                    bot.whisper(username, "&cAuto sleep is already enabled! &6$kbh")
                }

                else {
                    bot.whisper(username, "&5Auto sleep enabled! &6$kbh")
                    autoSleep = true;
                    status.autoSleep = true;
                }
            }

            else if (["false", "disable", "f", "no"].includes(sleepMessage[1])) {
                if (autoSleep == false) {
                    bot.whisper(username, "&cAuto sleep is already disabled! &6$kbh")
                }

                else {
                    bot.whisper(username, "&5Auto sleep disabled! &6$kbh")
                    autoSleep = false;
                    status.autoSleep = false;
                }
            }
        }
        function handleAutoEatCommand(username, message) {
            let eatMessage = message.match(/^\$autoeat (\w+)$/);
            if (eatMessage == null) { eatMessage = message.match(/^\$safk (\w+)$/); }
            if (eatMessage == null) {
                bot.whisper(username, "&cMissing argument! &6$kbh")
                return
            }

            if (["true", "enable", "t", "yes"].includes(eatMessage[1])) {
                if (autoEatStatus == true) {
                    bot.whisper(username, "&cAuto eat is already enabled! &6$kbh")
                }

                else {
                    bot.whisper(username, "&5Auto eat enabled! &6$kbh")
                    autoEatStatus = true;
                    status.autoEatStatus = true;
                }
            }

            else if (["false", "disable", "f", "no"].includes(eatMessage[1])) {
                if (autoEatStatus == false) {
                    bot.whisper(username, "&cAuto eat is already disabled! &6$kbh")
                }

                else {
                    bot.whisper(username, "&5Auto eat disabled! &6$kbh")
                    autoEatStatus = false;
                    status.autoEatStatus = false;
                }
            }

            else {
                bot.whisper(username, "&cSee peab olema kas true või false! &6$kbh")
            }
        }

        function handleStatusCommand(username) {
            bot.whisper(username, `&5Auto eat status: &6${autoEatStatus} &5Periodic attack status: &6${periodicStatus} &5Delay: &6${delay} &5Auto sleep: &6${autoSleep} &6$kbh`);
        }

        function handlePeriodicAttackCommand(username, message) {
            let parts = message.split(" ");
            let attackValue;
            if (parts.length === 2) {
                attackValue = message.match(/^\$attack ([\w_]+)$/);
                delay = 30;
                msDelay = (delay * 50);
            }

            if (parts.length === 3) {
                attackValue = message.match(/^\$attack ([\w_]+) (\d+)$/);
                delay = attackValue[2];
                msDelay = (delay * 50);
            }

            if (attackValue == null || attackValue == undefined) {
                bot.whisper(username, "&cSee peab olema kas true või false! &6$kbh")
                return
            }

            if (["true", "enable", "t", "yes"].includes(attackValue[1])) {
                if (periodicStatus == true) {
                    bot.whisper(username, "&cPeriodic attack juba töötab! &6$kbh");
                }
                else {
                    bot.whisper(username, "&5Periodic attack hakkas tööle! &6$kbh");
                    periodicStatus = true;
                    status.periodicStatus = true;
                }
            }

            else if (["false", "disable", "f", "no"].includes(attackValue[1])) {
                if (periodicStatus == false) {
                    bot.whisper(username, "&cPeriodic attack on juba kinni! &6$kbh")
                }

                else {
                    bot.whisper(username, "&5Periodic attack läks kinni!")
                    periodicStatus = false;
                    status.periodicStatus = false;
                }
            }
        }

        bot.on('error', async (err) => {
            // Connection error
            if (err.code == 'ECONNREFUSED') {
                this.log(`Failed to connect to ${err.address}:${err.port}`)
            }
            // Unhandled errors
            else {
                this.log(`Unhandled error: ${err}`);
            }
        });
    }


}

const ACCOUNT = JSON.parse(
    await readFile(
        new URL('./ACCOUNT.json', import.meta.url)
    )
);

let bots = [];
let botNames = [];
let allowedUser = JSON.parse(await readFile('./USERS.json')); // Read the usernames from the file
let foodWhitelist = JSON.parse(await readFile('./foodWhitelist.json'));
for (const ACC of ACCOUNT) {
    let newBot = new MCBot(ACC.username, ACC.password, ACC.auth)
    bots.push(newBot);
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    const message = input.trim();

    for (const bot of bots) {
        if (message.startsWith("$")) {
            console.log(chalk.red("Shit, sa oleksid saatnud commandi niisama chati!"));
        }
        else {
            global.bot.chat(message);
        }
    }
});

let options = {
    port: 2407,
}


inventoryViewer(bot, options)