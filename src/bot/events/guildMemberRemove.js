const { GuildMember } = require("discord.js");
const EventHandler = require("../../../lib/classes/EventHandler");

class GuildMemberRemove extends EventHandler {
	/**
	 * Emitted whenever a member leaves a guild, or is kicked.
	 * @param {GuildMember} member The member that has left/been kicked from the guild
	 */
	async run(member) {
		this.client.logger.debug(
			`${member.user.tag} [${member.id}] has left the server so their introduction in the DB was deleted!`
		);
		return this.client.mongo
			.db("users")
			.collection("introductions")
			.deleteOne({ _id: member.id });
	}
}

module.exports = GuildMemberRemove;
