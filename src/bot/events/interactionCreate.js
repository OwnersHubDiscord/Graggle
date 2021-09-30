const { Interaction } = require("discord.js");
const EventHandler = require("../../../lib/classes/EventHandler");

class InteractionCreate extends EventHandler {
	/**
	 * Emitted when an interaction is created.
	 * @param {Interaction} interaction The interaction which was created
	 */
	async run(interaction) {
		if (interaction.user.bot || !this.client.mongo.topology.s.state === "connected") return;
		if (interaction.isCommand()) {
			this.client.stats.commandsRan++;
			return this.client.commandHandler.handleCommand(interaction);
		}
	}
}

module.exports = InteractionCreate;
