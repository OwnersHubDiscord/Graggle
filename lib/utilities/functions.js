const fs = require("fs");
const { createPaste } = require("hastebin");
const BetterClient = require("../extensions/BetterClient");
const { MessageEmbed, MessageActionRow, TextChannel, Guild } = require("discord.js");

module.exports = {
	/**
	 *
	 * @param {string} directory The directory to get files from.
	 * @param {string} extension Get files ending with this extension.
	 * @returns {string[]} All of the file names.
	 */
	getFiles: (directory, extension) => {
		return fs.readdirSync(directory).filter((file) => file.endsWith(extension));
	},
	/**
	 * Generate an error message.
	 * @param {BetterClient} client Our client.
	 * @param {Object} embedInfo All of the information for our embed.
	 * @param {string?} embedInfo.title The title for our embed.
	 * @param {string} embedInfo.description The description for our embed.
	 * @param {string} embedInfo.thumbnail The thumbnail for our embed.
	 * @param {string?} embedInfo.footer The footer for our embed.
	 * @param {MessageActionRow[]?} components The components we want to send with the message.
	 * @param {boolean} ephemeral Whether to end an ephemeral message or not.
	 * @returns {{ embeds: MessageEmbed[], components: MessageActionRow[], ephermal: boolean }} Our generated error message.
	 */
	generateErrorMessage: (client, embedInfo, components = [], ephemeral = true) => {
		const embed = new MessageEmbed()
			.setTitle(embedInfo.title || "")
			.setDescription(embedInfo.description)
			.setThumbnail(embedInfo.thumbnail || client.config.errorImage)
			.setFooter(embedInfo.footer || "")
			.setColor(client.config.colors.error);
		return { embeds: [embed], components: components, ephemeral: ephemeral };
	},
	/**
	 * Upload a string to https://mystb.in/ (HasteBin clone operated by the Pythonista Guild
	 * @param {BetterClient} client Our client.
	 * @param {string} content What we want to haste.
	 * @returns {string|null} The haste link or null if something went wrong.
	 **/
	async uploadHaste(client, content) {
		try {
			return await createPaste(content, {
				contentType: "text/plain",
				server: client.config.hastebin
			});
		} catch (error) {
			client.logger.error(error);
		}
		return null;
	},
	/**
	 * Find a TextChannel from a mention.
	 * @param {BetterClient} client Our client.
	 * @param {string} content The string to get our TextChannel from.
	 * @returns {TextChannel?} The TextChannel found.
	 */
	async getTextChannelFromMention(client, content) {
		if (!content) return null;

		if (content.startsWith("<#") && content.endsWith(">")) {
			content = content.slice(2, -1);

			const channel =
				client.channels.cache.get(content) || (await client.channels.fetch(content));
			if (channel instanceof TextChannel) return channel;
			return null;
		}
	},
	/**
	 * Find a TextChannel from a mention.
	 * @param {BetterClient} client Our client.
	 * @param {string} content THe string to get out TextChannel from.
	 * @param {boolean} modLog Whether to return a ModLog channel.
	 * @returns {TextChannel|ModLog?} The TextChannel found.
	 */
	async getTextChannel(client, content, modLog) {
		if (!content) return null;

		try {
			const channel =
				(await this.getTextChannelFromMention(client, content)) ||
				client.channels.cache.get(content) ||
				client.channels.cache.find(
					(channel) =>
						channel.name.toLowerCase() === content.toLowerCase() && channel.isText()
				) ||
				(await client.channels.fetch(content));
			if (channel instanceof TextChannel)
				return modLog ? new ModLog(client, channel) : channel;
			return null;
		} catch (error) {
			client.logger.error(error);
			return null;
		}
	},
	/**
	 * Find a GuildMember within a Guild from a string.
	 * @param {Guild} guild The Guild we want to find the GuildMember in.
	 * @param {string} content What to search for to get the GuildMember.
	 * @returns {GuildMember|null} The GuildMember found.
	 */
	async getGuildMember(guild, content) {
		try {
			return (
				(await this.getGuildMemberFromMention(guild, content)) ||
				guild.members.cache.get(content) ||
				guild.members.cache.find(
					(member) =>
						member.user.username.toLowerCase() === content.toLowerCase() ||
						member.user.tag.toLowerCase() === content.toLowerCase() ||
						member.displayName.toLowerCase() === content.toLowerCase()
				) ||
				(await guild.members.fetch(content)) ||
				(await guild.members.fetch({ query: content }))
			);
		} catch {
			return null;
		}
	},

	/**
	 * Find a GuildMember within the Guild from a mention.
	 * @param {Guild} guild The Guild we want to find the GuildMember in.
	 * @param {string} mention The mention to check for to get the GuildMember.
	 * @returns {GuildMember|null}
	 */
	async getGuildMemberFromMention(guild, mention) {
		if (!mention) return;

		if (mention.startsWith("<@") && mention.endsWith(">")) {
			mention = mention.slice(2, -1);

			if (mention.startsWith("!")) mention = mention.slice(1);

			return guild.members.cache.get(mention) || (await guild.members.fetch(mention));
		}
	}
};
