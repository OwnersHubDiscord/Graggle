const EventHandler = require("../../../lib/classes/EventHandler");

class ShardResume extends EventHandler {
	/**
	 * Emitted when a shard resumes successfully.
	 * @param {number} shardID The shard id that resumed
	 * @param {number} replayedEvents The amount of replayed events.
	 */
	async run(shardID, replayedEvents) {
		this.client.logger.info(`Shard ${shardID} resumed and replayed ${replayedEvents} events!`);
	}
}

module.exports = ShardResume;
