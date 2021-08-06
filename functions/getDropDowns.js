const { readdirSync, stat } = require("fs");
const { blueBright, bold, yellowBright } = require("chalk");

/**
 * Get all of the drop downs in a directory and set them into a collection.
 * @param {Client} bot The bot we want to set the commands into.
 * @param {string} directory The directory we want to get the commands from.
 */
function getDropDowns(bot, directory) {
	readdirSync(directory).forEach((file) => {
		stat(`${directory}/${file}`, async (error, information) => {
			if (error) throw error;

			if (information.isDirectory()) getDropDowns(bot, `${directory}/${file}`);
			else if (file.endsWith(".js")) {
				const dropDown = require(`../${directory}/${file}`);
				bot.dropDowns.set(dropDown.config.name, dropDown);
				console.log(
					bold(
						`${blueBright("[DROPDOWN-LOADED]")} ${yellowBright(`${directory}/${file}`)} has loaded!`
					)
				);
			}
		});
	});
}

module.exports = { getDropDowns };
