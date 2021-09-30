const EventHandler = require("../../../lib/classes/EventHandler");

class ShardReady extends EventHandler {
	/**
	 * A shard is ready.
	 * @param {number} shardID The shard that is ready.
	 * @param {Set<string>} unavailableGuilds The IDs of all the guilds that are unavailable.
	 */
	async run(shardID, unavailableGuilds) {
		this.client.logger.info(
			`Shard ${shardID} Online in ${this.client.guilds.cache.size} servers with ${
				unavailableGuilds?.size || 0
			} unavailable guilds!`
		);
		this.client.logger.webhookLog(
			"status",
			`Shard ${shardID} Online in ${this.client.guilds.cache.size} servers with ${
				unavailableGuilds?.size || 0
			} unavailable guilds!`
		);
	}
}

module.exports = ShardReady;
