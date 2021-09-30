const Sentry = require("../utilities/sentry");
const config = require("../../config/bot.config");
const { ShardingManager } = require("discord.js");

class BetterShardingManager extends ShardingManager {
	constructor(file, options) {
		super(file, options);

		this.stats = {
			guilds: 0,
			cachedUsers: 0,
			channels: 0,
			emojis: 0,
			users: 0,
			messages: 0,
			shards: {},
			lastUpdate: Date.now(),
			shardCount: 0
		};
	}
}

module.exports = BetterShardingManager;
