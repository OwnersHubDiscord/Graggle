const EventHandler = require("../../../lib/classes/EventHandler");

class ShardDisconnect extends EventHandler {
	/**
	 * Emitted when a shard's WebSocket disconnects and will no longer reconnect.
	 * @param {CloseEvent} event The WebSocket close event
	 * @param {number} shardID The shard id that disconnected
	 */
	async run(event, shardID) {
		this.client.logger.info(
			`Shard ${shardID} Disconnected from the gateway with code ${event.code} and will not reconnect.`
		);
	}
}

module.exports = ShardDisconnect;
