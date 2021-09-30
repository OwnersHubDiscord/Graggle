const { Message } = require("discord.js");
const EventHandler = require("../../../lib/classes/EventHandler");

class MessageCreate extends EventHandler {
	/**
	 * Emitted whenever a message is created.
	 * @param {Message} message The created message.
	 */
	async run(message) {
		if (message.bot || message.webhookId) return;
		if (!message.bot && message.channel.id === this.client.config.introductionsChannelId) return this.client.emit("introductionCreate", message);
	}
}

module.exports = MessageCreate;
