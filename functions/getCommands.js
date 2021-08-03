const { readdirSync, stat } = require("fs");
const { blueBright, bold, yellowBright } = require("chalk");

/**
 * Get all of the commands in a directory and set them into a collection.
 * @param {Client} bot The bot we want to set the commands into.
 * @param {string} directory The directory we want to get the commands from.
 */
function getCommands(bot, directory) {
    readdirSync(directory)
        .forEach(file => {
            stat(`${directory}/${file}`, async (error, information) => {
                if (error) throw error;

                if (information.isDirectory()) getCommands(bot, `${directory}/${file}`);
                else if (file.endsWith(".js")) {
                    const command = require(`../${directory}/${file}`);
                    bot.commands.set(command.config.name, command);
                    console.log(bold(`${blueBright("[COMMAND-LOADED]")} ${yellowBright(`${directory}/${file}`)} has loaded!`));
                }
            });
        });
}

module.exports = { getCommands };