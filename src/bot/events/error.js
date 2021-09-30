const EventHandler = require("../../../lib/classes/EventHandler");

class Error extends EventHandler {
	/**
	 * An error was thrown.
	 * @param {Error} error The error that was thrown.
	 */
	async run(error) {
		this.client.logger.info(
			`Shard ${this.client.shard.ids[0]} encountered ${error.name}: ${error.message}`
		);
		const haste = await this.client.functions.uploadHaste(
			this.client,
			`${error.name}: ${error.message}`
		);
		this.client.logger.webhookLog(
			"status",
			`Shard ${this.client.shard.ids[0]} encountered an error: ${haste}`
		);
	}
}

module.exports = Error;
