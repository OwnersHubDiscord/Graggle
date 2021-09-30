const EventHandler = require("../../../lib/classes/EventHandler");

class ShardReconnecting extends EventHandler {
	/**
	 * Emitted when a shard is attempting to reconnect or re-identify.
	 * @param {number} shardID The shard id that is attempting to reconnect
	 */
	async run(shardID) {
		this.client.logger.info(`Shard ${shardID} is reconnecting to the gateway!`);
	}
}

module.exports = ShardReconnecting;
