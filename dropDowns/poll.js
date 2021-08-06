const { Client, MessageEmbed, SelectMenuInteraction } = require("discord.js");

/**
 * Introduce yourself to the Owners Hub server.
 * @param {Client} bot Our discord.js client.
 * @param {SelectMenuInteraction} interaction The interaction that was created..
 * @returns {undefined}
 */
exports.execute = async (bot, interaction) => {
	await bot.mongo
		.db("servers")
		.collection("polls")
		.updateOne(
			{ _id: interaction.message.id },
			{ $set: { [`votes.${interaction.user.id}`]: interaction.values[0] } }
		);
	const embed = new MessageEmbed()
		.setTitle("Opinion Counted")
		.setDescription("Your opinion has been counted for this poll!")
		.setColor(bot.config.MAINCOLOR);
	return interaction.reply({ embeds: [embed], ephemeral: true });
};

exports.config = {
	name: "poll"
};
