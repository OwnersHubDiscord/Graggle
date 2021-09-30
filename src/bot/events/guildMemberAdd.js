const { GuildMember, MessageEmbed } = require("discord.js");
const EventHandler = require("../../../lib/classes/EventHandler");

class GuildMemberAdd extends EventHandler {
	/**
	 * Emitted whenever a user joins a guild.
	 * @param {GuildMember} member The member that has joined a guild.
	 */
	async run(member) {
		const welcomeChannel = this.client.channels.cache.get(this.client.config.welcomeChannelId);
		if (!welcomeChannel)
			return this.client.logger.debug(
				`I failed to welcome ${member.user.tag} [${member.id}] because the welcome channel [${this.client.config.welcomeChannelId}] doesn't exist!`
			);
		const embed = new MessageEmbed()
			.setTitle("Welcome To Owners Hub!")
			.setDescription(
				"Before being able to join our community there are a few things you must do!\n\nFirst, make sure you meet __at least one__ of the following requirements.\n• You either **own or co-own a server** with a **minimum of 10,000 members** (5,000 members if you're a partnered server).\n• You **own and or develop for a bot** with a **minimum of 10,000 servers**.\n• Are a fairly skilled **developer open to** doing **commissions**.\n• Are either a **graphic designer or artist open to** doing **commissions**.\n• A member of Discord's different moderator programs. Such as **DMD or DMP**.\n\nMake sure to **formally introduce yourself** as first impressions are important!\nYour introduction must include the following!\n• Links to the server(s) / bot(s) that you work with.\n• A small description about the server(s) / bot(s).\n• As well as a small description of yourself!\n\nOnce you have introduced the person who invited you should be able to vouch for you!"
			)
			.setColor(this.client.config.colors.primary)
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/872350369626325002/872573228466466857/7750f287cdbdc519ace5f3c8854c6f6c.png"
			)
			.setFooter(
				"If you have any more questions please feel free to contact a staff member!"
			);
		return welcomeChannel.send({ content: member.toString(), embeds: [embed] });
	}
}

module.exports = GuildMemberAdd;
