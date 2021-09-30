const logger = require("node-color-log");
const init = require("../utilities/sentry.js");
const BetterClient = require("../extensions/BetterClient.js");
const { CommandInteraction, WebhookClient } = require("discord.js");

class Logger {
	/**
	 * Create a new Logger.
	 * @param {BetterClient?} client Our client.
	 * @param {string} name The name of our Logger.
	 */
	constructor(client, name) {
		this.client = client;
		this.name = name;
		/**  @type {Object<string, WebhookClient>} */
		this.webhooks = {};
		this.sentry = init();
	}

	/**
	 * Get the current timestamp.
	 * @returns {string} The current timestamp in the format of "DD/MM/YYYY @ HH:MM:SS"
	 */
	get timestamp() {
		const now = new Date();
		const [year, month, day] = now.toISOString().substr(0, 10).split("-");
		return `${day}/${month}/${year} @ ${now.toISOString().substr(11, 8)}`;
	}

	debug(...args) {
		logger
			.bgColor("magenta")
			.bold()
			.log(`[${this.timestamp}]`)
			.joint()
			.log(` [${this.name}] `)
			.joint()
			.log(...args);
	}

	info(...args) {
		logger
			.bgColor("green")
			.color("black")
			.bold()
			.log(`[${this.timestamp}]`)
			.joint()
			.log(` [${this.name}] `)
			.joint()
			.log(...args);
	}

	warn(...args) {
		logger
			.bgColor("yellow")
			.color("black")
			.log(`[${this.timestamp}]`)
			.joint()
			.log(` [${this.name}] `)
			.joint()
			.log(...args);
	}

	log(...args) {
		this.info(...args);
	}

	oops(...args) {
		this.warn(...args);
	}

	error(error, ...args) {
		logger
			.bgColor("red")
			.bold()
			.log(`[${this.timestamp}]`)
			.joint()
			.log(` [${this.name}] `)
			.joint()
			.log(`${error.stack ?? error.message}`, ...args);
	}

	wtf(...args) {
		this.error(...args);
	}

	/**
	 *
	 * @param {string} type The type of webhook we want to send.
	 * @param {string?} message The message for the webhook.
	 * @param {MessageEmbed[]?} embeds The embeds to send with the webhook.
	 * @param {string?} username The username for the webhook.
	 * @param {string?} avatarURL The avatar for the webhook.
	 * @returns
	 */
	async webhookLog(
		type,
		message = null,
		embeds = [],
		username = null,
		avatarURL = this.client?.user?.displayAvatarURL() || null
	) {
		if (!type) throw new Error("No webhook type provided!");
		if (!this.webhooks[type.toLowerCase()]) {
			const webhookURL = process.env[`${type.toUpperCase()}_HOOK`];
			if (!webhookURL) throw new Error("Invalid webhook type provided!");
			this.webhooks[type.toLowerCase()] = new WebhookClient({
				url: process.env[`${type.toUpperCase()}_HOOK`]
			});
		}
		if (process.env.NODE_ENV !== "production" && type.toLowerCase() === "status") return;
		return await this.webhooks[type.toLowerCase()].send({
			content: message
				? `${
						type.toLowerCase() === "status"
							? `<t:${Math.floor(Date.now() / 1000)}:f>`
							: ""
				  } ${message}`
				: null,
			allowedMentions: { parse: ["users"], roles: [] },
			avatarURL,
			username,
			embeds
		});
	}
}

module.exports = Logger;
