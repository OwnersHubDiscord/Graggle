const { readdirSync, stat } = require("fs");
const { blueBright, bold, yellowBright } = require("chalk");

/**
 * Get all of the events in a directory and set them into a collection.
 * @param {Client} bot The bot we want to set the events into.
 * @param {string} directory The directory we want to get the events from.
 */
function getEvents(bot, directory) {
	readdirSync(directory).forEach((file) => {
		stat(`${directory}/${file}`, async (err, information) => {
			if (err) throw err;

			if (information.isDirectory()) getCommands(bot, `${directory}/${file}`);
			else if (file.endsWith(".js")) {
				const event = require(`../${directory}/${file}`);
				bot.on(file.split(".")[0], event.bind(null, bot));
				console.log(
					bold(
						`${blueBright("[EVENT-LOADED]")} ${yellowBright(`${directory}/${file}`)} has loaded!`
					)
				);
			}
		});
	});
}

module.exports = { getEvents };
