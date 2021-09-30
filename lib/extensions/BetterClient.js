const { MongoClient } = require("mongodb");
const Logger = require("../classes/Logger.js");
const config = require("../../config/bot.config.js");
const { Collection, Client } = require("discord.js");
const functions = require("../utilities/functions.js");
const ButtonHandler = require("../classes/ButtonHandler");
const CommandHandler = require("../classes/CommandHandler.js");
const DropDownHandler = require("../classes/DropDownHandler");

class BetterClient extends Client {
	/**
	 * Create our new client.
	 * @param {import("discord.js").ClientOptions} options
	 */
	constructor(options) {
		super(options);

		this.usersRunningCommands = new Set();
		this.config = config;
		this.functions = functions;

		this.logger = new Logger(this, "Lifeboat");

		this.commandHandler = new CommandHandler(this);
		this.commands = new Collection();

		this.buttonHandler = new ButtonHandler(this);
		this.buttons = new Collection();

		this.dropDownHandler = new DropDownHandler(this);
		this.dropDowns = new Collection();

		this.events = new Map();

		this.mongo = new MongoClient(process.env.MONGO, { useUnifiedTopology: true });

		this.version =
			process.env.NODE_ENV === "development" ? `${config.version}-dev` : config.version;
		this.owners = new Map();

		this.stats = {
			messageCount: 0,
			commandsRan: 0
		};
		// this.application?.fetch().then(() => {
		// 	if (this.application.owner instanceof User) this.owners.set(user.id, user);
		// 	else
		// 		this.application.owner.members.forEach((teamMember) =>
		// 			this.owners.set(teamMember.user.id, teamMember.user)
		// 		);
		// });

		this.commandHandler.loadCommands();
		this.buttonHandler.loadButtons();
		this.loadEvents();
	}

	async login() {
		await this.mongo.connect();
		return super.login();
	}

	loadEvents() {
		this.functions
			.getFiles(`${(this, __dirname)}/../../src/bot/events/`, ".js")
			.forEach((eventFileName) => {
				const eventName = eventFileName.split(".js")[0];
				const eventFile = require(`${this.__dirname}/../../src/bot/events/${eventName}`);
				const event = new eventFile(this, eventName);
				event.listen();
				this.events.set(eventName, event);
			});
	}

	async fetchStats() {
		const stats = await this.shard.broadcastEval(() => {
			return {
				guilds: this.guilds.cache.size,
				users: this.guilds.cache.reduce(
					(previous, guild) => previous + guild.memberCount,
					0
				),
				cachedUsers: this.users.cache.size,
				channels: this.channels.cache.size,
				roles: this.guilds.cache.reduce(
					(previous, guild) => previous + guild.roles.cache.size,
					0
				)
			};
		});

		return stats.reduce((previous, current) => {
			Object.keys(current).forEach((key) => {
				previous[key] += current[key];
			});
			return previous;
		});
	}
}

module.exports = BetterClient;
