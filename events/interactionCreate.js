const { Client, Interaction, MessageButton } = require("discord.js");

/**
 * Whenever an interaction has been created this function will be triggered.
 * @param {Client} bot Our discord.js Client.
 * @param {Interaction} interaction The interaction that was created.
 **/
module.exports = async (bot, interaction) => {
	if (interaction.isCommand()) bot.slashCommands.get(interaction.commandName).execute(bot, interaction);
	else if (interaction.isButton())
		bot.buttons.get(interaction.customId)?.execute(bot, interaction) ||
			bot.buttons
				.find((button) => interaction.customId.startsWith(button.config.name))
				?.execute(bot, interaction);
};
