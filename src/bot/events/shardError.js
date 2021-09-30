const EventHandler = require("../../../lib/classes/EventHandler");

class ShardError extends EventHandler {
	/**
	 * Emitted whenever a shard's WebSocket encounters a connection error.
	 * @param {Error} error The encountered error
	 * @param {number} shardID The shard that encountered this error
	 */
	async run(error, shardID) {
		this.client.logger.info(`Shard ${shardID} encountered ${error.name}: ${error.message}`);
		this.client.logger.error(error, {});
		const haste = await this.client.functions.uploadHaste(
			this.client,
			`${error.name}: ${error.message}`
		);
	}
}

module.exports = ShardError;
