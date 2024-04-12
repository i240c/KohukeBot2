import mineflayer from "mineflayer";
import chalk from "chalk";
import { readFile, writeFile } from 'fs/promises';
import { plugin as autoEat } from 'mineflayer-auto-eat';

/* let autoEatStatus = false;
const eat = function (threshold, filter = []) {
    return new Promise(async function (resolve, reject) {
        if (bot.food > threshold) return reject(new Error("threshold")); // The bot had more hunger than the threshold
        let items = getItems(); // Get a list of food items sorted by food points (Optional : filter)
        if (!items.length) return reject(new Error("no_food")); // We have no edible itemss
        const lastHeldItem = bot.heldItem; // Remember the last held item
        await bot.equip(items[0].id, 'hand'); // Equips food
        await bot.consume() //Eats the food
        if (lastHeldItem) {
            await bot.equip(lastHeldItem.type, 'hand'); // Re-equip the last held item
        }

        return resolve(items[0]);

        function getItems() {
            let foodByPoints = Object.values(bot.registry.foods).sort((a, b) => b.foodPoints - a.foodPoints); // Sort food items by foodPoints (Yes, I know about foodsByFoodPoints)
            let filtered = filter.length ? foodByPoints.filter(i => filter.includes(i.name)) : foodByPoints; // If there's a filter use it, use foodByPoints list
            console.log('FILTERED', filtered)
            let edible = filtered.filter(i => bot.inventory.items().map(e => e.name).includes(i.name)) //Looks for the available food
            return edible;
        }

    })
} 

function handleStatusCommand(username) {
    bot.whisper(username, `&5Auto eat status: &6${autoEatStatus}`);
}

export {
    handleStatusCommand
}
*/