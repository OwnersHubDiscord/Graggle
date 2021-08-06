const { Client } = require("discord.js");
const { endPolls } = require("../functions/endPolls");
const { verifyUsers } = require("../functions/verifyUsers");
const { bold, greenBright, yellowBright } = require("chalk");

/**
 * Whenever the bot is ready this function will be triggered.
 * @param {Client} bot Our discord.js Client.
 **/
module.exports = async (bot) => {
	await bot.application?.fetch();
	const slashCommands = bot.slashCommands.map((command) => command.config);
	await bot.guilds.cache.get("802788546469167105")?.commands.set(slashCommands);
	setInterval(verifyUsers, 900000, bot);
	setInterval(endPolls, 9000000, bot);
	await verifyUsers(bot);
	await endPolls(bot);
	console.log(
		bold(
			`${greenBright("[BOT-STARTED]")} I'm currently in ${yellowBright(
				`${bot.guilds.cache.size} guilds`
			)} with ${yellowBright.bold(`${bot.users.cache.size} cached users`)}!`
		)
	);
};
