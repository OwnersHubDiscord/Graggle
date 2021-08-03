const { ReturnDocument } = require("mongodb");
const { Client, ButtonInteraction, MessageEmbed } = require("discord.js");

/**
 * Introduce yourself to the Owners Hub server.
 * @param {Client} bot Our discord.js client.
 * @param {ButtonInteraction} interaction The interaction that was created..
 * @returns {undefined}
 */
exports.execute = async (bot, interaction) => {
	const document = await bot.mongo
		.db("users")
		.collection("introductions")
		.findOneAndUpdate(
			{ _id: interaction.customId.split("_")[1] },
			interaction.customId.startsWith("memberVotingYes")
				? { $addToSet: { yes: interaction.user.id }, $pull: { no: interaction.user.id } }
				: { $addToSet: { no: interaction.user.id }, $pull: { yes: interaction.user.id } },
			{ returnDocument: ReturnDocument.AFTER }
		);
	const embed = new MessageEmbed()
		.setTitle("Vote Updated")
		.setDescription(`You have voted on <@${interaction.customId.split("_")[1]}>`)
		.setColor(bot.config.MAINCOLOR);
	await interaction.reply({ embeds: [embed], ephemeral: true });
	return interaction.message.edit({
		embeds: [
			interaction.message.embeds[0].setFields({
				name: "Vote",
				value: `Yes: ${document.value.yes?.length || 0}\nNo: ${
					document.value.no?.length || 0
				}\n\n**They currently ${
					(100 * (document.value.yes?.length || 0)) /
						((document.value.yes?.length || 0) + (document.value.no?.length || 0)) >=
					60
						? "pass"
						: "don't pass"
				} the requirements to get into the server!**`,
				inline: false
			})
		]
	});
};

exports.config = {
	name: "memberVoting"
};
