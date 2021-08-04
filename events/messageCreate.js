const { MessageEmbed } = require("discord.js");

module.exports = async (bot, message) => {
	if (message.author.bot || !bot.mongo.topology.s.state === "connected") return;

	message.prefix = "/";

	const prefixMention = new RegExp(`^<@!?${bot.user.id}>( |)$`);
	if (prefixMention.test(message.content)) {
		const embed = new MessageEmbed()
			.setAuthor(
				`Hey there, my name is ${bot.user.username} and my prefix is ${message.prefix}`,
				bot.user.displayAvatarURL({ format: "png" })
			)
			.setColor(bot.config.MAINCOLOR);
		return message.reply({ embeds: [embed] });
	}

	if (
		!message.content.toLowerCase().startsWith(message.prefix) &&
		!message.content.toLowerCase().startsWith(`<@!${bot.user.id}>`) &&
		!message.content.toLowerCase().startsWith(`<@${bot.user.id}>`)
	)
		return;
	if (message.content.toLowerCase().startsWith(`<@!${bot.user.id}>` || `<@${bot.user.id}>`))
		args = message.content.slice(23).trim().split(/ +/g);
	else args = message.content.slice(message.prefix.length).trim().split(/ +/g);

	const commandName = args.shift().toLowerCase();
	const command =
		bot.commands.get(commandName.toLowerCase()) ||
		bot.commands.find((cmd) => cmd.config.aliases?.includes(commandName));

	if (!command) return;

	try {
		command.execute(bot, message, args);
	} catch (err) {
		throw err;
	}
};
