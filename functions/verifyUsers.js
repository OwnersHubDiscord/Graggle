const { getGuildMember } = require("./getGuildMember");

/**
 * Aggregate introductions in the database to verify users who have passed their vote.
 * @param {Client} bot The bot we want to set the commands into.
 */
async function verifyUsers(bot) {
	const guild = bot.guilds.cache.get("802788546469167105");
	const documents = await bot.mongo.db("users").collection("introductions").find({ verified: false });
	const documentsArray = await documents.toArray();
	documentsArray.forEach(async (document) => {
		if (Date.now() - document.timestamp <= 43200000) {
			const member = await getGuildMember(guild, document._id);
			if (member) {
				const channel = guild.channels.cache.get("802792288480657409");
				let message;
				try {
					message = await channel.messages.fetch(document.message);
				} catch {
					return;
				}
				if ((100 * document.yes.length) / (document.yes.length + document.no.length) >= 60) {
					await member.roles.add("811699296809386055");
					await bot.mongo
						.db("users")
						.collection("introductions")
						.updateOne({ _id: document._id }, { $set: { verified: true } });
					return message.edit({
						embeds: [
							message.embeds[0]
								.setFooter(
									`This user has been verified with a vote of ${document.yes.length} to ${document.no.length}!`
								)
								.setColor("#57F287")
								.spliceFields(1, 1)
						],
						components: []
					});
				} else {
					return message.edit({
						embeds: [
							message.embeds[0]
								.setFooter(
									`This user hasn't been verified with a vote of ${document.yes.length} to ${document.no.length}!`
								)
								.setColor("#ED4245")
								.spliceFields(1, 1)
						],
						components: []
					});
				}
			}
		}
	});
}

module.exports = { verifyUsers };
