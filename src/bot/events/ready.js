const EventHandler = require("../../../lib/classes/EventHandler");
const BetterClient = require("../../../lib/extensions/BetterClient");

class Ready extends EventHandler {
	/**
	 * Emitted when the client becomes ready to start working.
	 * @param {BetterClient} client The client.
	 */
	async run(client) {
		const allGuilds = await client.shard.broadcastEval(() =>
			this.guilds.cache.map((guild) => `${guild.name} [${guild.id}] - ${guild.memberCount}`)
		);
		const guildsStringList = [];
		for (let i = 0; i < allGuilds.length; i++) {
			guildsStringList.push(`Shard ${i + 1}\n${allGuilds[i].join("\n")}`);
		}
		const stats = await client.fetchStats();
		client.logger.info(
			`Logged in as ${client.user.tag} [${client.user.id}] with ${
				stats.guilds
			} guilds (${await client.functions.uploadHaste(
				client,
				`Currently in ${stats.guilds} guilds with ${
					stats.users
				} users.\n\n${guildsStringList.join("\n\n")}`
			)}) and ${stats.users} users`
		);
		return client.user.setPresence({
			status: process.env.NODE_ENV === "development" ? "idle" : "online",
			activities: [
				{
					type: process.env.NODE_ENV === "development" ? "PLAYING" : "WATCHING",
					name:
						process.env.NODE_ENV === "development"
							? "Currently in maintenance mode!"
							: `over Owners Hub!`
				}
			]
		});
	}
}

module.exports = Ready;
