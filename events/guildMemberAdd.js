const { Client, GuildMember, MessageEmbed } = require("discord.js");

/**
 * Whenever the bot is ready this function will be triggered.
 * @param {Client} bot Our discord.js Client.
 * @param {GuildMember} member The member that joined the guild.
 **/
module.exports = async (bot, member) => {
	const welcomeChannel = bot.channels.cache.get("812021897087942717");
	if (!welcomeChannel) return;
	const embed = new MessageEmbed()
		.setTitle("Welcome To Owners Hub!")
		.setDescription(
			"Before being able to join our community there are a few things you must do!\n\nFirst, make sure you meet at least one of the following requirements.\n• You either own, co-own, or manage a server with a **minimum** of 10,000 members (5,000 members if you're a partnered server).\n• You own and or develop for a bot with a **minimum** of 10,000 servers.\n• Are a fairly skilled developer open to doing commissions.\n• Are either a graphic designer or artist open to doing commissions.\n\nMake sure to **formally** introduce yourself as first impressions are important!\nYour introduction **must include**  the following!\n• A link to the server(s) / bot(s) that you want to get in with.\n• A small description about your server(s) / bot(s).\n• As well as a small description of yourself!\n\nYou can use the slash command `/introduce <introduction>` to introduce yourself!"
		)
		.setColor(bot.config.MAINCOLOR)
		.setFooter("If you have any more questions please feel free to contact a staff member!");
	return welcomeChannel.send({ content: member.toString(), embeds: [embed] });
};
