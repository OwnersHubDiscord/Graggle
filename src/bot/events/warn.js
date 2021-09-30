const EventHandler = require("../../../lib/classes/EventHandler");

class Warn extends EventHandler {
	/**
	 * Emitted for general warnings.
	 * @param {string} info The warning
	 */
	async run(info) {
		this.client.logger.info(`Shard ${this.client.shard.ids[0]} sent a warning: ${info}!`);
		this.client.logger.webhookLog(
			"status",
			`Shard ${this.client.shard.ids[0]} sent a warning: ${info}!`
		);
	}
}

module.exports = Warn;
