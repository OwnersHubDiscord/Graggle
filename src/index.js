require("dotenv-extended").load();
const Logger = require("../lib/classes/Logger.js");
const { version } = require("../config/bot.config");
const BetterShardingManager = require("../lib/extensions/BetterShardingManager.js");

const _version = process.env.NODE_ENV === "development" ? `${version}-dev` : version;
const statusLogger = new Logger(null, "Lifeboat");

let allShardsStarted = false;

const manager = new BetterShardingManager("./src/bot/bot.js", {
	token: process.env.DISCORD_TOKEN
});

statusLogger.info(`Starting Lifeboat ${_version}`);
statusLogger.webhookLog("status", `Starting Lifeboat ${_version}`);

manager.spawn({
	timeout: -1
});

manager.on("shardCreate", (shard) => {
	statusLogger.info(`Starting shard ${shard.id}!`);
	if (shard.id + 1 === manager.totalShards) {
		shard.once("ready", () => {
			setTimeout(() => {
				allShardsStarted = true;
				statusLogger.info("All shards are online and ready!");
				statusLogger.webhookLog("status", "All shards online and ready!");
			}, 200);
		});
	}
});
