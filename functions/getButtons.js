const { readdirSync, stat } = require("fs");
const { blueBright, bold, yellowBright } = require("chalk");

/**
 * Get all of the buttons in a directory and set them into a collection.
 * @param {Client} bot The bot we want to set the commands into.
 * @param {string} directory The directory we want to get the commands from.
 */
function getButtons(bot, directory) {
	readdirSync(directory).forEach((file) => {
		stat(`${directory}/${file}`, async (error, information) => {
			if (error) throw error;

			if (information.isDirectory()) getButtons(bot, `${directory}/${file}`);
			else if (file.endsWith(".js")) {
				const button = require(`../${directory}/${file}`);
				bot.buttons.set(button.config.name, button);
				console.log(
					bold(
						`${blueBright("[BUTTON-LOADED]")} ${yellowBright(`${directory}/${file}`)} has loaded!`
					)
				);
			}
		});
	});
}

module.exports = { getButtons };
