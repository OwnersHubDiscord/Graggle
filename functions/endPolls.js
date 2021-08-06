/**
 * Aggregate introductions in the database to verify users who have passed their vote.
 * @param {Client} bot The bot we want to set the commands into.
 */
async function endPolls(bot) {
	const guild = bot.guilds.cache.get("802788546469167105");
	const documents = bot.mongo.db("servers").collection("polls").find({ finished: false });
	const documentsArray = await documents.toArray();
	documentsArray.forEach(async (document) => {
		if (Date.now() - document.timestamp >= 86400000) {
			let votes = {};
			Object.values(document.votes).forEach((value) => {
				if (!Object.hasOwnProperty.call(votes, value)) votes[value] = 1;
				else votes[value]++;
			});
			if (Object.keys(votes).length === 0) return;
			const highest = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
			if (!highest) return;
			const channel = guild.channels.cache.get(document.channel);
			if (!channel) return;
			let message;
			try {
				message = await channel.messages.fetch(document.message);
			} catch {
				return;
			}
			await bot.mongo.db("servers").collection("polls").deleteOne({ _id: document._id });
			return message.edit({
				content: `${message.content}\n\n>>> *This poll has ended!*\n\nThe winner is **${
					document.questions[parseInt(highest[0]) - 1].question
				}** with **${highest[1]} votes**!`,
				components: []
			});
		}
	});
}

module.exports = { endPolls };
