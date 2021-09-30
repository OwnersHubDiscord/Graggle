const { Message } = require("discord.js");
const EventHandler = require("../../../lib/classes/EventHandler");

class IntroductionCreate extends EventHandler {
	/**
	 * Emitted whenever an introduction is created.
	 * @param {Message} message The created message.
	 */
	async run(message) {
		if (message.member.roles.cache.get(this.client.config.verifiedRoleId))
			return this.client.logger.debug(
				`Ignoring introduction by ${message.author.tag} [${message.author.id}] as they're already verified!`
			);
		this.client.logger.debug(
			`${message.author.tag} [${message.author.id}] has introduced themselves!`
		);
		return this.client.mongo
			.db("users")
			.collection("introductions")
			.updateOne(
				{ _id: message.author.id },
				{ $set: { url: message.url, content: message.content, timestamp: Date.now() } },
				{ upsert: true }
			);
	}
}

module.exports = IntroductionCreate;
