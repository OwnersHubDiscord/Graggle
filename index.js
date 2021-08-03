require("dotenv").config();
const { MongoClient } = require("mongodb");
const { bold, greenBright } = require("chalk");
const { getEvents } = require("./functions/getEvents");
const { getButtons } = require("./functions/getButtons");
const { getCommands } = require("./functions/getCommands");
const { Client, Intents, Collection } = require("discord.js");
const { getSlashCommands } = require("./functions/getSlashCommands");

const bot = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS
	]
});
bot.config = process.env;
bot.commands = new Collection();
bot.slashCommands = new Collection();
bot.buttons = new Collection();
bot.mongo = new MongoClient(bot.config.MONGO, { useUnifiedTopology: true });

getCommands(bot, "./commands");
getSlashCommands(bot, "./slashCommands");
getButtons(bot, "./buttons");
getEvents(bot, "./events");

bot.mongo.connect().then(async () => {
	console.log(bold(`${greenBright("[CONNECTED-TO-MONGO]")} Connected to MongoDB!`));
	bot.login(bot.config.TOKEN);
});
