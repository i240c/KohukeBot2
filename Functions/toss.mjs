import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';
import minecraftData from 'minecraft-data'
import { createRequire } from "module";



const require = createRequire(import.meta.url);

const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
//const { GoalNear } = require('mineflayer-pathfinder').goal

const entity = require("prismarine-entity")('1.20')

const mcData = minecraftData('1.20')

let dropping;
let offhandItem;

function firstEmptySlot(inventory) {
    for (let i = 0; i < inventory.slots.length; i++) {
        if (inventory.slots[i] == null) {
            return i;
        }
    }
    return null;
}

async function handleDropCommand(username, message) {
    let parts = message.split(" ");
    let dropValue;
    dropping = true;
    offhandItem = bot.inventory.slots[45];
    if (parts.length === 4) {
        dropValue = message.match(/^\$drop (\d+) ([\w_]+) ([\w_]+)$/);
    }
    else if (parts.length === 3) {
        dropValue = message.match(/^\$drop (\d+) ([\w_]+)$/);

    }
    if (dropValue == null) {
        bot.whisper(username, "&6Vale sisend! &6$kbh");
        return
    }

    let dropItemName = (dropValue[2]);
    let dropCount = parseInt(dropValue[1]);
    let dropTo = dropValue[3];
    let playerEntity = bot.players[dropTo]?.entity.position;
    let dropItem = bot.registry.itemsByName[`${dropItemName}`];
    let maxDropCount = 64; // Maximum number of items that can be dropped at once
    let iterations = Math.floor(dropCount / maxDropCount);
    let remainder = dropCount % maxDropCount;

    if (playerEntity) {
        playerEntity = playerEntity.offset(0, 1, 0);
    }

    if (dropCount == null) {
        dropCount = 1;
    }

    if ((dropTo == null) || (playerEntity == undefined)) {
        dropTo = "errorDropTo";
    }

    if (dropTo !== "errorDropTo") {
        await bot.lookAt(playerEntity, true);
        //await bot.waitForTicks(5);
    }

    if (dropItem == null) {
        bot.whisper(username, "Item not found. &6$kbh");
        return;
    }
    // Check if the item exists in the bot's inventory
    let inventoryItem = bot.inventory.items().find(item => item.type === dropItem.id && item.slot !== 45);
    let offhandCheck = bot.inventory.slots[45];
    // If the item is in the offhand, move it to a regular slot
    if (!inventoryItem && offhandItem && offhandItem.type === dropItem.id) {
        let firstEmptySlotIndex = firstEmptySlot(bot.inventory);
        if ((firstEmptySlotIndex === null) && (offhandCheck !== null)) {
            bot.whisper(username, `&cCannot move &5${dropItemName} &cfrom offhand to inventory. No empty slot available! &6$kbh`);
            return;
        }
        // Add a condition to check if the item is an offhand item
        if (offhandCheck !== null) {
            console.log("e")
            await bot.moveSlotItem(45, firstEmptySlotIndex);
            inventoryItem = bot.inventory.slots[firstEmptySlotIndex];
        }
    }

    if (offhandCheck !== null) {
        // If the item still doesn't exist in the bot's inventory, send a message to the user
        if (!inventoryItem) {
            bot.whisper(username, `&cCannot drop &5${dropItemName} &cbecause it's not in the inventory! &6$kbh`);
            return;
        }
    }
    // Check if the player is trying to drop more items than there are in the inventory
    if (dropCount > inventoryItem.count) {
        bot.whisper(username, `&cCannot drop &5${dropCount} &cof &5${dropItemName}&c Only &5${inventoryItem.count} &cavailable in the inventory! &6$kbh`);
        return;
    }

    for (let i = 0; i < iterations; i++) {
        await bot.toss(dropItem.id, null, maxDropCount);
        await bot.waitForTicks(10);
        console.log(`Dropped ${maxDropCount} ${dropItemName}`);
    }

    if (remainder > 0) {
        await bot.toss(dropItem.id, null, remainder);
        await bot.waitForTicks(10);
        console.log(`Dropped ${remainder} ${dropItemName}`);
    }

    // After dropping the items
    if (offhandItem !== offhandCheck) {
        let remainingItem = bot.inventory.items().find(item => item.type === dropItem.id && item.slot !== 45); // Exclude offhand slot
        if (remainingItem) {
            let offhandSlot = bot.inventory.slots.indexOf(remainingItem);
            if (offhandSlot !== -1) {
                await bot.moveSlotItem(inventoryItem, 45);
               // offhandItem = bot.inventory.slots[45]; // Update offhandItem
                console.log(`Moved ${dropItemName} back to offhand`);
            }
        }
    }

}


export default handleDropCommand;