import { createRequire } from "module";

const require = createRequire(import.meta.url);
const fetch = require('node-fetch');


async function InputUserName(username) {
    let wantedName = username.match(/^\$snipe ([\w_]+)$/);
}
async function getUUID(wantedName) {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    const data = await response.json();
    return data.id; // tagastab UUID
}

async function getName(uuid) {
    const response = await fetch(`https://api.mojang.com/user/profiles/${uuid}/names`);
    const data = await response.json();
    return data[data.length - 1].name; // tagastab praeguse nime
}

async function checkNameChange() {
    if (!date) {
        const uuid = await getUUID(username);
        const name = await getName(uuid);

        if (wantedName === name) {

        } else if (currentName !== name) {
            console.log(`Kasutajanimi on muutunud! Uus nimi: ${name}`);

            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;

            console.log(dateTime)
        }

        setTimeout(checkNameChange, 60 * 1000); // kontrollib iga minuti järel
    }
}


export default InputUserName